export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  token?: string;
  wallets: Wallet[];
  user_categories: Category[];
  outcomes: Outcome[];
  incomes: Income[];
  budgets: Budget[];
}

export interface Wallet {
  id: number;
  wallet_name: string;
  total_balance: number;
  user_id: number;
  outcomes: Outcome[];
  incomes: Income[];
}

export interface Outcome {
  id: number;
  date: string; // You can use a string for representing time
  total_outcome: number;
  description: string;
  category_id: number;
  wallet_id: number;
  user_id: number;
}

export interface Income {
  id: number;
  date: string; // You can use a string for representing time
  total_income: number;
  description: string;
  wallet_id: number;
  user_id: number;
}

export interface Category {
  id: number;
  category_name: string;
  is_user_defined: boolean;
  user_id: number;
  category_outcomes: Outcome[];
}

export interface Budget {
  id: number;
  date: string; // You can use a string for representing time
  month: string;
  total_budget: number;
  description: string;
  wallet_id: number;
  user_id: number;
}
export interface dbResponse<T> {
  ok: boolean;
  status: number;
  msg: string;
  data: [T]
}