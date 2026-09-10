import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Bank, DisplayStyle, QRTemplate } from '../types';
import {
  getVietQRImageUrl,
  generateVietQREMVCo,
  parseRawNumber,
  formatCurrencyInput,
  numberToVietnameseWords,
  removeVietnameseTones
} from '../utils/vietqr';
import {
  Download,
  Copy,
  Printer,
  Share2,
  Check,
  Building2,
  Maximize2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Store,
  FileSpreadsheet
} from 'lucide-react';

interface QRCardPreviewProps {
  bank: Bank;
  accountNumber: string;
  accountName: string;
  amount: string;
  description: string;
  template?: QRTemplate;
}

export const QRCardPreview: React.FC<QRCardPreviewProps> = ({
  bank,
  accountNumber,
  accountName,
  amount,
  description,
  template = 'compact2'
}) => {
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>('standard');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rawAmount = parseRawNumber(amount);
  const formattedAmount = formatCurrencyInput(amount);
  const amountWords = numberToVietnameseWords(rawAmount);
  const cleanAccountName = removeVietnameseTones(accountName.trim()).toUpperCase();

  // Full VietQR card template image URL
  // If rawAmount <= 0, getVietQRImageUrl automatically switches to 'compact' template
  // which does NOT display the amount line (avoids "Số tiền: 0 VND" or "Số tiền 0đ").
  const vietQrCardUrl = getVietQRImageUrl(
    bank,
    accountNumber,
    accountName,
    rawAmount,
    description,
    rawAmount > 0 ? 'compact2' : 'compact'
  );

  // Pure Square QR Code image URL (qr_only)
  const vietQrPureUrl = getVietQRImageUrl(
    bank,
    accountNumber,
    accountName,
    rawAmount,
    description,
    'qr_only'
  );

  // Active URL for display
  const displayQrUrl = displayStyle === 'standee'
    ? vietQrPureUrl
    : displayStyle === 'compact'
      ? vietQrPureUrl
      : vietQrPureUrl;

  // Offline EMVCo payload string
  const emvCoPayload = generateVietQREMVCo(
    bank.bin,
    accountNumber,
    rawAmount,
    description
  );

  // Reset img error on input change
  React.useEffect(() => {
    setImgError(false);
  }, [bank.bin, accountNumber, rawAmount, description, template, displayStyle]);

  // Download image helper
  const downloadFromUrl = async (targetUrl: string, fileName: string) => {
    try {
      setIsDownloading(true);

      // Attempt 1: Direct fetch & blob
      const response = await fetch(targetUrl);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return;
      }
      throw new Error('Direct fetch failed');
    } catch {
      // Fallback: safe anchor download link
      const fallbackLink = document.createElement('a');
      fallbackLink.href = targetUrl;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      fallbackLink.download = fileName;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download QR Code as PNG
  const handleDownload = async (type: 'card' | 'qr_only' = 'card') => {
    const cleanAcc = accountNumber.replace(/\s+/g, '');
    if (type === 'qr_only' || displayStyle === 'compact') {
      await downloadFromUrl(
        vietQrPureUrl,
        `VietQR_${bank.code}_${cleanAcc}_QR_Only.png`
      );
    } else {
      await downloadFromUrl(
        vietQrCardUrl,
        `VietQR_${bank.code}_${cleanAcc}${rawAmount > 0 ? `_${rawAmount}` : ''}.png`
      );
    }
  };

  // Copy Image to clipboard
  const handleCopyImage = async () => {
    try {
      setIsDownloading(true);
      const targetUrl = displayStyle === 'compact' ? vietQrPureUrl : vietQrCardUrl;
      const response = await fetch(targetUrl);
      const blob = await response.blob();

      if (navigator.clipboard && window.ClipboardItem) {
        // Must be image/png
        const pngBlob = blob.type === 'image/png' ? blob : new Blob([blob], { type: 'image/png' });
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': pngBlob })
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } else {
        // Fallback: copy payload text
        await navigator.clipboard.writeText(emvCoPayload);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch (err) {
      console.warn('Copy blob failed, copying info text:', err);
      const textToCopy = `Ngân hàng: ${bank.shortName}\nSTK: ${accountNumber}\nChủ TK: ${cleanAccountName}${rawAmount > 0 ? `\nSố tiền: ${formattedAmount} đ` : ''}\nNội dung: ${description || ''}`;
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } finally {
      setIsDownloading(false);
    }
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Share API
  const handleShare = async () => {
    const amountText = rawAmount > 0
      ? `Số tiền: ${formattedAmount} đ`
      : 'Người chuyển tự nhập số tiền khi quét';

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mã QR chuyển khoản ${bank.shortName}`,
          text: `Chuyển khoản đến ${bank.shortName} - STK: ${accountNumber} (${cleanAccountName}) - ${amountText}`,
          url: vietQrCardUrl
        });
      } catch {
        // ignore abort
      }
    } else {
      handleCopyImage();
    }
  };

  const hasData = accountNumber.trim().length > 0;

  return (
    <div className="flex flex-col items-center w-full">
      {/* View style tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl mb-4 w-full max-w-md text-xs font-medium transition-colors">
        <button
          type="button"
          onClick={() => setDisplayStyle('standard')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            displayStyle === 'standard'
              ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Bản chuẩn (Bảng)</span>
        </button>
        <button
          type="button"
          onClick={() => setDisplayStyle('standee')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            displayStyle === 'standee'
              ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Bảng để bàn</span>
        </button>
        <button
          type="button"
          onClick={() => setDisplayStyle('compact')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            displayStyle === 'compact'
              ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Chỉ mã QR</span>
        </button>
      </div>

      {/* Main Preview Container */}
      <div
        ref={cardRef}
        id="qr-preview-card"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-all print:border-none print:shadow-none print:m-0"
      >
        {/* VIEW 1: Standard Table Style (Directly matches user screenshot!) */}
        {displayStyle === 'standard' && (
          <div className="p-4 sm:p-5">
            {/* Top VietQR & Napas banner */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-red-600 text-lg">VIET<span className="text-blue-600">QR</span></span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium border-l border-slate-200 dark:border-slate-700 pl-2">
                  Chuẩn Napas 247
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>Chính xác 100%</span>
              </div>
            </div>

            {/* Content: Grid with Details on Left & QR on Right */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Left: Info table */}
              <div className="sm:col-span-7 space-y-2.5 text-xs">
                <div className="bg-slate-50/80 dark:bg-slate-800/70 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700/60">
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Tên ngân hàng</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    {bank.shortName}
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-mono">
                      {bank.code}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-800/70 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700/60">
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Tên người nhận</div>
                  <div className="font-bold text-slate-900 dark:text-white uppercase text-sm">
                    {cleanAccountName || <span className="text-slate-400 dark:text-slate-500 font-normal">Chưa nhập tên</span>}
                  </div>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-800/70 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700/60">
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Số tài khoản</div>
                  <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-base tracking-wide">
                    {accountNumber || <span className="text-slate-400 dark:text-slate-500 font-normal font-sans text-xs">Chưa nhập STK</span>}
                  </div>
                </div>

                {rawAmount > 0 && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-100 dark:border-emerald-900/60">
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium mb-0.5">Số tiền</div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-200 text-base">
                      {formattedAmount} <span className="text-xs font-normal">VND</span>
                    </div>
                    {amountWords && (
                      <div className="text-[10px] text-emerald-800 dark:text-emerald-400 italic mt-0.5 leading-tight">
                        ({amountWords})
                      </div>
                    )}
                  </div>
                )}

                {description && (
                  <div className="bg-slate-50/80 dark:bg-slate-800/70 rounded-xl p-2.5 border border-slate-100 dark:border-slate-700/60">
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mb-0.5">Nội dung chuyển khoản</div>
                    <div className="font-medium text-slate-800 dark:text-slate-200 break-words">
                      {description}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: QR Code */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="w-full aspect-square bg-white p-2 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-center">
                  {!imgError && hasData ? (
                    <img
                      src={displayQrUrl}
                      alt="VietQR"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                    />
                  ) : hasData ? (
                    <QRCodeSVG
                      value={emvCoPayload}
                      size={180}
                      level="M"
                      includeMargin={false}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-3 text-slate-400 dark:text-slate-500">
                      <QrCode className="w-10 h-10 mb-1 opacity-40" />
                      <span className="text-[11px]">Vui lòng nhập số tài khoản</span>
                    </div>
                  )}
                </div>

                {/* Footer logos inside card */}
                <div className="flex items-center justify-between w-full px-2 mt-2 text-[10px] text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-red-600">VIET<span className="text-blue-600">QR</span></span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">napas<span className="text-emerald-600">247</span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Store Standee / Bảng Quét Mã Để Bàn Cửa Hàng */}
        {displayStyle === 'standee' && (
          <div className="p-6 text-center bg-radial from-white via-slate-50 to-slate-100/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
            {/* Store header badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2 uppercase tracking-wide">
              <Store className="w-3.5 h-3.5" />
              <span>Quét Mã Thanh Toán</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {cleanAccountName || 'TÊN CHỦ TÀI KHOẢN'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Hỗ trợ tất cả ứng dụng Ngân hàng & Ví điện tử (VCB, MB, Techcombank, Momo...)
            </p>

            {/* QR Box in center */}
            <div className="relative mx-auto w-64 h-64 bg-white p-3 rounded-2xl border-2 border-emerald-500/30 shadow-md flex items-center justify-center mb-4">
              {!imgError && hasData ? (
                <img
                  src={displayQrUrl}
                  alt="VietQR"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : hasData ? (
                <QRCodeSVG
                  value={emvCoPayload}
                  size={230}
                  level="M"
                  includeMargin={false}
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center text-slate-400">
                  <QrCode className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <span className="text-xs">Nhập thông tin tài khoản</span>
                </div>
              )}
            </div>

            {/* Bank details pill */}
            <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3 border border-slate-200/90 dark:border-slate-700 shadow-xs max-w-xs mx-auto text-left space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400">Ngân hàng:</span>
                <span className="font-bold text-slate-900 dark:text-white">{bank.shortName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 dark:text-slate-400">Số tài khoản:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">{accountNumber || '---'}</span>
              </div>
              {rawAmount > 0 && (
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Số tiền:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">{formattedAmount} đ</span>
                </div>
              )}
              {description && (
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Nội dung:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{description}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <span className="text-red-600">VIETQR</span>
              <span>•</span>
              <span className="text-blue-700 dark:text-blue-400">NAPAS 247</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400">CHUYỂN TIỀN NHANH</span>
            </div>
          </div>
        )}

        {/* VIEW 3: Compact QR Only */}
        {displayStyle === 'compact' && (
          <div className="p-6 flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-center">
            <div className="w-64 h-64 bg-white p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center mb-3">
              {!imgError && hasData ? (
                <img
                  src={displayQrUrl}
                  alt="VietQR"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : hasData ? (
                <QRCodeSVG
                  value={emvCoPayload}
                  size={230}
                  level="M"
                  includeMargin={false}
                  className="w-full h-full"
                />
              ) : (
                <div className="text-center text-slate-400 dark:text-slate-500">
                  <QrCode className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <span className="text-xs">Vui lòng nhập số tài khoản</span>
                </div>
              )}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{bank.shortName}</span> -{' '}
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{accountNumber || 'Chưa nhập'}</span>
            </div>
            {rawAmount > 0 && (
              <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                {formattedAmount} đ
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="w-full max-w-md mt-4 space-y-2 print:hidden">
        {/* Dual Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            id="btn-download-qr-card"
            type="button"
            onClick={() => handleDownload('card')}
            disabled={!hasData || isDownloading}
            className="flex items-center justify-center gap-2 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Tải ảnh thẻ VietQR chuẩn có logo ngân hàng và thông tin tài khoản"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{isDownloading ? 'Đang tải...' : 'Tải thẻ VietQR'}</span>
          </button>
          <button
            id="btn-download-qr-only"
            type="button"
            onClick={() => handleDownload('qr_only')}
            disabled={!hasData || isDownloading}
            className="flex items-center justify-center gap-2 py-3 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="Tải riêng mã QR vuông sạch không viền"
          >
            <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Tải chỉ mã QR</span>
          </button>
        </div>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-3 gap-2">
          <button
            id="btn-copy-qr"
            type="button"
            onClick={handleCopyImage}
            disabled={!hasData}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            title="Sao chép ảnh hoặc dữ liệu QR"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Đã chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span>Sao chép</span>
              </>
            )}
          </button>

          <button
            id="btn-print-qr"
            type="button"
            onClick={handlePrint}
            disabled={!hasData}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            title="In mã QR ra giấy hoặc standee để bàn"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>In mã</span>
          </button>

          <button
            id="btn-share-qr"
            type="button"
            onClick={handleShare}
            disabled={!hasData}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
            title="Chia sẻ mã QR qua Zalo, Messenger,..."
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* Guide notice */}
      <div className="w-full max-w-md mt-4 p-3 bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5 print:hidden">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Tiêu chuẩn VietQR Quốc gia:</span> Mã QR tạo ra tương thích 100% với tất cả ứng dụng Mobile Banking của 50+ ngân hàng tại Việt Nam. Người thanh toán chỉ cần mở app ngân hàng quét mã là xong.
        </div>
      </div>
    </div>
  );
};
