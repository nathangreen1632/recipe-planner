import { baseRecipes } from './data.js';

const storedRecipes = localStorage.getItem('recipeArray');
const parsedRecipes = JSON.parse(storedRecipes) || [];
const allRecipes = [...baseRecipes, ...parsedRecipes];

function createRecipeOptions(className) {
    const selectors = document.querySelectorAll('.recipe-selector');

    selectors.forEach(selector => {
        allRecipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe;
            option.textContent = recipe.recipeName;
            selector.appendChild(option);
        });
    });
}

createRecipeOptions();