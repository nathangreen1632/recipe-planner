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
    ingredientNameInput.id = 'ingredient-input';
    ingredientNameInput.setAttribute('type', 'text');
    ingredientNameInput.name = 'ingredients[]';
    ingredientNameInput.placeholder = 'Ingredient Name';
    ingredientNameInput.required = true;

    const quantityInput = document.createElement('input');
    quantityInput.id = 'ingredient-input';
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

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        ingredientItem.remove();
    });

    ingredientItem.appendChild(removeButton);
}

function createInstructionField() {
    const instructionItem = document.createElement('div');
    instructionItem.classList.add('instruction-item');

    const stepSpan = document.createElement('span');
    stepSpan.textContent = instructionList.children.length + 1 + '. ';

    const stepDescriptionInput = document.createElement('input');
    stepDescriptionInput.id = 'instruction-input';
    stepDescriptionInput.setAttribute('type', 'text');
    stepDescriptionInput.name = 'instructions[].stepDescription';
    stepDescriptionInput.placeholder = 'Step Description';
    stepDescriptionInput.required = true;

    instructionItem.appendChild(stepSpan);
    instructionItem.appendChild(stepDescriptionInput);

    instructionList.appendChild(instructionItem);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        instructionItem.remove();
    });

    instructionItem.appendChild(removeButton);
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

    const quantityInputs = document.querySelectorAll('#ingredient-list input[type="number"]');
    let hasNegativeQuantity = false;
    quantityInputs.forEach(input => {
        if (input.value < 0) {
            hasNegativeQuantity = true;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    if (hasNegativeQuantity) {
        alert('Please enter positive quantities for ingredients.');
        return;
    }

    const formData = new FormData(recipeForm);
    const newRecipe = {};

    newRecipe.dateAdded = getFormattedDate();

    for (const [key, value] of formData.entries()) {
        if (key !== 'dateAdded') {
            newRecipe[key] = value;
        }
    }

    newRecipe.ingredients = [];
    const ingredientItems = document.querySelectorAll('#ingredient-list .ingredient-item');
    ingredientItems.forEach(item => {
        const ingredientNameInput = item.querySelector('input[type="text"]');
        const quantityInput = item.querySelector('input[type="number"]');
        const unitOfMeasureSelect = item.querySelector('select');

        newRecipe.ingredients.push({
            ingredientName: ingredientNameInput.value,
            quantity: quantityInput.value,
            unitOfMeasure: unitOfMeasureSelect.value
        });
    });

    newRecipe.instructions = [];
    const instructionsInputs = document.querySelectorAll('#instruction-list input[type="text"]');
    instructionsInputs.forEach((input, index) => {
    newRecipe.instructions.push({
        step: index + 1,
        stepDescription: input.value
        });
    });

    newRecipe.totalTime = parseInt(newRecipe.prepTime) + parseInt(newRecipe.cookTime);

    let recipeArray = JSON.parse(localStorage.getItem('recipeArray')) || [];

    recipeArray.push(newRecipe);

    localStorage.setItem('recipeArray', JSON.stringify(recipeArray));

    console.log('Recipe saved to local storage');
});

function createRecipeCard(recipe) {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    const recipeName = document.createElement('h3');
    recipeName.textContent = recipe.recipeName;

    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.mealImage || 'placeholder.png'; // Set default image if none provided

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = recipe.description.slice(0, 100) + '...';

    const recipeDetails = document.createElement('ul');

    const ingredientList = document.createElement('li');
    ingredientList.textContent = 'Ingredients:';
    const ingredientDetails = document.createElement('ul');
    recipe.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.textContent = `${ingredient.quantity} ${ingredient.unitOfMeasure} ${ingredient.ingredientName}`;
        ingredientDetails.appendChild(ingredientItem);
    });
    ingredientList.appendChild(ingredientDetails);
    recipeDetails.appendChild(ingredientList);

    const instructionList = document.createElement('li');
    instructionList.textContent = 'Instructions:';
    const instructionDetails = document.createElement('ul');
    recipe.instructions.forEach(instruction => {
        const instructionItem = document.createElement('li');
        instructionItem.textContent = `${instruction.step}. ${instruction.stepDescription}`;
        instructionDetails.appendChild(instructionItem);
    });
    
    ingredientDetails.classList.add('hidden');
    instructionDetails.classList.add('hidden');

    instructionList.appendChild(instructionDetails);
    recipeDetails.appendChild(instructionList);

    const additionalDetails = document.createElement('ul');
    
    const difficulty = document.createElement('li');
    difficulty.textContent = `Difficulty: ${recipe.difficultyLevel || 'Unknown'}`;

    const category = document.createElement('li');
    category.textContent = `Category: ${recipe.category || 'Unknown'}`;

    const cuisine = document.createElement('li');
    cuisine.textContent = `Cuisine: ${recipe.cuisine || 'Unknown'}`;

    const source = document.createElement('li');
    source.textContent = `Source: ${recipe.source || 'Unknown'}`;

    const ingredientToggle = document.createElement('button');
    ingredientToggle.textContent = 'Show Ingredients';
    ingredientToggle.addEventListener('click', () => {
        ingredientDetails.classList.toggle('hidden');
        ingredientToggle.textContent = ingredientToggle.textContent === 'Show Ingredients' ? 'Hide Ingredients' : 'Show Ingredients';
    });

    const instructionToggle = document.createElement('button');
    instructionToggle.textContent = 'Show Instructions';
    instructionToggle.addEventListener('click', () => {
        instructionDetails.classList.toggle('hidden');
        instructionToggle.textContent = instructionToggle.textContent === 'Show Instructions' ? 'Hide Instructions' : 'Show Instructions';
    });

    recipeDetails.appendChild(ingredientToggle);
    recipeDetails.appendChild(instructionToggle);

    additionalDetails.appendChild(difficulty);
    additionalDetails.appendChild(category);
    additionalDetails.appendChild(cuisine);
    additionalDetails.appendChild(source);

    recipeDetails.appendChild(additionalDetails);

    recipeCard.appendChild(recipeName);
    recipeCard.appendChild(recipeImage);
    recipeCard.appendChild(recipeDescription);
    recipeCard.appendChild(recipeDetails);

    return recipeCard;
}

const storedRecipes = localStorage.getItem('recipeArray');
const parsedRecipes = JSON.parse(storedRecipes) || [];

const recipeContainer = document.getElementById('recipe-container');

function renderRecipes() {
    recipeContainer.innerHTML = '';

    parsedRecipes.forEach(recipe => {
    const recipeCard = createRecipeCard(recipe);
    recipeContainer.appendChild(recipeCard);
    });
}

renderRecipes();

document.addEventListener("DOMContentLoaded", function () {
    const plannerCards = document.querySelectorAll(".weekly-planner div");
  
    plannerCards.forEach((card) => {
      card.addEventListener("touchstart", () => {
        card.classList.add("move");
        setTimeout(() => {
          card.classList.remove("move");
        }, 300); // Reset after animation duration
      });
    });
  });
  