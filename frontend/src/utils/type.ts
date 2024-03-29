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
  wallet?: Wallet;
  category?: Category;
}

export interface Income {
  id: number;
  date: string; // You can use a string for representing time
  total_income: number;
  description: string;
  wallet_id: number;
  user_id: number;
  wallet: Wallet | undefined;
}

export interface Category {
  id: number;
  category_name: string;
  is_user_defined: boolean;
  user_id: number;
  category_outcomes: Outcome[];
  category_budgets: Category[];
}

export interface Budget {
  category_id: any;
  id: number;
  month: number;
  year: number;
  total_budget: number;
  current_budget: number;
  description: string;
  wallet_id: number;
  user_id: number;
  category: Category;
}
export interface dbResponse<T> {
  ok: boolean;
  status: number;
  msg: string;
  data: T
}
export interface Report {
  id: number
  date: string
  total_income: number
  total_outcome: number
  UserID: number
}