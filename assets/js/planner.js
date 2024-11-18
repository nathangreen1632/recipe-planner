import { baseRecipes } from './data.js';

const storedRecipes = localStorage.getItem('recipeArray');
const parsedRecipes = JSON.parse(storedRecipes) || [];
const allRecipes = [...baseRecipes, ...parsedRecipes];

function createRecipeOptions(className) {
    const selectors = document.querySelectorAll('.recipe-selector');

    selectors.forEach(selector => {
        allRecipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.recipeId;
            option.textContent = recipe.recipeName;
            selector.appendChild(option);
        });
    });
}

createRecipeOptions();

const generateGroceryListBtn = document.getElementById('groceryListBtn');

generateGroceryListBtn.addEventListener('click', () => {
    const selectedRecipes = [];
    const allRecipeSelectors = document.querySelectorAll('.recipe-selector');

    allRecipeSelectors.forEach(selector => {
        const selectedRecipeId = selector.value;
        
        if (selectedRecipeId !== 'default-value') {
            const parsedRecipeId = parseInt(selectedRecipeId);
            const selectedRecipe = allRecipes.find(recipe => recipe.recipeId === parsedRecipeId);
            selectedRecipes.push(selectedRecipe);
        }
    });

    if (selectedRecipes.length > 0) {
        const groceryListMap = new Map();

        selectedRecipes.forEach(selectedRecipe => {
            selectedRecipe.ingredients.forEach(ingredient => {
                const ingredientKey = `${ingredient.ingredientName}-${ingredient.unitOfMeasure}`;

                if (groceryListMap.has(ingredientKey)) {
                    groceryListMap.set(ingredientKey, groceryListMap.get(ingredientKey) + parseInt(ingredient.quantity));
                } else {
                    groceryListMap.set(ingredientKey, parseInt(ingredient.quantity));
                }
            });
        });

        const groceryList = [];
        groceryListMap.forEach((quantity, ingredientKey) => {
            const [ingredientName, unitOfMeasure] = ingredientKey.split('-');
            groceryList.push({ ingredientName, quantity, unitOfMeasure });
        });

        localStorage.removeItem('groceryListArray');
        localStorage.setItem('groceryListArray', JSON.stringify(groceryList));

        const successMessage = document.createElement('div');
        successMessage.textContent = 'Ingredients added to grocery list successfully!';
        successMessage.classList.add('success-message');

        const groceryListContainer = groceryListBtn.parentElement;
        groceryListContainer.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    } else {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Please select at least one recipe!';
        errorMessage.classList.add('error-message');

        const groceryListContainer = groceryListBtn.parentElement;
        groceryListContainer.appendChild(errorMessage);

        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
});