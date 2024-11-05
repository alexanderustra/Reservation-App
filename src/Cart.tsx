import { useEffect, useState } from 'react';
import style from './cart.module.css'
import { DessertSvg, FoodSvg } from './components/Svgs';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    name: string;
    price: number;
    ingredients: string[];
    cuantity: number; 
    isDessert:boolean;
    discount:number;
}

function Cart() {
    const navigate = useNavigate()
    const [cart, setCart] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCart(parsedCart);
        }
      }, []);

      useEffect(() => {
        const total = cart.reduce((acc, item) => {
            const discountedPrice = (item.price * (1 - item.discount / 100)) * item.cuantity;
            return acc + discountedPrice;
          }, 0);
          
          setTotalPrice(parseFloat(total.toFixed(2)));
    }, [cart]);

    const handleCompleteOrder =()=>{
        navigate('/deliveryPayment', { state: { from: location.pathname }})
        localStorage.setItem('orderMethod', 'fromCart')
    }
    
    return (
        <div id='formContainer'>  
            <h1 id='title'>Cart</h1>
            <ul className={style.cartContainer}>
                {cart.map((item, index) => (
                    <li key={index}>
                        {item.isDessert ? <DessertSvg/> : <FoodSvg/>}
                        <h3 className={style.name}>{item.name}</h3>
                        <h3 className={style.price}>{item.cuantity}</h3>
                    </li>
                ))}
                <p>Total : {totalPrice}</p>
            </ul>
            <div className={style.buttonsContainer}>
                {cart.length > 0 ? <button onClick={handleCompleteOrder}>Request</button> : ''}
                <button onClick={()=> navigate('/Reservation-App/')}>
                    Home
                </button>
            </div>
        </div>
    );
}

export default Cart; 
