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

const clearGroceryListButton = document.querySelector('.clear-list-btn');

clearGroceryListButton.addEventListener('click', () => {
    localStorage.removeItem('groceryListArray');
    renderGroceryList();
});

function createIngredientField() {
    const ingredientItem = document.createElement('div');
    ingredientItem.classList.add('ingredient-item');

    const ingredientNameInput = document.createElement('input');
    ingredientNameInput.type = 'text';
    ingredientNameInput.placeholder = 'Ingredient Name';
    ingredientNameInput.required = true;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.placeholder = 'Quantity';
    quantityInput.required   
    = true;

    const unitOfMeasureSelect = document.createElement('select');
    unitOfMeasureSelect.name = 'unitOfMeasure';

    const unitOptions = [
        {value: '', text: 'none'},
        {value: 'grams', text: 'gram'},
        {value: 'ounces', text: 'oz'},
        {value: 'pounds', text: 'lbs'},
        {value: 'cups', text: 'cup'},
        {value: 'pints', text: 'pt'},
        {value: 'quarts', text: 'qt'},
        {value: 'gallons', text: 'gal'},
        {value: 'fluid ounces', text: 'fl oz'},
        {value: 'milliliters', text: 'ml'},
        {value: 'liters', text: 'l'},
        {value: 'teaspoons', text: 'tsp'},
        {value: 'tablespoons', text: 'tbsp'},
        {value: 'small', text: 'small'},
        {value: 'medium', text: 'medium'},
        {value: 'large', text: 'large'},
        {value: 'can', text: 'can'},
    ];

    unitOptions.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        unitOfMeasureSelect.appendChild(optionElement);
    });

    ingredientItem.appendChild(quantityInput);
    ingredientItem.appendChild(unitOfMeasureSelect);
    ingredientItem.appendChild(ingredientNameInput);
    
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        ingredientItem.remove();
        submitButton.classList.add('hidden');
    });
    
    ingredientItem.appendChild(removeButton);

    const ingredientFieldsContainer = document.querySelector('.ingredient-fields');
    ingredientFieldsContainer.appendChild(ingredientItem);
}

function parseQuantity(quantityString) {
    const trimmedQuantity = quantityString.trim();

    const numberOnly = parseFloat(trimmedQuantity);
    if (!isNaN(numberOnly)) {
        return numberOnly;
    }
    
    const fractionMatch = quantityString.match(/(\d+)\/(\d+)/);
    if (fractionMatch) {
        const numerator = parseInt(fractionMatch[1]);
        const denominator = parseInt(fractionMatch[2]);
        return numerator / denominator;
    }

    const mixedNumberMatch = quantityString.match(/(\d+) (\d+)\/(\d+)/);
    if (mixedNumberMatch) {
        const wholeNumber = parseInt(mixedNumberMatch[1]);
        const numerator = parseInt(mixedNumberMatch[2]);
        const denominator = parseInt(mixedNumberMatch[3]);
        return wholeNumber + (numerator / denominator);
    }

    return parseFloat(quantityString);
}

const addIngredientForm = document.querySelector('#add-ingredient-form');
const addButton = document.querySelector('.add-btn');
const submitButton = document.querySelector('.submit-btn');

addButton.addEventListener('click', () => {
    createIngredientField();
    submitButton.classList.remove('hidden');
});

cancelButton.addEventListener('click', () => {
    const ingredientFieldsContainer = document.querySelector('.ingredient-fields');
    ingredientFieldsContainer.innerHTML = '';
    submitButton.classList.add('hidden');
});

addIngredientForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newIngredient = {
        ingredientName: document.querySelector('.ingredient-fields input[type="text"]').value,
        quantity: document.querySelector('.ingredient-fields input[type="number"]').value,
        unitOfMeasure: document.querySelector('.ingredient-fields select').value,
    };

    const groceryList = JSON.parse(localStorage.getItem('groceryListArray')) || [];
    groceryList.push(newIngredient);
    localStorage.setItem('groceryListArray', JSON.stringify(groceryList));

    addIngredientForm.querySelector('input[type="text"]').value = '';
    addIngredientForm.querySelector('input[type="number"]').value = '';
    addIngredientForm.querySelector('select').value = '';

    renderGroceryList();

    submitButton.classList.add('hidden');
});