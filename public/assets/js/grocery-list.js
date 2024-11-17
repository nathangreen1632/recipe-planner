if (!localStorage.getItem('groceryListArray')) {
    localStorage.setItem('groceryListArray', JSON.stringify([
      { ingredientName: 'Flour', quantity: 2, unitOfMeasure: 'cups' },
      { ingredientName: 'Sugar', quantity: 1, unitOfMeasure: 'tbsp' },
      { ingredientName: 'Milk', quantity: 500, unitOfMeasure: 'ml' },
    ]));
  }
  
  if (!localStorage.getItem('originalGroceryListArray')) {
    localStorage.setItem('originalGroceryListArray', localStorage.getItem('groceryListArray'));
  }
  
  const conversionRates = {
    oz: 28.35,
    tbsp: 15,
    tsp: 5,
    cup: 240,
    lb: 453.59,
  };
  
  function convertUnits(toMetric, servingSize = 1) {
    const originalIngredients = JSON.parse(localStorage.getItem('originalGroceryListArray')) || [];
    const updatedIngredients = originalIngredients.map(ingredient => {
      let { quantity, unitOfMeasure } = ingredient;
      quantity = parseFloat(quantity) * servingSize;
  
      if (isNaN(quantity)) return ingredient;
  
      if (toMetric) {
        const multiplier = conversionRates[unitOfMeasure];
        if (multiplier) {
          quantity = (quantity * multiplier).toFixed(2);
          unitOfMeasure = unitOfMeasure === 'oz' || unitOfMeasure === 'lb' ? 'g' : 'ml';
        }
      } else {
        if (unitOfMeasure === 'g') {
          if (quantity >= 453.59) {
            quantity = (quantity / 453.59).toFixed(2);
            unitOfMeasure = 'lb';
          } else {
            quantity = (quantity / 28.35).toFixed(2);
            unitOfMeasure = 'oz';
          }
        } else if (unitOfMeasure === 'ml') {
          if (quantity >= 240) {
            quantity = (quantity / 240).toFixed(2);
            unitOfMeasure = 'cup';
          } else if (quantity >= 15) {
            quantity = (quantity / 15).toFixed(2);
            unitOfMeasure = 'tbsp';
          } else {
            quantity = (quantity / 5).toFixed(2);
            unitOfMeasure = 'tsp';
          }
        }
      }
  
      return { ...ingredient, quantity, unitOfMeasure };
    });
  
    localStorage.setItem('groceryListArray', JSON.stringify(updatedIngredients));
    return updatedIngredients;
  }
  
  function renderGroceryList() {
    const ingredientList = document.getElementById('ingredientList');
    ingredientList.innerHTML = '';
  
    const storedGroceryList = JSON.parse(localStorage.getItem('groceryListArray')) || [];
    storedGroceryList.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `${item.quantity} ${item.unitOfMeasure} - ${item.ingredientName}`;
      ingredientList.appendChild(listItem);
    });
  }
  
  document.getElementById('toMetric').addEventListener('click', () => {
    const servingSize = parseInt(document.getElementById('servingSize').value, 10) || 1;
    convertUnits(true, servingSize);
    renderGroceryList();
  });
  
  document.getElementById('toImperial').addEventListener('click', () => {
    const servingSize = parseInt(document.getElementById('servingSize').value, 10) || 1;
    convertUnits(false, servingSize);
    renderGroceryList();
  });
  
  document.getElementById('clearList').addEventListener('click', () => {
    localStorage.removeItem('groceryListArray');
    localStorage.removeItem('originalGroceryListArray');
    renderGroceryList();
  });
  
  renderGroceryList();
  