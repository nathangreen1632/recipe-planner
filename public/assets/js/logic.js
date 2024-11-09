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

    const unitOfMeasureInput = document.createElement('input');
    unitOfMeasureInput.setAttribute('type', 'text');
    unitOfMeasureInput.name = 'ingredients[].unitOfMeasure';
    unitOfMeasureInput.placeholder = 'Unit of Measure';
    unitOfMeasureInput.required = true;

    ingredientItem.appendChild(ingredientNameInput);
    ingredientItem.appendChild(quantityInput);
    ingredientItem.appendChild(unitOfMeasureInput);

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

    for (const [key, value] of formData.entries()) {
        newRecipe[key] = value;
    }

    recipeData.ingredients = [];
    const ingredientsInputs = document.querySelectorAll('#ingredient-list input');
    for (let i = 0; i < ingredientsInputs.length; i += 3) {
        recipeData.ingredients.push({
            ingredientName: ingredientsInputs[i].value,
            quantity: ingredientsInputs[i + 1].value,
            unitOfMeasure: ingredientsInputs[i + 2].value
        });
    }

    recipeData.instructions = [];
    const instructionsInputs = document.querySelectorAll('#instruction-list input');
    instructionsInputs.forEach((input, index) => {
        recipeData.instructions.push({
            step: index + 1,
            stepDescription: input.value
        });
    });

    console.log(newRecipe);
});