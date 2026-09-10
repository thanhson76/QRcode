import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Bank } from '../types';
import { ALL_BANKS, POPULAR_BANKS } from '../data/banks';
import { Search, ChevronDown, Check, Building2, X } from 'lucide-react';

interface BankSelectorProps {
  selectedBank: Bank;
  onSelectBank: (bank: Bank) => void;
}

export const BankSelector: React.FC<BankSelectorProps> = ({ selectedBank, onSelectBank }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredBanks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ALL_BANKS;
    return ALL_BANKS.filter(
      (b) =>
        b.shortName.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.bin.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="relative">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
        Ngân hàng thụ hưởng <span className="text-red-500">*</span>
      </label>

      {/* Main trigger button */}
      <button
        id="bank-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs hover:border-emerald-500 dark:hover:border-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center p-1 shrink-0 overflow-hidden">
            {selectedBank.logo ? (
              <img
                src={selectedBank.logo}
                alt={selectedBank.shortName}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white truncate">{selectedBank.shortName}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono font-medium">
                {selectedBank.code}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{selectedBank.name}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : 'group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
      </button>

      {/* Popular quick-select chips */}
      <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] text-slate-600 dark:text-slate-400 shrink-0 font-medium mr-1">Gợi ý nhanh:</span>
        {POPULAR_BANKS.slice(0, 5).map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelectBank(b)}
            className={`px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              selectedBank.code === b.code
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {b.shortName}
          </button>
        ))}
      </div>

      {/* Modal / Dropdown */}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Search bar */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                id="bank-search-input"
                type="text"
                placeholder="Tìm theo tên ngân hàng, mã (VCB, MB, ACB...) hoặc BIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Bank list */}
          <div className="max-h-72 overflow-y-auto p-1.5 divide-y divide-slate-50 dark:divide-slate-800">
            {filteredBanks.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-600 dark:text-slate-400">
                Không tìm thấy ngân hàng phù hợp với "{searchQuery}"
              </div>
            ) : (
              filteredBanks.map((bank) => {
                const isSelected = selectedBank.code === bank.code;
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => {
                      onSelectBank(bank);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-300 font-medium'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={bank.logo}
                          alt={bank.shortName}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{bank.shortName}</span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                            {bank.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{bank.name}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
