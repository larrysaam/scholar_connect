export interface Withdrawal {
  id: string;
  researcher_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  notes?: string;
  requested_at: string;
  processed_at?: string;
}

export interface WithdrawalResponse {
  operationSuccess: boolean;
  transactionSuccess: boolean;
  message?: string;
}
