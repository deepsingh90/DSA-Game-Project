class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.amount = 0;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(expenseName, amount) {
        let node = this.root;
        for (let char of expenseName) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.amount += amount;
    }

    remove(expenseName) {
        this._remove(this.root, expenseName, 0);
    }

    _remove(node, expenseName, index) {
        if (index === expenseName.length) {
            if (!node.isEndOfWord) return false;
            node.isEndOfWord = false;
            return Object.keys(node.children).length === 0;
        }

        const char = expenseName[index];
        const childNode = node.children[char];
        if (!childNode) return false;

        const shouldDeleteChild = this._remove(childNode, expenseName, index + 1);

        if (shouldDeleteChild) {
            delete node.children[char];
            return !node.isEndOfWord && Object.keys(node.children).length === 0;
        }
        return false;
    }

    getAmount(expenseName) {
        let node = this.root;
        for (let char of expenseName) {
            if (!node.children[char]) {
                return 0;
            }
            node = node.children[char];
        }
        return node.isEndOfWord ? node.amount : 0;
    }

    calculateTotalExpenses() {
        return this._calculateTotal(this.root);
    }

    _calculateTotal(node) {
        let total = 0;
        if (node.isEndOfWord) {
            total += node.amount;
        }
        for (let child in node.children) {
            total += this._calculateTotal(node.children[child]);
        }
        return total;
    }

    getAllExpenses() {
        const expenses = [];
        this._collectExpenses(this.root, '', expenses);
        return expenses;
    }

    _collectExpenses(node, prefix, expenses) {
        if (node.isEndOfWord) {
            expenses.push({ name: prefix, amount: node.amount });
        }
        for (let char in node.children) {
            this._collectExpenses(node.children[char], prefix + char, expenses);
        }
    }
}

class User {
    constructor() {
        this.income = 0;
        this.expenses = new Trie();
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

        this.expenses.insert(name, amount);
        return true;
    }

    deleteExpense(name) {
        this.expenses.remove(name);
    }

    getTotalExpenses() {
        return this.expenses.calculateTotalExpenses();
    }

    getSavings() {
        return this.income - this.getTotalExpenses();
    }

    getAllExpenses() {
        return this.expenses.getAllExpenses();
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
