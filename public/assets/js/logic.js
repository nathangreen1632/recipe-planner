import { baseRecipes } from './data.js';

const addRecipeBtn = document.getElementById('add-recipe-btn');
const recipeModal = document.getElementById('recipe-modal');
const closeRecipeModal = document.getElementById('close-recipe-modal');
const recipeForm = document.getElementById('recipe-form');
const ingredientList = document.getElementById('ingredient-list');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const instructionList = document.getElementById('instruction-list');
const addInstructionBtn = document.getElementById('add-instruction-btn');

const storedRecipes = localStorage.getItem('recipeArray');
const parsedRecipes = JSON.parse(storedRecipes) || [];
const allRecipes = [...baseRecipes, ...parsedRecipes];

const recipeContainer = document.getElementById('recipe-container');

function renderRecipes() {
    const recipeContainer = document.getElementById('recipe-container');

    // Clear any existing child elements (optional)
    recipeContainer.innerHTML = ''; // Uncomment if you want to clear previous recipes



    allRecipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        recipeContainer.appendChild(recipeCard);
    });
}

renderRecipes();

function createIngredientField() {
    const ingredientItem = document.createElement('div');
    ingredientItem.classList.add('ingredient-item');

    const ingredientNameInput = document.createElement('textarea');
    ingredientNameInput.id = 'ingredient-input';
    ingredientNameInput.name = 'ingredients[]';
    ingredientNameInput.placeholder = 'Ingredient Name';
    ingredientNameInput.required = true;

    const quantityInput = document.createElement('input');
    quantityInput.id = 'ingredient-input';
    quantityInput.setAttribute('type', 'text');
    quantityInput.name = 'ingredients[].quantity';
    quantityInput.placeholder = 'Quantity';
    quantityInput.required = true;

    const unitOfMeasureSelect = document.createElement('select');
    unitOfMeasureSelect.name = 'ingredients[].unitOfMeasure';

    const unitOptions = [
        {value: null, text: 'none'},
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

    ingredientList.appendChild(ingredientItem);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        ingredientItem.remove();
    });

    ingredientItem.appendChild(removeButton);
}

function parseQuantity(quantityString) {
    const trimmedQuantity = quantityString.trim();

    if (!trimmedQuantity) {
        return null;
    }

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

function createInstructionField() {
    const instructionItem = document.createElement('div');
    instructionItem.classList.add('instruction-item');

    const stepSpan = document.createElement('span');
    stepSpan.textContent = instructionList.children.length + 1 + '. ';

    const stepDescriptionInput = document.createElement('textarea');
    stepDescriptionInput.id = 'instruction-input';
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
    if (recipeModal.classList.contains('hidden')) {
        recipeModal.classList.remove('hidden');
        addRecipeBtn.textContent = '- New Recipe';
    } else {
        recipeModal.classList.add('hidden');
        addRecipeBtn.textContent = '+ New Recipe';
    }
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
        const quantityInput = item.querySelector('input[type="text"]');
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

    renderRecipes();
});

function createRecipeCard(recipe) {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    const recipeName = document.createElement('h3');
    recipeName.textContent = recipe.recipeName;

    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.mealImage || './assets/images/placeholder.webp';

    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = recipe.description

    const recipeDetails = document.createElement('ul');

    const ingredientList = document.createElement('div');
    const ingredientListHeader = document.createElement('h4');
    ingredientListHeader.textContent = 'Ingredients:';
    const ingredientDetails = document.createElement('ul');
    ingredientDetails.classList.add('ingredient-details');
    recipe.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.textContent = `${ingredient.quantity} ${ingredient.unitOfMeasure} ${ingredient.ingredientName}`;
        ingredientDetails.appendChild(ingredientItem);
    });

    ingredientList.appendChild(ingredientListHeader);
    ingredientList.appendChild(ingredientDetails);
    recipeDetails.appendChild(ingredientList);

    const instructionList = document.createElement('div');
    const instructionListHeader = document.createElement('h4');
    instructionListHeader.textContent = 'Instructions:';
    const instructionDetails = document.createElement('ul');
    recipe.instructions.forEach(instruction => {
        const instructionItem = document.createElement('li');
        instructionItem.textContent = `${instruction.step}. ${instruction.stepDescription}`;
        instructionDetails.appendChild(instructionItem);
    });
    
    instructionList.appendChild(instructionListHeader);
    instructionList.appendChild(instructionDetails);
    recipeDetails.appendChild(instructionList);
    
    ingredientList.classList.add('hidden');
    ingredientDetails.classList.add('hidden');
    instructionList.classList.add('hidden');
    instructionDetails.classList.add('hidden');


    const additionalDetails = document.createElement('div');
    
    const difficulty = document.createElement('p');
    difficulty.textContent = `Difficulty: ${recipe.difficultyLevel || 'Unknown'}`;

    const category = document.createElement('p');
    category.textContent = `Category: ${recipe.category || 'Unknown'}`;

    const cuisine = document.createElement('p');
    cuisine.textContent = `Cuisine: ${recipe.cuisine || 'Unknown'}`;

    const source = document.createElement('p');
    source.textContent = `Source: ${recipe.source || 'Unknown'}`;

    const servings = document.createElement('p');
    servings.textContent = `Servings: ${recipe.servings || 'Unknown'}`;

    const ingredientToggle = document.createElement('button');
    ingredientToggle.textContent = 'Show Ingredients';
    ingredientToggle.addEventListener('click', () => {
        ingredientList.classList.toggle('hidden');
        ingredientDetails.classList.toggle('hidden');
        ingredientToggle.textContent = ingredientToggle.textContent === 'Show Ingredients' ? 'Hide Ingredients' : 'Show Ingredients';
    });

    const instructionToggle = document.createElement('button');
    instructionToggle.textContent = 'Show Instructions';
    instructionToggle.addEventListener('click', () => {
        instructionList.classList.toggle('hidden');
        instructionDetails.classList.toggle('hidden');
        instructionToggle.textContent = instructionToggle.textContent === 'Show Instructions' ? 'Hide Instructions' : 'Show Instructions';
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove Recipe';
    removeButton.classList.add('remove-recipe-btn');

    removeButton.addEventListener('click', () => {
        const recipeCard = removeButton.closest('.recipe-card');

        if (recipeCard) {
            const recipeName = recipeCard.querySelector('h3').textContent;

            const recipeIndex = parsedRecipes.findIndex(recipe => recipe.recipeName === recipeName);

            if (recipeIndex !== -1) {
                parsedRecipes.splice(recipeIndex, 1);

                localStorage.setItem('recipeArray', JSON.stringify(parsedRecipes));

                recipeCard.remove();
                renderRecipes();
            }
        } else {
            console.error('Recipe card not found');
        }
    });

    recipeDetails.appendChild(ingredientToggle);
    recipeDetails.appendChild(instructionToggle);

    additionalDetails.appendChild(difficulty);
    additionalDetails.appendChild(category);
    additionalDetails.appendChild(cuisine);
    additionalDetails.appendChild(servings);
    additionalDetails.appendChild(source);
    additionalDetails.appendChild(removeButton);

    recipeDetails.appendChild(additionalDetails);

    recipeCard.appendChild(recipeName);
    recipeCard.appendChild(recipeImage);
    recipeCard.appendChild(recipeDescription);
    recipeCard.appendChild(recipeDetails);

    return recipeCard;
}