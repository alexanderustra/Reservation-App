import React, { useEffect, useState } from 'react';
import { foodsJson } from './components/foods';
import { useNavigate } from 'react-router-dom'; 
import './delivery.css'

interface Food {
  name: string;
  description: string;
  ingredients: string[];
  tags: string[];
  image: string;
  category: string;
  price: number;
  discount:number;
}

const FoodList: React.FC = () => {
  const navigate = useNavigate()
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    setFoods(foodsJson)
  }, []);

  const categorizeFoods = () => {
    return foods.reduce((categories: { [key: string]: Food[] }, food) => {
      const category = food.category;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(food);
      return categories;
    }, {});
  };
  
  const categorizedFoods = categorizeFoods();

  return (
    <div id='formContainer' style={{paddingRight:'0px',}}>
      <h1 id='title'>Delivery</h1>
      {Object.keys(categorizedFoods).map((category) => (
        <div key={category}>
          <h2 className='categoryH2'>{category}</h2>
          <ul className='foodContainer'>
            {categorizedFoods[category].map((food, index) => (
                <li key={index} className='food' onClick={()=>{
                    navigate('/deliveryOrder')
                    localStorage.setItem('foodName',food.name)
                }}>
                  <h3>{food.name}</h3>
                  <div className='foodContent'>
                    <img src={food.image} alt={food.name} />
                    <div className='foodPriceContainer'>
                      <h3 className={food.discount ? 'discountedPrice' : 'price'}>$ {food.discount > 0 ? (food.price * (1 - food.discount / 100)).toFixed(2) : food.price.toFixed(2)}</h3>
                      {food.discount > 0 ? <h3 className='discount'>{food.discount} %</h3> : '' }
                    </div>
                    <p className='tags'>{food.tags.join(', ')}</p>
                  </div>
                </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={()=>navigate('/Reservation-App/')}>Home</button>
    </div>
  );
};

export default FoodList;
