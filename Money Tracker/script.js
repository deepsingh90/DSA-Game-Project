class User {
    constructor() {
        this.income = 0;
        this.expenses = []; // Use an array of expense objects
    }

    setIncome(amount) {
        this.income = amount;
    }

    addExpense(name, amount) {
        const totalExpenses = this.getTotalExpenses();

        if (totalExpenses + amount > this.income) {
            alert("Adding this expense would exceed your income and result in negative savings. Please adjust your expense.");
            return false;
        }

        // Check if expense with the same name exists and update, else add new
        const existingExpense = this.expenses.find(expense => expense.name === name);
        if (existingExpense) {
            existingExpense.amount += amount;
        } else {
            this.expenses.push({ name, amount });
        }
        return true;
    }

    deleteExpense(name) {
        // Filter out the expense to delete it
        this.expenses = this.expenses.filter(expense => expense.name !== name);
    }

    getTotalExpenses() {
        return this.expenses.reduce((total, expense) => total += expense.amount, 0);
    }

    getSavings() {
        return this.income - this.getTotalExpenses();
    }

    getAllExpenses() {
        return this.expenses;
    }
}

// Initialize user object
const user = new User();

// DOM elements
const incomeInput = document.getElementById('income');
const expenseNameInput = document.getElementById('expenseName');
const expenseAmountInput = document.getElementById('expenseAmount');
const displayIncome = document.getElementById('displayIncome');
const displayExpenses = document.getElementById('displayExpenses');
const displaySavings = document.getElementById('displaySavings');
const expenseList = document.getElementById('expenseList');
const compoundInterestTableContainer = document.getElementById('compoundInterestTable');

// Event listeners
document.getElementById('setIncome').addEventListener('click', () => {
    const income = parseFloat(incomeInput.value);
    if (!isNaN(income) && income > 0) {
        user.setIncome(income);
        updateDisplay();
        updateCompoundInterestTable(user.getSavings());
    }
});

document.getElementById('addExpense').addEventListener('click', () => {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    if (name && !isNaN(amount) && amount > 0) {
        if (user.addExpense(name, amount)) {
            updateDisplay();
            updateExpenseList();
            updateCompoundInterestTable(user.getSavings());
        }
    }
});

function updateDisplay() {
    displayIncome.textContent = `$${user.income.toFixed(2)}`;
    displayExpenses.textContent = `$${user.getTotalExpenses().toFixed(2)}`;
    displaySavings.textContent = `$${user.getSavings().toFixed(2)}`;
}

function updateExpenseList() {
    expenseList.innerHTML = '';
    const expenses = user.getAllExpenses();
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.name}: $${expense.amount.toFixed(2)}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            user.deleteExpense(expense.name);
            updateDisplay();
            updateExpenseList();
            updateCompoundInterestTable(user.getSavings());
        });
        li.appendChild(deleteBtn);
        expenseList.appendChild(li);
    });
}

// Function to calculate compound interest and generate the table
function updateCompoundInterestTable(principal) {
    const interestRate = 0.10;
    const years = [3, 5, 10];
    let tableHTML = `
        <h2>Compound Interest Table (10% Interest Rate)</h2>
        <table class="compound-interest-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
    `;

    years.forEach(year => {
        const amount = principal * Math.pow((1 + interestRate), year);
        tableHTML += `
            <tr>
                <td>${year} Year${year > 1 ? 's' : ''}</td>
                <td>$${amount.toFixed(2)}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    // Update the table while preserving the rest of the content
    compoundInterestTableContainer.innerHTML = tableHTML;
}
