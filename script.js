
//    PERSONAL FINANCE TRACKER

//    APPLICATION STATE


let transactions = [];

let transactionBeingDeleted = null;

let monthlyBudget = 0;



//    STORAGE KEYS


const STORAGE_KEY = "finance_transactions";

const BUDGET_STORAGE_KEY = "finance_monthly_budget";



//    CHART STATE


let incomeExpenseChart = null;

let expenseCategoryChart = null;

let monthlyOverviewChart = null;



//    DOM ELEMENTS


let totalIncomeElement;
let totalExpensesElement;
let balanceElement;

let addTransactionBtn;
let addTransactionBtnSecondary;
let emptyStateAddBtn;

let searchInput;
let categoryFilter;
let dateFilter;
let clearFiltersBtn;

let transactionsTableBody;
let emptyState;

let transactionModal;
let closeModalBtn;
let cancelTransactionBtn;
let transactionForm;
let transactionIdInput;
let modalTitle;
let transactionTitleInput;
let transactionAmountInput;
let transactionCategoryInput;
let transactionDateInput;
let transactionDescriptionInput;

let deleteModal;
let cancelDeleteBtn;
let confirmDeleteBtn;

let editBudgetBtn;
let budgetModal;
let closeBudgetModalBtn;
let cancelBudgetBtn;
let budgetForm;
let budgetInput;
let budgetAmountElement;
let budgetSpentElement;
let budgetRemainingElement;
let budgetPercentageElement;
let budgetProgressBar;
let budgetStatusElement;

let incomeExpenseChartCanvas;
let expenseCategoryChartCanvas;
let monthlyOverviewChartCanvas;



//    INITIALIZE DOM ELEMENTS


const initializeDOMElements =() =>{

    
    //    SUMMARY
    

    totalIncomeElement =
        document.getElementById("totalIncome");

    totalExpensesElement =
        document.getElementById("totalExpenses");

    balanceElement =
        document.getElementById("balance");


   
    //    TRANSACTION BUTTONS
    

    addTransactionBtn =
        document.getElementById("addTransactionBtn");

    addTransactionBtnSecondary =
        document.getElementById(
            "addTransactionBtnSecondary"
        );

    emptyStateAddBtn =
        document.getElementById("emptyStateAddBtn");


    
    //    FILTERS
    

    searchInput =
        document.getElementById("searchInput");

    categoryFilter =
        document.getElementById("categoryFilter");

    dateFilter =
        document.getElementById("dateFilter");

    clearFiltersBtn =
        document.getElementById("clearFiltersBtn");


    
    //    TRANSACTION TABLE
    

    transactionsTableBody =
        document.getElementById(
            "transactionsTableBody"
        );

    emptyState =
        document.getElementById("emptyState");


    
    //    TRANSACTION MODAL
    

    transactionModal =
        document.getElementById("transactionModal");

    closeModalBtn =
        document.getElementById("closeModalBtn");

    cancelTransactionBtn =
        document.getElementById(
            "cancelTransactionBtn"
        );

    transactionForm =
        document.getElementById("transactionForm");

    transactionIdInput =
        document.getElementById("transactionId");

    modalTitle =
        document.getElementById("modalTitle");

    transactionTitleInput =
        document.getElementById(
            "transactionTitle"
        );

    transactionAmountInput =
        document.getElementById(
            "transactionAmount"
        );

    transactionCategoryInput =
        document.getElementById(
            "transactionCategory"
        );

    transactionDateInput =
        document.getElementById(
            "transactionDate"
        );

    transactionDescriptionInput =
        document.getElementById(
            "transactionDescription"
        );


    //    DELETE MODAL
    

    deleteModal =
        document.getElementById("deleteModal");

    cancelDeleteBtn =
        document.getElementById(
            "cancelDeleteBtn"
        );

    confirmDeleteBtn =
        document.getElementById(
            "confirmDeleteBtn"
        );


    
    //    BUDGET
   

    editBudgetBtn =
        document.getElementById("editBudgetBtn");

    budgetModal =
        document.getElementById("budgetModal");

    closeBudgetModalBtn =
        document.getElementById(
            "closeBudgetModalBtn"
        );

    cancelBudgetBtn =
        document.getElementById("cancelBudgetBtn");

    budgetForm =
        document.getElementById("budgetForm");

    budgetInput =
        document.getElementById("budgetInput");

    budgetAmountElement =
        document.getElementById("budgetAmount");

    budgetSpentElement =
        document.getElementById("budgetSpent");

    budgetRemainingElement =
        document.getElementById(
            "budgetRemaining"
        );

    budgetPercentageElement =
        document.getElementById(
            "budgetPercentage"
        );

    budgetProgressBar =
        document.getElementById(
            "budgetProgressBar"
        );

    budgetStatusElement =
        document.getElementById(
            "budgetStatus"
        );


    
    //    OPTIONAL ANALYTICS CANVASES
   

    incomeExpenseChartCanvas =
        document.getElementById(
            "incomeExpenseChart"
        );

    expenseCategoryChartCanvas =
        document.getElementById(
            "expenseCategoryChart"
        );

    monthlyOverviewChartCanvas =
        document.getElementById(
            "monthlyOverviewChart"
        );
}



//    CURRENCY FORMATTER


const formatCurrency =(amount)=> {

    const numericAmount =
        Number(amount) || 0;

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(numericAmount);
}



//    GENERATE TRANSACTION ID


const  generateTransactionId =() =>{

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {

        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2)
    );
}



//    GET TODAY'S DATE


const getTodayDate =() =>{

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}



//    SET DEFAULT DATE


const setDefaultDate =()=> {

    if (
        transactionDateInput &&
        !transactionDateInput.value
    ) {

        transactionDateInput.value =
            getTodayDate();
    }
}



//    LOAD TRANSACTIONS


const loadTransactions = async() => {

    try {

        const savedTransactions =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!savedTransactions) {

           transactions = [];

            return;
        }

        const parsedTransactions =
            JSON.parse(
                savedTransactions
            );

        if (!Array.isArray(parsedTransactions)) {

            transactions = [];

            return;
        }

        transactions =
            parsedTransactions.map(
                transaction => ({

                    id:
                        transaction.id ||
                        generateTransactionId(),

                    type:
                        transaction.type === "expense"
                            ? "expense"
                            : "income",

                    title:
                        String(
                            transaction.title || ""
                        ),

                    amount:
                        Number(
                            transaction.amount
                        ) || 0,

                    category:
                        String(
                            transaction.category ||
                            "Other"
                        ),

                    date:
                        transaction.date ||
                        getTodayDate(),

                    description:
                        String(
                            transaction.description ||
                            ""
                        ),

                    createdAt:
                        Number(
                            transaction.createdAt
                        ) || Date.now()
                })
            );

    } catch (error) {

        console.error(
            "Unable to load transactions:",
            error
        );

        transactions = [];
    }
}



//    SAVE TRANSACTIONS


const saveTransactions = async() =>{

    try {

       await localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transactions)
        );

    } catch (error) {

        console.error(
            "Unable to save transactions:",
            error
        );

        alert(
            "Your transactions could not be saved."
        );
    }
}



//    LOAD MONTHLY BUDGET


const loadBudget = async()=> {

    try {

        const savedBudget =
          await  localStorage.getItem(
                BUDGET_STORAGE_KEY
            );

        if (!savedBudget) {

            monthlyBudget = 0;

            return;
        }

        const parsedBudget =
            Number(savedBudget);

        if (
            Number.isFinite(parsedBudget) &&
            parsedBudget > 0
        ) {

            monthlyBudget =
                parsedBudget;

        } else {

            monthlyBudget = 0;
        }

    } catch (error) {

        console.error(
            "Unable to load budget:",
            error
        );

        monthlyBudget = 0;
    }
}


//    SAVE BUDGET


const saveBudget = async() =>{

    try {

       await localStorage.setItem(
            BUDGET_STORAGE_KEY,
            String(monthlyBudget)
        );

    } catch (error) {

        console.error(
            "Unable to save budget:",
            error
        );

        alert(
            "Your budget could not be saved."
        );
    }
}



//    UPDATE SUMMARY


const updateSummary =()=> {

    const totalIncome =
        transactions
            .filter(
                transaction =>
                    transaction.type === "income"
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total + transaction.amount,
                0
            );

    const totalExpenses =
        transactions
            .filter(
                transaction =>
                    transaction.type === "expense"
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total + transaction.amount,
                0
            );

    const balance =
        totalIncome - totalExpenses;

    if (totalIncomeElement) {

        totalIncomeElement.textContent =
            formatCurrency(totalIncome);
    }

    if (totalExpensesElement) {

        totalExpensesElement.textContent =
            formatCurrency(totalExpenses);
    }

    if (balanceElement) {

        balanceElement.textContent =
            formatCurrency(balance);

        balanceElement.classList.remove(
            "positive",
            "negative"
        );

        if (balance > 0) {

            balanceElement.classList.add(
                "positive"
            );

        } else if (balance < 0) {

            balanceElement.classList.add(
                "negative"
            );
        }
    }
}



//    FORMAT TRANSACTION DATE


const formatDate =(dateString) =>{

    if (!dateString) {

        return "—";
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;
    }

    return new Intl.DateTimeFormat(
        "en-NG",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(date);
}


//    GET FILTERED TRANSACTIONS


const getFilteredTransactions =()=> {

    const searchTerm =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";

    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "all";

    const today = new Date();

    return transactions
        .filter(transaction => {

            /* SEARCH */

            if (searchTerm) {

                const searchableText =
                    [
                        transaction.title,
                        transaction.category,
                        transaction.description,
                        transaction.type,
                        transaction.date
                    ]
                        .join(" ")
                        .toLowerCase();

                if (
                    !searchableText.includes(
                        searchTerm
                    )
                ) {

                    return false;
                }
            }


            /* CATEGORY */

            if (
                selectedCategory !== "all" &&
                transaction.category !==
                    selectedCategory
            ) {

                return false;
            }


            /* DATE */

            if (
                selectedDate !== "all"
            ) {

                const transactionDate =
                    new Date(
                        `${transaction.date}T00:00:00`
                    );

                if (
                    Number.isNaN(
                        transactionDate.getTime()
                    )
                ) {

                    return false;
                }


                /* TODAY */

                if (
                    selectedDate === "today"
                ) {

                    const isToday =
                        transactionDate.getFullYear() ===
                            today.getFullYear() &&
                        transactionDate.getMonth() ===
                            today.getMonth() &&
                        transactionDate.getDate() ===
                            today.getDate();

                    if (!isToday) {

                        return false;
                    }
                }


                /* THIS WEEK */

                if (
                    selectedDate === "week"
                ) {

                    const currentDay =
                        today.getDay();

                    const differenceToMonday =
                        currentDay === 0
                            ? 6
                            : currentDay - 1;

                    const startOfWeek =
                        new Date(today);

                    startOfWeek.setDate(
                        today.getDate() -
                        differenceToMonday
                    );

                    startOfWeek.setHours(
                        0,
                        0,
                        0,
                        0
                    );

                    const endOfWeek =
                        new Date(
                            startOfWeek
                        );

                    endOfWeek.setDate(
                        startOfWeek.getDate() + 6
                    );

                    endOfWeek.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    if (
                        transactionDate <
                            startOfWeek ||
                        transactionDate >
                            endOfWeek
                    ) {

                        return false;
                    }
                }


                /* THIS MONTH */

                if (
                    selectedDate === "month"
                ) {

                    const isCurrentMonth =
                        transactionDate.getFullYear() ===
                            today.getFullYear() &&
                        transactionDate.getMonth() ===
                            today.getMonth();

                    if (!isCurrentMonth) {

                        return false;
                    }
                }
            }

            return true;
        })
        .sort(
            (
                first,
                second
            ) => {

                const secondDate =
                    new Date(
                        `${second.date}T00:00:00`
                    ).getTime();

                const firstDate =
                    new Date(
                        `${first.date}T00:00:00`
                    ).getTime();

                const dateDifference =
                    secondDate - firstDate;

                if (
                    dateDifference !== 0
                ) {

                    return dateDifference;
                }

                return (
                    Number(
                        second.createdAt || 0
                    ) -
                    Number(
                        first.createdAt || 0
                    )
                );
            }
        );
}



//    ESCAPE HTML


const escapeHTML =(value) =>{

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



//    RENDER TRANSACTIONS


const renderTransactions =()=> {

    if (!transactionsTableBody) {

        return;
    }

    const filteredTransactions =
        getFilteredTransactions();

    transactionsTableBody.innerHTML = "";

    if (
        filteredTransactions.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                "block";
        }

        return;
    }

    if (emptyState) {

        emptyState.style.display =
            "none";
    }

    filteredTransactions.forEach(
        transaction => {

            const row =
                document.createElement("tr");

            const amountClass =
                transaction.type === "income"
                    ? "income"
                    : "expense";

            const amountSign =
                transaction.type === "income"
                    ? "+"
                    : "-";

            row.innerHTML = `
                <td>

                    <div class="transaction-title">
                        ${escapeHTML(
                            transaction.title
                        )}
                    </div>

                    ${
                        transaction.description
                            ? `
                                <div class="transaction-description">
                                    ${escapeHTML(
                                        transaction.description
                                    )}
                                </div>
                            `
                            : ""
                    }

                </td>

                <td>

                    <span class="transaction-type ${escapeHTML(
                        transaction.type
                    )}">

                        ${
                            transaction.type === "income"
                                ? "Income"
                                : "Expense"
                        }

                    </span>

                </td>

                <td>
                    ${escapeHTML(
                        transaction.category
                    )}
                </td>

                <td>
                    ${formatDate(
                        transaction.date
                    )}
                </td>

                <td>

                    <span class="transaction-amount ${amountClass}">

                        ${amountSign}

                        ${formatCurrency(
                            transaction.amount
                        )}

                    </span>

                </td>

                <td>

                    <div class="transaction-actions">

                        <button
                            type="button"
                            class="btn btn-secondary edit-transaction-btn"
                            data-id="${escapeHTML(
                                transaction.id
                            )}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="btn btn-danger delete-transaction-btn"
                            data-id="${escapeHTML(
                                transaction.id
                            )}"
                        >
                            Delete
                        </button>

                    </div>

                </td>
            `;

            transactionsTableBody.appendChild(row);
        }
    );
}



//    POPULATE CATEGORY FILTER


const populateCategoryFilter =()=> {

    if (!categoryFilter) {

        return;
    }

    const currentValue =
        categoryFilter.value;

    const categories = [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Gift",
        "Food",
        "Transportation",
        "Rent",
        "Bills",
        "Shopping",
        "Entertainment",
        "Health",
        "Education",
        "Other"
    ];

    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;

    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                category;

            categoryFilter.appendChild(
                option
            );
        }
    );

    if (
        categories.includes(
            currentValue
        )
    ) {

        categoryFilter.value =
            currentValue;

    } else {

        categoryFilter.value =
            "all";
    }
}



//    OPEN TRANSACTION MODAL


const openTransactionModal =(
    transaction = null
)=> {

    if (
        !transactionModal ||
        !transactionForm
    ) {

        return;
    }

    transactionForm.reset();

    if (transaction) {

        if (modalTitle) {

            modalTitle.textContent =
                "Edit Transaction";
        }

        if (transactionIdInput) {

            transactionIdInput.value =
                transaction.id;
        }

        const radioButton =
            document.querySelector(
                `input[name="transactionType"][value="${transaction.type}"]`
            );

        if (radioButton) {

            radioButton.checked = true;
        }

        if (transactionTitleInput) {

            transactionTitleInput.value =
                transaction.title;
        }

        if (transactionAmountInput) {

            transactionAmountInput.value =
                transaction.amount;
        }

        if (transactionCategoryInput) {

            transactionCategoryInput.value =
                transaction.category;
        }

        if (transactionDateInput) {

            transactionDateInput.value =
                transaction.date;
        }

        if (
            transactionDescriptionInput
        ) {

            transactionDescriptionInput.value =
                transaction.description || "";
        }

    } else {

        if (modalTitle) {

            modalTitle.textContent =
                "Add Transaction";
        }

        if (transactionIdInput) {

            transactionIdInput.value = "";
        }

        const incomeRadio =
            document.querySelector(
                'input[name="transactionType"][value="income"]'
            );

        if (incomeRadio) {

            incomeRadio.checked = true;
        }

        setDefaultDate();
    }

    transactionModal.classList.add("show");

    transactionModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    if (transactionTitleInput) {

        transactionTitleInput.focus();
    }
}



//    CLOSE TRANSACTION MODAL


const closeTransactionModal =()=> {

    if (!transactionModal) {

        return;
    }

    transactionModal.classList.remove("show");

    transactionModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

    if (transactionForm) {

        transactionForm.reset();
    }

    if (transactionIdInput) {

        transactionIdInput.value = "";
    }

    if (modalTitle) {

        modalTitle.textContent =
            "Add Transaction";
    }

    setDefaultDate();
}


//    SAVE TRANSACTION


const handleTransactionSubmit =(event) =>{

    event.preventDefault();

    const selectedType =
        document.querySelector(
            'input[name="transactionType"]:checked'
        );

    const type =
        selectedType
            ? selectedType.value
            : "income";

    const title =
        transactionTitleInput
            ? transactionTitleInput.value.trim()
            : "";

    const amount =
        transactionAmountInput
            ? Number(
                transactionAmountInput.value
            )
            : 0;

    const category =
        transactionCategoryInput
            ? transactionCategoryInput.value
            : "";

    const date =
        transactionDateInput
            ? transactionDateInput.value
            : "";

    const description =
        transactionDescriptionInput
            ? transactionDescriptionInput.value.trim()
            : "";

    if (!title) {

        alert(
            "Please enter a transaction title."
        );

        return;
    }

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount greater than zero."
        );

        if (transactionAmountInput) {

            transactionAmountInput.focus();
        }

        return;
    }

    if (!category) {

        alert(
            "Please select a category."
        );

        if (transactionCategoryInput) {

            transactionCategoryInput.focus();
        }

        return;
    }

    if (!date) {

        alert(
            "Please select a date."
        );

        if (transactionDateInput) {

            transactionDateInput.focus();
        }

        return;
    }

    const transactionId =
        transactionIdInput
            ? transactionIdInput.value
            : "";

    if (transactionId) {

        const transactionIndex =
            transactions.findIndex(
                transaction =>
                    transaction.id ===
                    transactionId
            );

        if (
            transactionIndex === -1
        ) {

            alert(
                "Transaction could not be found."
            );

            return;
        }

        transactions[transactionIndex] = {

            ...transactions[
                transactionIndex
            ],

            type,
            title,
            amount,
            category,
            date,
            description
        };

    } else {

        transactions.push({

            id:
                generateTransactionId(),

            type,
            title,
            amount,
            category,
            date,
            description,

            createdAt:
                Date.now()
        });
    }

    saveTransactions();

    populateCategoryFilter();

    renderTransactions();

    updateSummary();

    updateAnalytics();

    updateBudgetDisplay();

    closeTransactionModal();
}



//    OPEN DELETE MODAL


const openDeleteModal =(transactionId) => {

    if (!deleteModal) {

        return;
    }

    const transaction =
        transactions.find(
            item =>
                item.id === transactionId
        );

    if (!transaction) {

        return;
    }

    transactionBeingDeleted =
        transactionId;

    deleteModal.classList.add("show");

    deleteModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}



//    CLOSE DELETE MODAL


const closeDeleteModal =()=> {

    if (!deleteModal) {

        return;
    }

    deleteModal.classList.remove("show");

    deleteModal.setAttribute(
        "aria-hidden",
        "true"
    );

    transactionBeingDeleted = null;

    document.body.style.overflow = "";
}


//    CONFIRM DELETE


const confirmDeleteTransaction =()=> {

    if (!transactionBeingDeleted) {

        return;
    }

    transactions =
        transactions.filter(
            transaction =>
                transaction.id !==
                transactionBeingDeleted
        );

    saveTransactions();

    populateCategoryFilter();

    renderTransactions();

    updateSummary();

    updateAnalytics();

    updateBudgetDisplay();

    closeDeleteModal();
}



//    CLEAR FILTERS


const clearFilters =() =>{

    if (searchInput) {

        searchInput.value = "";
    }

    if (categoryFilter) {

        categoryFilter.value = "all";
    }

    if (dateFilter) {

        dateFilter.value = "all";
    }

    renderTransactions();
}



//    GET CURRENT MONTH TRANSACTIONS


const getCurrentMonthTransactions =() =>{

    const today = new Date();

    const currentYear =
        today.getFullYear();

    const currentMonth =
        today.getMonth();

    return transactions.filter(
        transaction => {

            const transactionDate =
                new Date(
                    `${transaction.date}T00:00:00`
                );

            if (
                Number.isNaN(
                    transactionDate.getTime()
                )
            ) {

                return false;
            }

            return (
                transactionDate.getFullYear() ===
                    currentYear &&
                transactionDate.getMonth() ===
                    currentMonth
            );
        }
    );
}



//    GET CURRENT MONTH EXPENSES


const getCurrentMonthExpenses =() =>{

    return getCurrentMonthTransactions()
        .filter(
            transaction =>
                transaction.type === "expense"
        )
        .reduce(
            (
                total,
                transaction
            ) =>
                total + transaction.amount,
            0
        );
}



//    UPDATE BUDGET DISPLAY


const updateBudgetDisplay =()=> {

    if (
        !budgetAmountElement ||
        !budgetSpentElement ||
        !budgetRemainingElement ||
        !budgetPercentageElement ||
        !budgetProgressBar ||
        !budgetStatusElement
    ) {

        return;
    }


    /* NO BUDGET */

    if (monthlyBudget <= 0) {

        budgetAmountElement.textContent =
            formatCurrency(0);

        budgetSpentElement.textContent =
            formatCurrency(0);

        budgetRemainingElement.textContent =
            formatCurrency(0);

        budgetPercentageElement.textContent =
            "0% used";

        budgetProgressBar.style.width =
            "0%";

        budgetProgressBar.className =
            "budget-progress-bar";

        budgetStatusElement.textContent =
            "No budget set";

        budgetStatusElement.className =
            "budget-status";

        return;
    }


    /* CURRENT MONTH SPENDING */

    const spent =
        getCurrentMonthExpenses();

    const remaining =
        monthlyBudget - spent;

    const percentage =
        (spent / monthlyBudget) * 100;

    const progressWidth =
        Math.min(
            Math.max(
                percentage,
                0
            ),
            100
        );


    /* AMOUNTS */

    budgetAmountElement.textContent =
        formatCurrency(
            monthlyBudget
        );

    budgetSpentElement.textContent =
        formatCurrency(spent);

    budgetRemainingElement.textContent =
        formatCurrency(
            Math.max(
                remaining,
                0
            )
        );


    /* PERCENTAGE */

    budgetPercentageElement.textContent =
        `${Math.round(
            percentage
        )}% used`;


    /* PROGRESS BAR */

    budgetProgressBar.style.width =
        `${progressWidth}%`;

    budgetProgressBar.className =
        "budget-progress-bar";

    budgetStatusElement.className =
        "budget-status";


    /* STATUS */

    if (percentage < 80) {

        budgetStatusElement.textContent =
            "You're on track";

        budgetStatusElement.classList.add(
            "safe"
        );

    } else if (percentage < 100) {

        budgetStatusElement.textContent =
            "Approaching limit";

        budgetStatusElement.classList.add(
            "warning"
        );

        budgetProgressBar.classList.add(
            "warning"
        );

    } else {

        budgetStatusElement.textContent =
            "Budget exceeded";

        budgetStatusElement.classList.add(
            "danger"
        );

        budgetProgressBar.classList.add(
            "danger"
        );
    }
}



//    OPEN BUDGET MODAL


const openBudgetModal =()=> {

    if (
        !budgetModal ||
        !budgetInput
    ) {

        return;
    }

    budgetInput.value =
        monthlyBudget > 0
            ? monthlyBudget
            : "";

    budgetModal.classList.add("show");

    budgetModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    budgetInput.focus();
}



//    CLOSE BUDGET MODAL


const closeBudgetModal =()=> {

    if (!budgetModal) {

        return;
    }

    budgetModal.classList.remove("show");

    budgetModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

    if (budgetForm) {

        budgetForm.reset();
    }
}



//    SAVE NEW BUDGET


const handleBudgetSubmit =(event)=> {

    event.preventDefault();

    if (!budgetInput) {

        return;
    }

    const budget =
        Number(
            budgetInput.value
        );

    if (
        !Number.isFinite(budget) ||
        budget <= 0
    ) {

        alert(
            "Please enter a valid budget greater than zero."
        );

        budgetInput.focus();

        return;
    }

    monthlyBudget = budget;

    saveBudget();

    updateBudgetDisplay();

    closeBudgetModal();
}



//    UPDATE ALL ANALYTICS


const updateAnalytics =()=> {

    updateIncomeExpenseChart();

    updateExpenseCategoryChart();

    updateMonthlyOverviewChart();
}


//    INCOME VS EXPENSES CHART


const updateIncomeExpenseChart =()=> {

    if (
        !incomeExpenseChartCanvas ||
        typeof Chart === "undefined"
    ) {

        return;
    }

    const currentMonthTransactions =
        getCurrentMonthTransactions();

    const income =
        currentMonthTransactions
            .filter(
                transaction =>
                    transaction.type === "income"
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total + transaction.amount,
                0
            );

    const expenses =
        currentMonthTransactions
            .filter(
                transaction =>
                    transaction.type === "expense"
            )
            .reduce(
                (
                    total,
                    transaction
                ) =>
                    total + transaction.amount,
                0
            );

    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();
    }

    incomeExpenseChart =
        new Chart(
            incomeExpenseChartCanvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Income",
                        "Expenses"
                    ],

                    datasets: [
                        {

                            data: [
                                income,
                                expenses
                            ],

                            backgroundColor: [
                                "#16a34a",
                                "#dc2626"
                            ],

                            borderWidth: 0
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout: "68%",

                    plugins: {

                        legend: {

                            position:
                                "bottom"
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            " " +
                                            context.label +
                                            ": " +
                                            formatCurrency(
                                                context.raw
                                            )
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


//    EXPENSE CATEGORY CHART


const updateExpenseCategoryChart =() => {

    if (
        !expenseCategoryChartCanvas ||
        typeof Chart === "undefined"
    ) {

        return;
    }

    const categoryTotals = {};

    transactions
        .filter(
            transaction =>
                transaction.type === "expense"
        )
        .forEach(
            transaction => {

                if (
                    !categoryTotals[
                        transaction.category
                    ]
                ) {

                    categoryTotals[
                        transaction.category
                    ] = 0;
                }

                categoryTotals[
                    transaction.category
                ] += transaction.amount;
            }
        );

    const categories =
        Object.keys(
            categoryTotals
        );

    const amounts =
        Object.values(
            categoryTotals
        );

    if (expenseCategoryChart) {

        expenseCategoryChart.destroy();
    }

    expenseCategoryChart =
        new Chart(
            expenseCategoryChartCanvas,
            {

                type: "doughnut",

                data: {

                    labels: categories,

                    datasets: [
                        {

                            data: amounts,

                            backgroundColor: [
                                "#2563eb",
                                "#16a34a",
                                "#f59e0b",
                                "#dc2626",
                                "#7c3aed",
                                "#0891b2",
                                "#db2777",
                                "#65a30d"
                            ],

                            borderWidth: 0
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    cutout: "65%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                padding: 15
                            }
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            " " +
                                            context.label +
                                            ": " +
                                            formatCurrency(
                                                context.raw
                                            )
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}



//    GET MONTHLY FINANCIAL DATA


const getMonthlyFinancialData =()=> {

    const monthlyData = {};

    transactions.forEach(
        transaction => {

            const date =
                new Date(
                    `${transaction.date}T00:00:00`
                );

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return;
            }

            const year =
                date.getFullYear();

            const month =
                date.getMonth();

            const key =
                `${year}-${String(
                    month + 1
                ).padStart(2, "0")}`;

            if (!monthlyData[key]) {

                monthlyData[key] = {

                    income: 0,

                    expenses: 0
                };
            }

            if (
                transaction.type === "income"
            ) {

                monthlyData[key].income +=
                    transaction.amount;

            } else {

                monthlyData[key].expenses +=
                    transaction.amount;
            }
        }
    );

    return monthlyData;
}



//    MONTHLY OVERVIEW CHART


const updateMonthlyOverviewChart =()=> {

    if (
        !monthlyOverviewChartCanvas ||
        typeof Chart === "undefined"
    ) {

        return;
    }

    const monthlyData =
        getMonthlyFinancialData();

    const months =
        Object.keys(
            monthlyData
        ).sort();

    const labels =
        months.map(
            month => {

                const [
                    year,
                    monthNumber
                ] =
                    month.split("-");

                const date =
                    new Date(
                        Number(year),
                        Number(monthNumber) - 1,
                        1
                    );

                return new Intl.DateTimeFormat(
                    "en-NG",
                    {
                        month: "short",
                        year: "numeric"
                    }
                ).format(date);
            }
        );

    const incomeData =
        months.map(
            month =>
                monthlyData[
                    month
                ].income
        );

    const expenseData =
        months.map(
            month =>
                monthlyData[
                    month
                ].expenses
        );

    if (monthlyOverviewChart) {

        monthlyOverviewChart.destroy();
    }

    monthlyOverviewChart =
        new Chart(
            monthlyOverviewChartCanvas,
            {

                type: "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label: "Income",

                            data: incomeData,

                            backgroundColor:
                                "#16a34a",

                            borderRadius: 6
                        },

                        {

                            label: "Expenses",

                            data: expenseData,

                            backgroundColor:
                                "#dc2626",

                            borderRadius: 6
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        intersect: false,

                        mode: "index"
                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function (
                                        value
                                    ) {

                                        return (
                                            "₦" +
                                            Number(
                                                value
                                            ).toLocaleString(
                                                "en-NG"
                                            )
                                        );
                                    }
                            }
                        }
                    },

                    plugins: {

                        legend: {

                            position: "bottom"
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return (
                                            " " +
                                            context.dataset.label +
                                            ": " +
                                            formatCurrency(
                                                context.raw
                                            )
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


//    EVENT LISTENERS


const initializeEventListeners =()=> {


    //    ADD TRANSACTION BUTTONS
    

    if (addTransactionBtn) {

        addTransactionBtn.addEventListener(
            "click",
            function () {

                openTransactionModal();
            }
        );
    }


    if (addTransactionBtnSecondary) {

        addTransactionBtnSecondary.addEventListener(
            "click",
            function () {

                openTransactionModal();
            }
        );
    }


    if (emptyStateAddBtn) {

        emptyStateAddBtn.addEventListener(
            "click",
            function () {

                openTransactionModal();
            }
        );
    }


    
    //    CLOSE TRANSACTION MODAL
    

    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            closeTransactionModal
        );
    }


    if (cancelTransactionBtn) {

        cancelTransactionBtn.addEventListener(
            "click",
            closeTransactionModal
        );
    }


    //    TRANSACTION FORM
    

    if (transactionForm) {

        transactionForm.addEventListener(
            "submit",
            handleTransactionSubmit
        );
    }


    
    //    DELETE MODAL
    

    if (cancelDeleteBtn) {

        cancelDeleteBtn.addEventListener(
            "click",
            closeDeleteModal
        );
    }


    if (confirmDeleteBtn) {

        confirmDeleteBtn.addEventListener(
            "click",
            confirmDeleteTransaction
        );
    }


    
    //    TRANSACTION TABLE ACTIONS
    

    if (transactionsTableBody) {

        transactionsTableBody.addEventListener(
            "click",
            function (event) {

                const target =
                    event.target;

                if (
                    !(target instanceof Element)
                ) {

                    return;
                }

                const editButton =
                    target.closest(
                        ".edit-transaction-btn"
                    );

                const deleteButton =
                    target.closest(
                        ".delete-transaction-btn"
                    );


                /* EDIT */

                if (editButton) {

                    const transactionId =
                        editButton.dataset.id;

                    const transaction =
                        transactions.find(
                            item =>
                                item.id ===
                                transactionId
                        );

                    if (transaction) {

                        openTransactionModal(
                            transaction
                        );
                    }

                    return;
                }


                /* DELETE */

                if (deleteButton) {

                    const transactionId =
                        deleteButton.dataset.id;

                    openDeleteModal(
                        transactionId
                    );
                }
            }
        );
    }


    
    //    SEARCH
   

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderTransactions
        );
    }


    
    //    CATEGORY FILTER
    

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderTransactions
        );
    }


    
    //    DATE FILTER
    

    if (dateFilter) {

        dateFilter.addEventListener(
            "change",
            renderTransactions
        );
    }


    
    //    CLEAR FILTERS
    

    if (clearFiltersBtn) {

        clearFiltersBtn.addEventListener(
            "click",
            clearFilters
        );
    }


    
    //    BUDGET
    

    if (editBudgetBtn) {

        editBudgetBtn.addEventListener(
            "click",
            openBudgetModal
        );
    }


    if (closeBudgetModalBtn) {

        closeBudgetModalBtn.addEventListener(
            "click",
            closeBudgetModal
        );
    }


    if (cancelBudgetBtn) {

        cancelBudgetBtn.addEventListener(
            "click",
            closeBudgetModal
        );
    }


    if (budgetForm) {

        budgetForm.addEventListener(
            "submit",
            handleBudgetSubmit
        );
    }


    //    CLOSE TRANSACTION MODAL OUTSIDE
   

    if (transactionModal) {

        transactionModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    transactionModal
                ) {

                    closeTransactionModal();
                }
            }
        );
    }


    
    //    CLOSE DELETE MODAL OUTSIDE
  

    if (deleteModal) {

        deleteModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    deleteModal
                ) {

                    closeDeleteModal();
                }
            }
        );
    }


    //    CLOSE BUDGET MODAL OUTSIDE
    

    if (budgetModal) {

        budgetModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    budgetModal
                ) {

                    closeBudgetModal();
                }
            }
        );
    }


    
    //    ESCAPE KEY
    

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {

                return;
            }

            if (
                transactionModal &&
                transactionModal.classList.contains(
                    "show"
                )
            ) {

                closeTransactionModal();
            }

            if (
                deleteModal &&
                deleteModal.classList.contains(
                    "show"
                )
            ) {

                closeDeleteModal();
            }

            if (
                budgetModal &&
                budgetModal.classList.contains(
                    "show"
                )
            ) {

                closeBudgetModal();
            }
        }
    );
}


//    INITIALIZE APPLICATION


const initializeApp =()=> {

    /* FIRST: Find all HTML elements */

    initializeDOMElements();


    /* SECOND: Attach event listeners */

    initializeEventListeners();


    /* THIRD: Load saved data */

    loadTransactions();

    loadBudget();


    /* FOURTH: Set initial UI state */

    setDefaultDate();

    populateCategoryFilter();

    renderTransactions();

    updateSummary();

    updateAnalytics();

    updateBudgetDisplay();
}



//    START APPLICATION


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();
}