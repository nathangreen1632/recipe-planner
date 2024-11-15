function renderGroceryList() {
    const groceryListContainer = document.querySelector('.grocery-list');
    groceryListContainer.innerHTML = '';

    const storedGroceryList = JSON.parse(localStorage.getItem('groceryListArray')) || [];

    storedGroceryList.forEach(item => {
        const listItem = document.createElement('li');
        let itemText = '';
        if (item.quantity) {
            itemText += `${item.quantity} `;
        }
        if (item.unitOfMeasure) {
            itemText += `${item.unitOfMeasure} `;
        }
        itemText += item.ingredientName;
        listItem.textContent = itemText.trim();
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

// The code below is not working

let isMetric = false;

if (!localStorage.getItem('originalGroceryListArray')) {
    const groceryListArray = JSON.parse(localStorage.getItem('groceryListArray')) || [];
    localStorage.setItem('originalGroceryListArray', JSON.stringify(groceryListArray));
}

function convertUnits(toMetric, servingSize) {
    const originalIngredients = JSON.parse(localStorage.getItem('originalGroceryListArray')) || [];
    const conversionRates = {
        oz: 28.35,
        tbsp: 15,
        tsp: 5,
        cup: 240,
        lb: 453.59
    };

    const updatedIngredients = originalIngredients.map(ingredient => {
      let adjustedQuantity = parseFloat(ingredient.quantity) * servingSize;

        if (toMetric) {
            if (conversionRates[ingredient.unitOfMeasure] || isNaN(adjustedQuantity)) {
                if (conversionRates[ingredient.unitOfMeasure]) {
                    const multiplier = conversionRates[ingredient.unitOfMeasure];
                    adjustedQuantity = (adjustedQuantity * multiplier).toFixed(2);
                    ingredient.unitOfMeasure = ingredient.unitOfMeasure === 'oz' || ingredient.unitOfMeasure === 'lb' ? 'g' : 'ml';
                }
            }
        } else {
            if (ingredient.unitOfMeasure === 'g') {
                if (adjustedQuantity >= 453.59) {
                    adjustedQuantity = (adjustedQuantity / 453.59).toFixed(2);
                    ingredient.unitOfMeasure = 'lb';
                } else {
                    adjustedQuantity = (adjustedQuantity / 28.35).toFixed(2);
                    ingredient.unitOfMeasure = 'oz';
                }
            } else if (ingredient.unitOfMeasure === 'ml') {
                if (adjustedQuantity >= 240) {
                    adjustedQuantity = (adjustedQuantity / 240).toFixed(2);
                    ingredient.unitOfMeasure = 'cup';
                } else if (adjustedQuantity >= 15) {
                    adjustedQuantity = (adjustedQuantity / 15).toFixed(2);
                    ingredient.unitOfMeasure = 'tbsp';
                } else {
                    adjustedQuantity = (adjustedQuantity / 5).toFixed(2);
                    ingredient.unitOfMeasure = 'tsp';
                }
            }
        }
        return { ...ingredient, quantity: adjustedQuantity };
    });

    localStorage.setItem('groceryListArray', JSON.stringify(updatedIngredients));
    return updatedIngredients;
}

document.getElementById('toMetric').addEventListener('click', () => {
    const servingSize = parseInt(document.getElementById('servingSize').value) || 1;
    const updatedIngredients = convertUnits(true, servingSize);
    console.log('Converted to Metric', updatedIngredients);
    location.reload();
});

document.getElementById('toImperial').addEventListener('click', () => {
    const servingSize = parseInt(document.getElementById('servingSize').value) || 1;
    const updatedIngredients = convertUnits(false, servingSize);
    console.log('Converted to Imperial', updatedIngredients);
    location.reload();
});

// The code below is working fine
const clearGroceryListButton = document.querySelector('.clear-list-btn');

clearGroceryListButton.addEventListener('click', () => {
    localStorage.removeItem('originalGroceryListArray');
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
