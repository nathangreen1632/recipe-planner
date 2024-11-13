//The following functions are not currently working and likely need to be moved to a separate file

function renderGroceryList() {
    const groceryListContainer = document.querySelector('.grocery-list');
    groceryListContainer.innerHTML = ''; // Clear existing content

    const storedGroceryList = JSON.parse(localStorage.getItem('groceryListArray')) || [];
    
    storedGroceryList.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.quantity} ${item.unitOfMeasure} ${item.ingredientName}`;
        groceryListContainer.appendChild(listItem);
    });
}

renderGroceryList();

function removeItemFromGroceryList(item) {
    const groceryList = JSON.parse(localStorage.getItem('groceryListArray')) || [];
    const index = groceryList.indexOf(item);
    if (index !== -1) {
        groceryList.splice(index, 1);
        localStorage.setItem('groceryListArray', JSON.stringify(groceryList));
    }
}