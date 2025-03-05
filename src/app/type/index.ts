
 export enum TransactionCategory {
    GROCERIES = "Groceries",
    SHOPPING = "Shopping",
    TRANSPORT = "Transport",
    FOOD = "Food & Dining",
    HEALTH = "Health & Fitness",
    ENTERTAINMENT = "Entertainment",
    BILLS = "Bills & Utilities",
    TRAVEL = "Travel",
    EDUCATION = "Education",
    INVESTMENT = "Investment",
    INCOME = "Income",
    OTHER = "Other",
  }
  
  
  export interface Transaction {
    amount: number;
    date: string;
    description: string;
    _id: string;
    category: string;
  }
  