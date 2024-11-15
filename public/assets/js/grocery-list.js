function renderGroceryList() {
    const groceryListContainer = document.querySelector('.grocery-list');
    groceryListContainer.innerHTML = '';

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
        if (conversionRates[ingredient.unitOfMeasure]) {
          const multiplier = conversionRates[ingredient.unitOfMeasure];
          adjustedQuantity = (adjustedQuantity * multiplier).toFixed(2);
          ingredient.unitOfMeasure = ingredient.unitOfMeasure === 'oz' || ingredient.unitOfMeasure === 'lb'
            ? 'g'
            : 'ml';
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
  