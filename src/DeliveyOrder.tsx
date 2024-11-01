import { Link } from 'react-router-dom';
import Input from './components/Inputs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './deliveryForm.module.css'

interface Food {
  name: string;
  description: string;
  ingredients: string[];
  tags: string[];
  image: string;
  category: string;
  price: number;
  isDessert:boolean;
  discount:number;
}

function DeliveryOrder () {
  const [cuantity, setCuantity] = useState(1);
  const [foodName, setFoodName] = useState<string | null>(null);
  const [foodDetails, setFoodDetails] = useState<Food | null>(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [finalOrder, setFinalOrder] = useState({});
  const navigate = useNavigate();
  
  const [ingredients, setIngredients] = useState<{ name: string, active: boolean }[]>([]);

  useEffect(() => {
    const storedFoodName = localStorage.getItem('foodName');
    if (storedFoodName) {
      setFoodName(storedFoodName);
    }
  }, []); 

  useEffect(() => {
    if (foodName) {
      fetch('/foods.json')
        .then((response) => response.json())
        .then((data: Food[]) => {
          const foundFood = data.find((food) => food.name === foodName);
          if (foundFood) {
            setFinalPrice(foundFood.price * (1 - foundFood.discount / 100))
            setFoodDetails(foundFood);
            setIngredients(foundFood.ingredients.map(ing => ({ name: ing, active: true })));
            console.log('Price ' +foundFood.price)
            console.log(' discount ' + foundFood.discount )
          } else {
            console.log('Food not found in the JSON');
          }
        })
        .catch((error) => console.error('Error fetching the JSON file:', error));
    }
  }, [foodName]);

  useEffect(() => {
    const discountFactor = foodDetails? (100 - foodDetails.discount) / 100 : 1
    setFinalOrder({
      name: foodDetails?.name,
      cuantity: cuantity,
      price: finalPrice * discountFactor,
      ingredients: ingredients.filter(ing => ing.active).map(ing => ing.name),
      id: generateRandomId(),
      discount: foodDetails?.discount,
    });
  }, [ingredients, cuantity, finalPrice]); 

  const generateRandomId = () => {
    return Math.floor(10000 + Math.random() * 90000); 
  };

  const handleInputChange = (id: string, value: string | number) => {
    if (id === 'cuantity' && foodDetails) {
      const newCuantity = Number(value);

      const productPrice = foodDetails.price * (1 - foodDetails.discount / 100); 
      console.log('product price ' + productPrice)
      setCuantity(newCuantity); 

      if (foodDetails) {
        const newFinalPrice = newCuantity * productPrice; 
        setFinalPrice(newFinalPrice); 
      }
    }
};

  const handleRequest = ()=>{
    if (cuantity <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }

    localStorage.setItem('finalOrder', JSON.stringify(finalOrder));
    localStorage.setItem('orderMethod', 'fromDeliveryOrder')
    navigate('/deliveryPayment', { state: { from: location.pathname }})
  }

  const handleCart = () => {
    if (cuantity <= 0) {
      alert('Quantity must be greater than 0.');
      return;
    }
  
    const newOrder = {
      name: foodDetails?.name,
      cuantity: cuantity,
      price: foodDetails?.price, 
      isDessert: foodDetails?.isDessert,
      ingredients: ingredients.filter(ing => ing.active).map(ing => ing.name),
      discount: foodDetails?.discount
    };    
  
    const existingCart: any[] = JSON.parse(localStorage.getItem('cart') as string) || [];
    existingCart.push(newOrder);
    console.log(existingCart)
    localStorage.setItem('cart', JSON.stringify(existingCart));
    navigate('/delivery'); 
  };
  


  const toggleIngredient = (ingredient: string) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.name === ingredient ? { ...ing, active: !ing.active } : ing
      )
    );
  };
  console.log('final ' + finalPrice)
  return (
    <div>
      <h1>Delivery</h1>
      <form action="" className={styles.orderForm}>
        <h2>{foodName}</h2>
        <p>{foodDetails?.description}</p>
        
        <h3>Ingredients:</h3>
        <ul>
          {ingredients.map((ing, index) => (
            <li key={index} onClick={() => toggleIngredient(ing.name)} style={{ cursor: 'pointer' }}>
              <span style={{ textDecoration: ing.active ? 'none' : 'line-through', color: ing.active ? '#FFFFFF' : 'gray' }}>
                {ing.name}
              </span>
              <span style={{ color: ing.active ? 'red' : 'green', marginLeft: '10px' }}>
                {ing.active ? '❌' : '➕'}
              </span>
            </li>
          ))}
        </ul>

        <p>Product Price: ${foodDetails? foodDetails.price * (1 - foodDetails.discount / 100) : 1}</p>
        <p>Final Price : ${finalPrice}</p>
        
        <Input 
          id='cuantity'
          label='Cuantity'
          type='number'
          valid={true}
          value={cuantity}
          onChange={handleInputChange}
        />

        <button type="button" onClick={handleRequest}>Request</button>
        <button type="button" onClick={handleCart}>Cart</button>
        
      </form>
      <button>
        <Link to="/delivery">Go Back</Link>
      </button>
    </div>
  );
}
export default DeliveryOrder;
