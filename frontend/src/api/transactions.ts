import { apiRequest } from './config';

export interface CreateTransactionDTO {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category_id?: number | null;
  payment_method?: string;
}

export interface Transaction {
  id: number;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  categoryId: number | null;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export async function createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
  const response = await apiRequest<{ transaction: Transaction }>('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  return response.transaction;
}

export async function listTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  category_id?: number;
  type?: 'income' | 'expense';
}): Promise<Transaction[]> {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.category_id) queryParams.append('category_id', filters.category_id.toString());
    if (filters.type) queryParams.append('type', filters.type);
  }
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';
  
  const response = await apiRequest<{ transactions: Transaction[] }>(endpoint);
  return response.transactions;
}

export async function deleteTransaction(id: number): Promise<void> {
  await apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
  });
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

export async function getBalance(): Promise<Balance> {
  const response = await apiRequest<{ balance: Balance }>('/transactions/balance');
  return response.balance;
}
