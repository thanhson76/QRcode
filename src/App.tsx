import React, { useState } from 'react';
import { ALL_BANKS, POPULAR_BANKS } from './data/banks';
import { Bank } from './types';
import { BankSelector } from './components/BankSelector';
import { QRCardPreview } from './components/QRCardPreview';
import { SavedAccountsManager } from './components/SavedAccountsManager';
import {
  formatCurrencyInput,
  parseRawNumber,
  numberToVietnameseWords,
  removeVietnameseTones
} from './utils/vietqr';
import {
  QrCode,
  RotateCcw,
  Sparkles,
  ClipboardPaste,
  X,
  CreditCard,
  Building2,
  DollarSign,
  FileText,
  User,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Preload with the exact values from the user's screenshot!
  const defaultBank = ALL_BANKS.find((b) => b.code === 'VCB') || POPULAR_BANKS[0];

  const [bank, setBank] = useState<Bank>(defaultBank);
  const [accountNumber, setAccountNumber] = useState('0611001946522');
  const [accountName, setAccountName] = useState('Lam Thanh Son');
  const [amount, setAmount] = useState('500.000');
  const [description, setDescription] = useState('Tra luong');

  // Handle formatted amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    const formatted = Number(rawValue).toLocaleString('vi-VN');
    setAmount(formatted);
  };

  // Add quick amount
  const handleAddAmount = (addVal: number) => {
    const currentVal = parseRawNumber(amount);
    const newVal = currentVal + addVal;
    setAmount(newVal.toLocaleString('vi-VN'));
  };

  const handleSetAmount = (val: number) => {
    setAmount(val.toLocaleString('vi-VN'));
  };

  // Paste account number
  const handlePasteAccountNumber = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setAccountNumber(text.replace(/\s+/g, ''));
      }
    } catch {
      // ignore
    }
  };

  // Reset to default sample
  const handleReset = () => {
    setBank(defaultBank);
    setAccountNumber('0611001946522');
    setAccountName('Lam Thanh Son');
    setAmount('500.000');
    setDescription('Tra luong');
  };

  // Clear all fields
  const handleClearAll = () => {
    setAccountNumber('');
    setAccountName('');
    setAmount('');
    setDescription('');
  };

  // Selected account from saved accounts
  const handleSelectSavedAccount = (selectedBank: Bank, accNo: string, accName: string) => {
    setBank(selectedBank);
    setAccountNumber(accNo);
    setAccountName(accName);
  };

  const rawAmount = parseRawNumber(amount);
  const amountWords = numberToVietnameseWords(rawAmount);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Tạo Mã QR Ngân Hàng Thanh Toán
              </h1>
              <p className="text-xs text-slate-600 hidden sm:block">
                Chuẩn VietQR Napas 247 • Chuyển khoản tức thì mọi ngân hàng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Khôi phục dữ liệu mẫu từ ảnh"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dữ liệu mẫu</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xóa trắng</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Input Form */}
          <section className="lg:col-span-7 space-y-5">
            {/* Saved Accounts Widget */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
              <SavedAccountsManager
                currentBank={bank}
                currentAccountNumber={accountNumber}
                currentAccountName={accountName}
                onSelectAccount={handleSelectSavedAccount}
              />
            </div>

            {/* Core Form Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Thông tin chuyển khoản</span>
                </h2>
                <span className="text-xs text-slate-600">Đầy đủ & chính xác</span>
              </div>

              {/* 1. Ngân hàng thụ hưởng */}
              <BankSelector
                selectedBank={bank}
                onSelectBank={(b) => setBank(b)}
              />

              {/* 2. Số tài khoản */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="account-number-input" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Số tài khoản <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteAccountNumber}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Dán từ clipboard</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="account-number-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="Nhập số tài khoản ngân hàng..."
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-base font-bold tracking-wider placeholder:text-slate-400 placeholder:font-sans placeholder:text-sm focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  {accountNumber && (
                    <button
                      type="button"
                      onClick={() => setAccountNumber('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Tên người nhận */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="account-name-input" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Tên người nhận (Chủ tài khoản)
                  </label>
                  <span className="text-[11px] text-slate-600">Tự động viết hoa</span>
                </div>
                <div className="relative">
                  <input
                    id="account-name-input"
                    type="text"
                    placeholder="Ví dụ: LAM THANH SON"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold uppercase text-sm placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  {accountName && (
                    <button
                      type="button"
                      onClick={() => setAccountName('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  💡 Gợi ý: Các app ngân hàng hiển thị tốt nhất khi tên người nhận viết hoa không dấu.
                </p>
              </div>

              {/* 4. Số tiền */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="amount-input" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Số tiền (VND)
                  </label>
                  {rawAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount('')}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold"
                    >
                      Xóa số tiền (Tự nhập khi quét)
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="amount-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="Để trống nếu người chuyển tự điền..."
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full pl-3.5 pr-14 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-base placeholder:font-normal placeholder:text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    VND
                  </div>
                </div>

                {/* Amount in Vietnamese words or empty note */}
                {rawAmount > 0 ? (
                  amountWords && (
                    <div className="mt-1.5 p-2 bg-emerald-50/80 border border-emerald-100 rounded-lg text-xs font-medium text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Bằng chữ: <strong>{amountWords}</strong></span>
                    </div>
                  )
                ) : (
                  <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Đang để trống: Người chuyển tự điền khi quét, mã QR xuất ra sẽ không hiển thị số tiền (không để 0đ).</span>
                  </p>
                )}

                {/* Quick amount suggestion chips */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-600 shrink-0 mr-0.5">Chọn nhanh:</span>
                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSetAmount(val)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                        rawAmount === val
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {val >= 1000000 ? `${val / 1000000} triệu` : `${val / 1000}k`}
                    </button>
                  ))}
                  {rawAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleAddAmount(100000)}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                    >
                      +100k
                    </button>
                  )}
                </div>
              </div>

              {/* 5. Nội dung chuyển khoản */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="description-input" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Nội dung chuyển khoản
                  </label>
                  <span className="text-[11px] text-slate-600">
                    {description.length}/50 ký tự
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="description-input"
                    type="text"
                    maxLength={50}
                    placeholder="Ví dụ: Tra luong, Tien com, Thanh toan hoa don..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  {description && (
                    <button
                      type="button"
                      onClick={() => setDescription('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick memo suggestions */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-600 shrink-0 mr-0.5">Gợi ý:</span>
                  {['Tra luong', 'Thanh toan tien hang', 'Tien cafe', 'Tra tien com', 'Tien phong tro', 'Ung ho'].map((memo) => (
                    <button
                      key={memo}
                      type="button"
                      onClick={() => setDescription(memo)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                        description === memo
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {memo}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Instruction Accordion / FAQ */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Cách thức hoạt động</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 leading-relaxed">
                <li>
                  <strong className="text-slate-800">Chuẩn VietQR Napas 247:</strong> Dữ liệu mã QR được mã hóa theo tiêu chuẩn EMVCo quốc gia.
                </li>
                <li>
                  <strong className="text-slate-800">Không cần nhớ số tài khoản:</strong> Người quét chỉ cần mở app ngân hàng bất kỳ (VCB Digibank, Techcombank Mobile, MBBank, Cake, Momo...) quét mã là hệ thống tự điền đúng tên người nhận, STK, số tiền và nội dung.
                </li>
                <li>
                  <strong className="text-slate-800">An toàn 100%:</strong> Không yêu cầu đăng nhập mật khẩu hay OTP ngân hàng của bạn.
                </li>
              </ul>
            </div>
          </section>

          {/* RIGHT COLUMN: Realtime Live QR Preview Card & Actions */}
          <section className="lg:col-span-5 sticky top-20 flex flex-col items-center">
            <QRCardPreview
              bank={bank}
              accountNumber={accountNumber}
              accountName={accountName}
              amount={amount}
              description={description}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
