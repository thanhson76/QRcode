import { Bank, QRTemplate } from '../types';

/**
 * Remove Vietnamese accents/diacritics for banking compatibility
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}

/**
 * Format currency with dot separators (e.g., 500000 -> 500.000)
 */
export function formatCurrencyInput(val: string | number): string {
  if (!val && val !== 0) return '';
  const numStr = String(val).replace(/\D/g, '');
  if (!numStr) return '';
  return Number(numStr).toLocaleString('vi-VN');
}

/**
 * Parse raw number from formatted string
 */
export function parseRawNumber(val: string): number {
  if (!val) return 0;
  const cleaned = val.replace(/\D/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/**
 * Generates VietQR QuickLink image URL
 * https://img.vietqr.io/image/<BANK_BIN>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
 */
export function getVietQRImageUrl(
  bank: Bank,
  accountNumber: string,
  accountName: string,
  amount: number | string,
  description: string,
  template: QRTemplate | string = 'compact2'
): string {
  const cleanAccountNo = accountNumber.replace(/\s+/g, '').trim();
  const rawAmount = typeof amount === 'number' ? amount : parseRawNumber(amount);
  const cleanBankId = bank.bin || bank.code;

  // Crucial: When amount is empty or 0, VietQR's 'compact2' template displays "Số tiền: 0 VND" or "Số tiền: 0đ".
  // Switching to 'compact' template produces the exact same layout (Header + QR + Account Name + Account Number)
  // but WITHOUT any amount row, allowing the payer to enter the amount themselves.
  let resolvedTemplate = template;
  if (rawAmount <= 0) {
    if (resolvedTemplate === 'compact2') {
      resolvedTemplate = 'compact';
    }
  } else {
    if (resolvedTemplate === 'compact') {
      resolvedTemplate = 'compact2';
    }
  }

  const params = new URLSearchParams();
  if (rawAmount > 0) {
    params.set('amount', rawAmount.toString());
  }
  if (description.trim()) {
    params.set('addInfo', description.trim());
  }
  if (accountName.trim()) {
    params.set('accountName', removeVietnameseTones(accountName.trim().toUpperCase()));
  }

  const queryString = params.toString();
  return `https://img.vietqr.io/image/${cleanBankId}-${cleanAccountNo}-${resolvedTemplate}.png${
    queryString ? `?${queryString}` : ''
  }`;
}

/**
 * CRC16-CCITT calculation for EMVCo QR Code
 */
function crc16CCITT(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    crc = ((crc >> 8) | (crc << 8)) & 0xffff;
    crc ^= c & 0xff;
    crc ^= (crc & 0xff) >> 4;
    crc ^= (crc << 12) & 0xffff;
    crc ^= ((crc & 0xff) << 5) & 0xffff;
  }
  crc &= 0xffff;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function emvField(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

/**
 * Generates official EMVCo / VietQR payload string
 * Tag 00: 01 (Version)
 * Tag 01: 11 or 12 (Point of Initiation Method: 11 = Dynamic, 12 = Static)
 * Tag 38: Napas consumer account
 * Tag 53: 704 (VND)
 * Tag 54: Amount
 * Tag 58: VN
 * Tag 62: Additional Data (Memo)
 * Tag 63: CRC
 */
export function generateVietQREMVCo(
  bankBin: string,
  accountNumber: string,
  amount: number,
  description: string
): string {
  const cleanBin = bankBin.trim();
  const cleanAcc = accountNumber.replace(/\s+/g, '').trim();
  const cleanDesc = removeVietnameseTones(description.trim());

  // Sub-tags for Tag 38
  const napasGuid = emvField('00', 'A000000727');
  const beneficiary = emvField('01', `${emvField('00', cleanBin)}${emvField('01', cleanAcc)}`);
  const serviceCode = emvField('02', 'QRIBFTTA');
  const merchantAccountInfo = emvField('38', `${napasGuid}${beneficiary}${serviceCode}`);

  const poiMethod = amount > 0 ? '12' : '11';

  let raw = '';
  raw += emvField('00', '01');
  raw += emvField('01', poiMethod);
  raw += merchantAccountInfo;
  raw += emvField('53', '704'); // VND Currency Code
  if (amount > 0) {
    raw += emvField('54', amount.toString());
  }
  raw += emvField('58', 'VN'); // Country code

  if (cleanDesc) {
    // Tag 62 subtag 08 is reference/purpose
    const subDesc = emvField('08', cleanDesc.slice(0, 50));
    raw += emvField('62', subDesc);
  }

  // Add Tag 63 and compute CRC
  const payloadToCrc = `${raw}6304`;
  const checksum = crc16CCITT(payloadToCrc);
  return `${payloadToCrc}${checksum}`;
}

/**
 * Convert number into Vietnamese words (e.g. 500000 -> Năm trăm nghìn đồng chẵn)
 */
const NUMBERS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readTriple(triple: number, showZeroHundred: boolean): string {
  const h = Math.floor(triple / 100);
  const t = Math.floor((triple % 100) / 10);
  const u = triple % 10;
  let res = '';

  if (h > 0 || showZeroHundred) {
    res += `${NUMBERS[h]} trăm `;
  }

  if (t > 1) {
    res += `${NUMBERS[t]} mươi `;
    if (u === 1) res += 'mốt ';
    else if (u === 4) res += 'tư ';
    else if (u === 5) res += 'lăm ';
    else if (u > 0) res += `${NUMBERS[u]} `;
  } else if (t === 1) {
    res += 'mười ';
    if (u === 1) res += 'một ';
    else if (u === 5) res += 'lăm ';
    else if (u > 0) res += `${NUMBERS[u]} `;
  } else if (t === 0 && u > 0) {
    if (h > 0 || showZeroHundred) res += 'lẻ ';
    res += `${NUMBERS[u]} `;
  }

  return res.trim();
}

export function numberToVietnameseWords(num: number): string {
  if (num <= 0) return '';
  if (num > 999999999999) return 'Số tiền quá lớn';

  const units = ['', 'nghìn', 'triệu', 'tỷ'];
  const groups: number[] = [];
  let temp = num;

  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const val = groups[i];
    if (val > 0) {
      const showZeroHundred = i < groups.length - 1;
      const groupText = readTriple(val, showZeroHundred);
      result += `${groupText} ${units[i]} `;
    }
  }

  result = result.trim();
  if (!result) return '';
  // Capitalize first letter and append "đồng"
  const formatted = result.charAt(0).toUpperCase() + result.slice(1);
  return `${formatted} đồng chẵn`;
}
