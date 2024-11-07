import Input from './components/Inputs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodsJson } from './components/foods';

import styles from './deliveryForm.module.css';
import { CrossIcon, PlusIcon } from './components/Svgs';

interface Ingredient {
  name: string;
  price: number;
  active: boolean;
}

interface Food {
  name: string;
  description: string;
  ingredients: Ingredient[];
  tags: string[];
  image: string;
  category: string;
  price: number;
  isDessert: boolean;
  discount: number;
  active: boolean;
}

function DeliveryOrder() {
  const [priceWithoutIngredients, setPriceWithoutIngredients] = useState(0);
  const [cuantity, setCuantity] = useState(1);
  const [foodName, setFoodName] = useState<string | null>(null);
  const [foodDetails, setFoodDetails] = useState<Food | null>(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [finalOrder, setFinalOrder] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedFoodName = localStorage.getItem('foodName');
    if (storedFoodName) {
      setFoodName(storedFoodName);
    }
  }, []);

  useEffect(() => {
    if (foodName) {
      const foundFood = foodsJson.find((food) => food.name === foodName);
      if (foundFood) {
        // Solo se establece al inicio o al cambiar foodName
        const initialIngredients = foundFood.ingredients.map((ingredient) => ({
          ...ingredient,
          active: true,
        }));
        
        const updatedFood = { ...foundFood, ingredients: initialIngredients } as any;
        setFoodDetails(updatedFood);
  
        setPriceWithoutIngredients(foundFood.price);
      } else {
        console.log("Food not found in the JSON");
      }
    }
  }, [foodName]);
  
  useEffect(() => {
    if (foodDetails) {
      const basePrice = foodDetails.price;
      const activeIngredientsPrice = foodDetails.ingredients
        .filter((ingredient) => ingredient.active)
        .reduce((sum, ingredient) => sum + ingredient.price, 0);
  
      const discountMultiplier = 1 - foodDetails.discount / 100;
      const totalPrice = (basePrice + activeIngredientsPrice) * discountMultiplier * cuantity;
      setFinalPrice(totalPrice);
    }
  }, [foodDetails, cuantity]);
  

  useEffect(() => {
    const discountFactor = foodDetails ? (100 - foodDetails.discount) / 100 : 1;
    setFinalOrder({
      name: foodDetails?.name,
      cuantity,
      price: finalPrice * discountFactor,
      ingredients: foodDetails?.ingredients.filter(ing => ing.active).map(ing => ing.name),
      id: generateRandomId(),
      discount: foodDetails?.discount,
    });
  }, [foodDetails, cuantity, finalPrice]);

  const generateRandomId = () => Math.floor(10000 + Math.random() * 90000);

  const handleInputChange = (id: string, value: string | number) => {
    if (id === 'cuantity' && foodDetails) {
      const newCuantity = Number(value);
      const basePrice = foodDetails.price;
      const activeIngredientsPrice = foodDetails.ingredients
        .filter((ingredient) => ingredient.active)
        .reduce((sum, ingredient) => sum + ingredient.price, 0);

      const discountMultiplier = 1 - foodDetails.discount / 100;
      setCuantity(newCuantity);
      setFinalPrice((basePrice + activeIngredientsPrice) * discountMultiplier * newCuantity);
    }
  };

  const handleRequest = () => {
    if (cuantity <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }

    localStorage.setItem('finalOrder', JSON.stringify(finalOrder));
    localStorage.setItem('orderMethod', 'fromDeliveryOrder');
    navigate('/deliveryPayment', { state: { from: location.pathname } });
  };

  const handleCart = () => {
    if (cuantity <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }

    const newOrder = {
      name: foodDetails?.name,
      cuantity,
      price: finalPrice,
      isDessert: foodDetails?.isDessert,
      ingredients: foodDetails?.ingredients.filter(ing => ing.active).map(ing => ing.name),
      discount: foodDetails?.discount,
    };

    const existingCart: any[] = JSON.parse(localStorage.getItem('cart') as string) || [];
    existingCart.push(newOrder);
    localStorage.setItem('cart', JSON.stringify(existingCart));
    localStorage.setItem('openModalCart', JSON.stringify(true));
    navigate('/delivery');
  };

  const toggleIngredient = (ingredientName: string) => {
    if (foodDetails) {
      const updatedIngredients = foodDetails.ingredients.map((ingredient) =>
        ingredient.name === ingredientName ? { ...ingredient, active: !ingredient.active } : ingredient
      );
      
      const updatedFood = { ...foodDetails, ingredients: updatedIngredients };
      setFoodDetails(updatedFood);
      
      const basePrice = updatedFood.price;
      const activeIngredientsPrice = updatedIngredients
        .filter((ingredient) => ingredient.active)
        .reduce((sum, ingredient) => sum + ingredient.price, 0);
      
      const discountMultiplier = 1 - updatedFood.discount / 100;
      setFinalPrice((basePrice + activeIngredientsPrice) * discountMultiplier * cuantity);
    }
  };

  return (
    <div id='formContainer'>
      <h1 id='title'>Delivery</h1>
      <form action="" className={styles.orderForm}>
        <h2>{foodName}</h2>
        <p>{foodDetails?.description}</p>

        <h3>Ingredients:</h3>
        <ul>
          {foodDetails?.ingredients.map((ing, index) => (
            <li key={index} onClick={() => toggleIngredient(ing.name)} style={{ cursor: 'pointer' }}>
              <span style={{ color: ing.active ? '#FFFFFF' : 'gray' }}>
                {ing.name} ${ing.price}
              </span>
              <span style={{ color: ing.active ? 'red' : 'green', marginLeft: '10px' }}>
                {ing.active ? <CrossIcon /> : <PlusIcon />}
              </span>
            </li>
          ))}
        </ul>

        <p>Product Price: ${foodDetails ? ((foodDetails.price) * (1 - foodDetails.discount / 100)).toFixed(2) : 1}</p>
        <Input 
          min={1}
          width='90px'
          id='cuantity'
          label='Cuantity'
          type='number'
          validInfo={true}
          value={cuantity}
          onChange={handleInputChange}
        />
        <p style={{ fontSize: '18px', marginTop: '15px' }}>Final Price: ${finalPrice.toFixed(2)}</p>

        <div className={styles.buttonsContainer}>
          <button type="button" onClick={handleRequest}>Request</button>
          <button type="button" onClick={handleCart}>Cart</button>
        </div>
      </form>
      <button onClick={() => navigate('/delivery')}>Go Back</button>
    </div>
  );
}

export default DeliveryOrder;
