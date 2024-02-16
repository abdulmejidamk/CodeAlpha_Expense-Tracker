const description = document.getElementById("description");
const amount = document.getElementById("amount");
const listOfExpenses = document.querySelector(".ordered-expenses");
const incomeAmount = document.getElementById("incomeAmount");
const addIncome = document.getElementById("addIncome");
const balance = document.getElementById("balance");

addIncome.addEventListener("click", addIncomeFunction);
document.getElementById("addExpense").addEventListener("click", addItem);
listOfExpenses.addEventListener("click", delegation);

let editItemIndex = null;
let initialExpenseAmount = 0;

window.addEventListener("DOMContentLoaded", () => {
  const savedData = JSON.parse(localStorage.getItem("expenseTrackerData"));

  if (savedData) {
    totalBalance = savedData.totalBalance || 0;
    updateBalanceUI();

    if (savedData.expenses) {
      savedData.expenses.forEach((expense) => {
        addItemToUI(expense.description, expense.amount);
      });
    }
  }
});

function addItem(e) {
  e.preventDefault();

  if (description.value !== "" && amount.value !== "") {
    const expenseAmount = Number(amount.value);

    if (totalBalance < expenseAmount) {
      alert("Insufficient Budget");
      return;
    }

    if (editItemIndex !== null) {
      const editedItem = listOfExpenses.children[editItemIndex];
      const editedAmount = parseFloat(
        editedItem.querySelector(".price").textContent
      );

      totalBalance += editedAmount;

      if (initialExpenseAmount !== expenseAmount) {
        totalBalance -= expenseAmount;
      }
    } else {
      totalBalance -= expenseAmount;
    }

    updateBalanceUI();

    if (editItemIndex !== null) {
      updateItem(editItemIndex);
      editItemIndex = null;
      initialExpenseAmount = 0;
    } else {
      addItemToUI(description.value, expenseAmount);
    }

    saveDataToLocalStorage();

    description.value = "";
    amount.value = "";
  } else {
    alert("Please enter fields");
  }
}

function delegation(e) {
  if (e.target.classList.contains("edit")) {
    editItem(e);
  } else if (e.target.classList.contains("delete")) {
    deleteItem(e);
  }
}

function editItem(e) {
  const listItem = e.target.closest(".ex-list");
  if (listItem) {
    const itemText = listItem.querySelector(".item").textContent;
    const priceText = listItem.querySelector(".price").textContent;

    description.value = itemText;
    amount.value = parseFloat(priceText);

    editItemIndex = Array.from(listItem.parentNode.children).indexOf(listItem);
    initialExpenseAmount = Number(priceText);
  }

  updateBalanceUI();
  e.preventDefault();
}

function deleteItem(e) {
  const listItem = e.target.closest(".ex-list");
  if (listItem) {
    const deletedAmount = parseFloat(
      listItem.querySelector(".price").textContent
    );
    totalBalance += deletedAmount;
    updateBalanceUI();

    listItem.remove();
    e.preventDefault();

    saveDataToLocalStorage();
  }
}

function addItemToUI(description, amount) {
  const li = `
    <li class="ex-list">
      <table>
        <tr>
          <td><div class="item">${description}</div></td>
          <td><div class="price">${amount} $</div></td>
          <td><div class="edit-delete">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </div></td>
        </tr>
      </table>
    </li>`;

  listOfExpenses.innerHTML += li;
}

let totalBalance = 0;

function addIncomeFunction(e) {
  e.preventDefault();

  if (incomeAmount.value !== "") {
    const incomeAdded = Number(incomeAmount.value);
    totalBalance += incomeAdded;
    updateBalanceUI();

    saveDataToLocalStorage();
  }

  incomeAmount.value = "";
}

function updateItem(index) {
  const items = listOfExpenses.querySelectorAll(".ex-list");
  const editedItem = items[index];

  if (editedItem) {
    const editedAmount = parseFloat(
      editedItem.querySelector(".price").textContent
    );

    totalBalance += editedAmount - initialExpenseAmount;
    updateBalanceUI();

    editedItem.querySelector(".item").textContent = description.value;
    editedItem.querySelector(".price").textContent = `${Number(
      amount.value
    )} $`;
  }

  saveDataToLocalStorage();
}

function updateBalanceUI() {
  balance.innerHTML = totalBalance + " $";

  saveDataToLocalStorage();
}

function saveDataToLocalStorage() {
  const dataToSave = {
    totalBalance: totalBalance,
    expenses: [],
  };

  const expenseItems = document.querySelectorAll(".ex-list");
  expenseItems.forEach((item) => {
    const description = item.querySelector(".item").textContent;
    const amount = parseFloat(item.querySelector(".price").textContent);
    dataToSave.expenses.push({ description, amount });
  });

  localStorage.setItem("expenseTrackerData", JSON.stringify(dataToSave));
}
