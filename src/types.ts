export interface Bank {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  color?: string;
  support?: number;
}

export type QRTemplate = 'compact2' | 'compact' | 'qr_only' | 'print';

export type DisplayStyle = 'standard' | 'standee' | 'compact' | 'bill';

export interface PaymentData {
  bank: Bank;
  accountNumber: string;
  accountName: string;
  amount: string; // raw number string or formatted
  description: string;
}

export interface SavedAccount {
  id: string;
  bankBin: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  label?: string;
  createdAt: number;
}

export interface QRHistoryItem {
  id: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  description: string;
  createdAt: number;
}
