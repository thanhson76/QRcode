import React, { useState } from 'react';
import { ALL_BANKS, POPULAR_BANKS } from './data/banks';
import { Bank } from './types';
import { BankSelector } from './components/BankSelector';
import { QRCardPreview } from './components/QRCardPreview';
import { SavedAccountsManager } from './components/SavedAccountsManager';
import { ThemeToggle } from './components/ThemeToggle';
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
  // Preload with standard fictional demo data
  const defaultBank = ALL_BANKS.find((b) => b.code === 'VCB') || POPULAR_BANKS[0];

  const [bank, setBank] = useState<Bank>(defaultBank);
  const [accountNumber, setAccountNumber] = useState('999988886666');
  const [accountName, setAccountName] = useState('NGUYEN VAN A');
  const [amount, setAmount] = useState('500.000');
  const [description, setDescription] = useState('Thanh toan tien hang');

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
    setAccountNumber('999988886666');
    setAccountName('NGUYEN VAN A');
    setAmount('500.000');
    setDescription('Thanh toan tien hang');
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
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-150">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
                Tạo Mã QR Ngân Hàng Thanh Toán
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block truncate">
                Chuẩn VietQR Napas 247 • Chuyển khoản tức thì mọi ngân hàng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle (Sáng / Tối) */}
            <ThemeToggle />

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title="Khôi phục dữ liệu mẫu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Dữ liệu mẫu</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xóa trắng</span>
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
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
              <SavedAccountsManager
                currentBank={bank}
                currentAccountNumber={accountNumber}
                currentAccountName={accountName}
                onSelectAccount={handleSelectSavedAccount}
              />
            </div>

            {/* Core Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-5 transition-colors">
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Thông tin chuyển khoản</span>
                </h2>
                <span className="text-xs text-slate-600 dark:text-slate-400">Đầy đủ & chính xác</span>
              </div>

              {/* 1. Ngân hàng thụ hưởng */}
              <BankSelector
                selectedBank={bank}
                onSelectBank={(b) => setBank(b)}
              />

              {/* 2. Số tài khoản */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="account-number-input" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Số tài khoản <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteAccountNumber}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
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
                    className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-base font-bold tracking-wider placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-sans placeholder:text-sm focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  {accountNumber && (
                    <button
                      type="button"
                      onClick={() => setAccountNumber('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Tên người nhận */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="account-name-input" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Tên người nhận (Chủ tài khoản)
                  </label>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">Tự động viết hoa</span>
                </div>
                <div className="relative">
                  <input
                    id="account-name-input"
                    type="text"
                    placeholder="Ví dụ: NGUYEN VAN A"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold uppercase text-sm placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  {accountName && (
                    <button
                      type="button"
                      onClick={() => setAccountName('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  💡 Gợi ý: Các app ngân hàng hiển thị tốt nhất khi tên người nhận viết hoa không dấu.
                </p>
              </div>

              {/* 4. Số tiền */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="amount-input" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Số tiền (VND)
                  </label>
                  {rawAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount('')}
                      className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold cursor-pointer"
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
                    className="w-full pl-3.5 pr-14 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-base placeholder:font-normal placeholder:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                    VND
                  </div>
                </div>

                {/* Amount in Vietnamese words or empty note */}
                {rawAmount > 0 ? (
                  amountWords && (
                    <div className="mt-1.5 p-2 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-lg text-xs font-medium text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Bằng chữ: <strong>{amountWords}</strong></span>
                    </div>
                  )
                ) : (
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Đang để trống: Người chuyển tự điền khi quét, mã QR xuất ra sẽ không hiển thị số tiền (không để 0đ).</span>
                  </p>
                )}

                {/* Quick amount suggestion chips */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 shrink-0 mr-0.5">Chọn nhanh:</span>
                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSetAmount(val)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        rawAmount === val
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {val >= 1000000 ? `${val / 1000000} triệu` : `${val / 1000}k`}
                    </button>
                  ))}
                  {rawAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleAddAmount(100000)}
                      className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/80 cursor-pointer"
                    >
                      +100k
                    </button>
                  )}
                </div>
              </div>

              {/* 5. Nội dung chuyển khoản */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="description-input" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Nội dung chuyển khoản
                  </label>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
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
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  {description && (
                    <button
                      type="button"
                      onClick={() => setDescription('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick memo suggestions */}
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 shrink-0 mr-0.5">Gợi ý:</span>
                  {['Tra luong', 'Thanh toan tien hang', 'Tien cafe', 'Tra tien com', 'Tien phong tro', 'Ung ho'].map((memo) => (
                    <button
                      key={memo}
                      type="button"
                      onClick={() => setDescription(memo)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        description === memo
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {memo}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Instruction Accordion / FAQ */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs text-xs text-slate-600 dark:text-slate-400 space-y-2 transition-colors">
              <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Cách thức hoạt động</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Chuẩn VietQR Napas 247:</strong> Dữ liệu mã QR được mã hóa theo tiêu chuẩn EMVCo quốc gia.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Không cần nhớ số tài khoản:</strong> Người quét chỉ cần mở app ngân hàng bất kỳ (VCB Digibank, Techcombank Mobile, MBBank, Cake, Momo...) quét mã là hệ thống tự điền đúng tên người nhận, STK, số tiền và nội dung.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">An toàn 100%:</strong> Không yêu cầu đăng nhập mật khẩu hay OTP ngân hàng của bạn.
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
