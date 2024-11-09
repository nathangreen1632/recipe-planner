// import { data } from './data.js';
// console.log(data);

const addRecipeBtn = document.getElementById('add-recipe-btn');
const recipeModal = document.getElementById('recipe-modal');
const closeRecipeModal = document.getElementById('close-recipe-modal');
const recipeForm = document.getElementById('recipe-form');
const ingredientList = document.getElementById('ingredient-list');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const instructionList = document.getElementById('instruction-list');
const addInstructionBtn = document.getElementById('add-instruction-btn');

function createIngredientField() {
    const ingredientItem = document.createElement('div');
    ingredientItem.classList.add('ingredient-item');
  
    const ingredientNameInput = document.createElement('input');
    ingredientNameInput.setAttribute('type', 'text');
    ingredientNameInput.name = 'ingredients[]';
    ingredientNameInput.placeholder = 'Ingredient Name';
    ingredientNameInput.required = true;
  
    const quantityInput = document.createElement('input');
    quantityInput.setAttribute('type', 'number');
    quantityInput.name = 'ingredients[].quantity';
    quantityInput.placeholder = 'Quantity';
    quantityInput.required = true;
  
    const unitOfMeasureSelect = document.createElement('select');
    unitOfMeasureSelect.name = 'ingredients[].unitOfMeasure';

    const unitOptions = [
        {value: null, text: 'none'},
        {value: 'grams', text: 'g'},
        {value: 'ounces', text: 'oz'},
        {value: 'pounds', text: 'lbs'},
        {value: 'cups', text: 'c'},
        {value: 'pints', text: 'pt'},
        {value: 'quarts', text: 'qt'},
        {value: 'gallons', text: 'gal'},
        {value: 'fluid ounces', text: 'fl oz'},
        {value: 'milliliters', text: 'ml'},
        {value: 'liters', text: 'l'},
        {value: 'teaspoons', text: 'tsp'},
        {value: 'tablespoons', text: 'tbsp'},
        {value: 'pieces', text: 'pieces'},

    ];
  
    unitOptions.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        unitOfMeasureSelect.appendChild(optionElement);
    });
  
    ingredientItem.appendChild(ingredientNameInput);
    ingredientItem.appendChild(quantityInput);
    ingredientItem.appendChild(unitOfMeasureSelect);
  
    ingredientList.appendChild(ingredientItem);
}

function createInstructionField() {
    const instructionItem = document.createElement('div');
    instructionItem.classList.add('instruction-item');

    const stepInput = document.createElement('input');
    stepInput.setAttribute('type', 'number');
    stepInput.name = 'instructions[].step';
    stepInput.placeholder = 'Step';
    stepInput.required = true;

    const stepDescriptionInput = document.createElement('input');
    stepDescriptionInput.setAttribute('type', 'text');
    stepDescriptionInput.name = 'instructions[].stepDescription';
    stepDescriptionInput.placeholder = 'Step Description';
    stepDescriptionInput.required = true;

    instructionItem.appendChild(stepInput);
    instructionItem.appendChild(stepDescriptionInput);

    instructionList.appendChild(instructionItem);
}

function getFormattedDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();   
  
    return mm + '-' + dd + '-' + yyyy;
  }

addRecipeBtn.addEventListener('click', () => {
    recipeModal.classList.remove('hidden');
});

closeRecipeModal.addEventListener('click', () => {
    recipeModal.classList.add('hidden');
});

addIngredientBtn.addEventListener('click', createIngredientField);
addInstructionBtn.addEventListener('click', createInstructionField);

recipeForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(recipeForm);
    const newRecipe = {};

    newRecipe.dateAdded = getFormattedDate();

    for (const [key, value] of formData.entries()) {
        if (key !== 'dateAdded') {
            newRecipe[key] = value;
        }
    }

    newRecipe.ingredients = [];
    const ingredientsInputs = document.querySelectorAll('#ingredient-list input');
    for (let i = 0; i < ingredientsInputs.length; i += 3) {
        newRecipe.ingredients.push({
            ingredientName: ingredientsInputs[i].value,
            quantity: ingredientsInputs[i + 1].value,
            unitOfMeasure: ingredientsInputs[i + 2].value
        });
    }

    newRecipe.instructions = [];
    const instructionsInputs = document.querySelectorAll('#instruction-list input');
    instructionsInputs.forEach((input, index) => {
        newRecipe.instructions.push({
            step: index + 1,
            stepDescription: input.value
        });
    });

    console.log(newRecipe);
});