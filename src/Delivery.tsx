import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
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
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    fetch('/foods.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Food[]) => setFoods(data))
      .catch(error => console.error('Error fetching the JSON file:', error));
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
    <div>
        <Link to="/Reservation-App/"><button>Home</button></Link>
      <h1>Food List by Category</h1>
      {Object.keys(categorizedFoods).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul className='foodContainer'>
            {categorizedFoods[category].map((food, index) => (
              <Link to="/deliveryOrder" key={index}>
                <li className='food' onClick={()=>{
                    localStorage.setItem('foodName',food.name)
                }}>
                  <img src={food.image} alt={food.name}  />
                  <div className='foodNameContainer'>
                    <h3>{food.name}</h3>
                    <h3 className={food.discount ? 'discountedPrice' : 'price'}>$ {food.discount > 0 ? (food.price * (1 - food.discount / 100)).toFixed(2) : food.price.toFixed(2)}</h3>
                    {food.discount >= 0 ? <h3 className='discount'>{food.discount} %</h3> : '' }
                  </div>
                  <p className='tags'>{food.tags.join(', ')}</p>
                  <p className='tags2'>{food.tags.join(', ')}</p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FoodList;
