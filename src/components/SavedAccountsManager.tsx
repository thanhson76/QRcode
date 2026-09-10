import React, { useState, useEffect } from 'react';
import { SavedAccount, Bank } from '../types';
import { ALL_BANKS } from '../data/banks';
import { Bookmark, Plus, Trash2, Check, UserCheck, X } from 'lucide-react';

interface SavedAccountsManagerProps {
  currentBank: Bank;
  currentAccountNumber: string;
  currentAccountName: string;
  onSelectAccount: (bank: Bank, accountNumber: string, accountName: string) => void;
}

const STORAGE_KEY = 'vietqr_saved_accounts';

export const SavedAccountsManager: React.FC<SavedAccountsManagerProps> = ({
  currentBank,
  currentAccountNumber,
  currentAccountName,
  onSelectAccount
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [labelInput, setLabelInput] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed: SavedAccount[] = JSON.parse(data);
        // Ensure any previously saved default/real account is purged/replaced with fictional sample data
        const cleaned = parsed.map((acc) => {
          if (acc.id === 'default-vcb' || acc.accountNumber === '0611001946522' || acc.accountName.toLowerCase().includes('thanh son')) {
            return {
              ...acc,
              id: 'default-vcb',
              bankBin: '970436',
              bankCode: 'VCB',
              accountNumber: '999988886666',
              accountName: 'NGUYEN VAN A',
              label: 'Tài khoản mẫu (VCB)'
            };
          }
          return acc;
        });
        setSavedAccounts(cleaned);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      } else {
        // Preload default fictional demo account
        const initialAccounts: SavedAccount[] = [
          {
            id: 'default-vcb',
            bankBin: '970436',
            bankCode: 'VCB',
            accountNumber: '999988886666',
            accountName: 'NGUYEN VAN A',
            label: 'Tài khoản mẫu (VCB)',
            createdAt: Date.now()
          }
        ];
        setSavedAccounts(initialAccounts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAccounts));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveToStorage = (accounts: SavedAccount[]) => {
    setSavedAccounts(accounts);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    } catch {
      // Ignore
    }
  };

  const handleSaveCurrent = () => {
    if (!currentAccountNumber.trim()) return;

    const existingIndex = savedAccounts.findIndex(
      (a) => a.accountNumber.replace(/\s+/g, '') === currentAccountNumber.replace(/\s+/g, '') &&
             a.bankBin === currentBank.bin
    );

    const newAccount: SavedAccount = {
      id: Date.now().toString(),
      bankBin: currentBank.bin,
      bankCode: currentBank.code,
      accountNumber: currentAccountNumber.trim(),
      accountName: currentAccountName.trim(),
      label: labelInput.trim() || `${currentBank.shortName} - ${currentAccountName || 'Cá nhân'}`,
      createdAt: Date.now()
    };

    let updated: SavedAccount[];
    if (existingIndex >= 0) {
      updated = [...savedAccounts];
      updated[existingIndex] = newAccount;
    } else {
      updated = [newAccount, ...savedAccounts];
    }

    saveToStorage(updated);
    setLabelInput('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedAccounts.filter((a) => a.id !== id);
    saveToStorage(updated);
  };

  const isCurrentSaved = savedAccounts.some(
    (a) => a.accountNumber.replace(/\s+/g, '') === currentAccountNumber.replace(/\s+/g, '') &&
           a.bankBin === currentBank.bin
  );

  return (
    <div className="w-full">
      {/* Trigger & Quick List */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <Bookmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Tài khoản đã lưu ({savedAccounts.length})</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold cursor-pointer"
        >
          Quản lý
        </button>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none mb-3">
        {savedAccounts.map((acc) => {
          const bank = ALL_BANKS.find((b) => b.bin === acc.bankBin || b.code === acc.bankCode) || currentBank;
          const isSelected =
            currentAccountNumber.replace(/\s+/g, '') === acc.accountNumber.replace(/\s+/g, '') &&
            currentBank.bin === acc.bankBin;

          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => onSelectAccount(bank, acc.accountNumber, acc.accountName)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all shrink-0 border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-300 font-semibold shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">{acc.bankCode}</span>
              <span className="truncate max-w-[110px]">{acc.label || acc.accountName}</span>
              {isSelected && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            </button>
          );
        })}

        {/* Quick Save current account button */}
        {currentAccountNumber && !isCurrentSaved && (
          <button
            type="button"
            onClick={handleSaveCurrent}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shrink-0 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Lưu TK này</span>
          </button>
        )}
        {justSaved && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0 font-medium">
            <Check className="w-3.5 h-3.5" /> Đã lưu!
          </span>
        )}
      </div>

      {/* Manage Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Danh sách tài khoản ngân hàng của bạn</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto space-y-2">
              {savedAccounts.length === 0 ? (
                <div className="text-center py-6 text-slate-600 dark:text-slate-400 text-sm">
                  Chưa có tài khoản nào được lưu. Bạn có thể lưu thông tin tài khoản hiện tại bên dưới!
                </div>
              ) : (
                savedAccounts.map((acc) => {
                  const bank = ALL_BANKS.find((b) => b.bin === acc.bankBin || b.code === acc.bankCode) || currentBank;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        onSelectAccount(bank, acc.accountNumber, acc.accountName);
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-750 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
                          {bank.logo ? (
                            <img
                              src={bank.logo}
                              alt={bank.shortName}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <UserCheck className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                              {acc.label || acc.accountName}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                              {acc.bankCode}
                            </span>
                          </div>
                          <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {acc.accountNumber}
                          </div>
                          {acc.accountName && (
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 uppercase">
                              {acc.accountName}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(acc.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Xóa tài khoản này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Add Form inside modal */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Lưu tài khoản đang nhập ({currentBank.shortName} - {currentAccountNumber || '...'}):
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Gợi nhớ (ví dụ: VCB Lương, Shop Online...)"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={handleSaveCurrent}
                  disabled={!currentAccountNumber.trim()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
