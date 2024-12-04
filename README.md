# BudgetBuddy: Expense Tracker Web Application

BudgetBuddy is a comprehensive expense tracking web application that helps users manage their personal finances effectively. With BudgetBuddy, you can track your expenses, incomes, bank accounts, loans, and assets, all in one convenient platform.

## Technologies Used

- **Backend**: Nest JS
- **Frontend**: Next.js
- **Database**: Prisma

## Setup and Installation

1. Clone the repository:
```
git clone https://github.com/Yakumaa/budgetbuddyv2-backend.git
```

2. Install backend dependencies
```
pnpm install
```

3. Set up the environment variables:
```
Create a .env file in the backend directory and configure the required environment variables (e.g., database credentials, JWT secret keys).
```

4. Run Prisma migrations
```
npx prisma generate
npx prisma db push
```

5. Start the development servers:
```
pnpm run dev
```


## Usage

1. **Register a new account:** Visit the registration page and create a new account by providing your username, email, and password.
2. **Log in:** After registering, navigate to the login page and enter your credentials to access the application.
3. **Dashboard:** Once logged in, you'll be directed to the dashboard, which provides an overview of your financial summary, including total income, expenses, net balance, and recent transactions.
4. **Add Transactions:** Navigate to the transactions page to add new expenses or incomes. You can provide details such as amount, date, category, and description.
5. **Manage Accounts:** Visit the accounts section to add new bank accounts or update your cash on hand.
6. **Track Loans and Assets:** Record loans you've taken or assets you own by navigating to the respective sections and providing the necessary details.
7. **Generate Reports:** Access the reports section to generate detailed financial reports for specific periods, allowing you to analyze your income, expenses, assets, and loans.
8. **Profile Management:** Update your profile information or change your password from the profile section.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.