import React, { useState } from 'react';

interface Ingredient {
  name: string;
  active: boolean;
}

interface FormProps {
  foodName: string;
  description: string;
  ingredients: Ingredient[];
  price: number;
  onToggleIngredient: (name: string) => void;
}

const FoodForm: React.FC<FormProps> = ({ foodName, description, ingredients, price, onToggleIngredient }) => {
  return (
    <form>
      <h2>{foodName}</h2>
      <p>{description}</p>
      
      <h3>Ingredients:</h3>
      <ul>
        {ingredients.map((ing, index) => (
          <li key={index} onClick={() => onToggleIngredient(ing.name)} style={{ cursor: 'pointer' }}>
            <span style={{ textDecoration: ing.active ? 'none' : 'line-through', color: ing.active ? 'black' : 'gray' }}>
              {ing.name}
            </span>
            <span style={{ color: ing.active ? 'red' : 'green', marginLeft: '10px' }}>
              {ing.active ? '❌' : '➕'}
            </span>
          </li>
        ))}
      </ul>

      <p>Price: ${price}</p>
    </form>
  );
};

export default FoodForm;