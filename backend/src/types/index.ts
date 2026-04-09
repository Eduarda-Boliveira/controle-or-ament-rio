export interface Category {
  id: number;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: string;
  category_id: number | null;
  type: 'income' | 'expense';
  amount: number;
  payment_method?: string;
  description: string;
  date: string;
  created_at: string;
}

export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name?: string;
}

export interface CreateTransactionDTO {
  category_id?: number | null;
  type: 'income' | 'expense';
  amount: number;
  payment_method?: string;
  description: string;
  date: string;
}

export interface UpdateTransactionDTO {
  category_id?: number | null;
  type?: 'income' | 'expense';
  payment_method?: string;
  amount?: number;
  description?: string;
  date?: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category_id?: number;
  type?: 'income' | 'expense';
}
