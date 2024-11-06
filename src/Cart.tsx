import { useEffect, useState } from 'react';
import style from './cart.module.css';
import { DessertSvg, FoodSvg } from './components/Svgs';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    name: string;
    price: number;
    ingredients: string[];
    cuantity: number; 
    isDessert: boolean;
    discount: number;
}

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [markedItemIndex, setMarkedItemIndex] = useState<number | null>(null); // Estado para marcar el ítem a eliminar

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

    const handleCompleteOrder = () => {
        navigate('/deliveryPayment', { state: { from: location.pathname } });
        localStorage.setItem('orderMethod', 'fromCart');
    };

    const handleItemHold = (index: number) => {
        if (markedItemIndex === index) {
            // Si ya está marcado y se hace clic, se elimina
            const updatedCart = cart.filter((_, i) => i !== index);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart)); // Actualiza el carrito en localStorage
            setMarkedItemIndex(null); // Desmarca el item
        } else {
            // Marca el ítem para posible eliminación
            setMarkedItemIndex(index);
        }
    };

    // Detecta clic fuera del elemento marcado para desmarcarlo
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (markedItemIndex !== null) {
                const target = event.target as HTMLElement;
                if (!target.closest(`.${style.cartContainer} li`)) {
                    setMarkedItemIndex(null);
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [markedItemIndex]);

    return (
        <div id='formContainer'>  
            <h1 id='title'>Cart</h1>
            <ul className={style.cartContainer}>
                {cart.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => handleItemHold(index)}
                        className={markedItemIndex === index ? style.markedForDeletion : style.cartLi}
                    >
                        {item.isDessert ? <DessertSvg/> : <FoodSvg/>}
                        <h3 className={style.name}>{item.name}</h3>
                        <h3 className={style.price}>{item.cuantity}</h3>
                    </li>
                ))}
                <p>Total : {totalPrice}</p>
            </ul>
            <div className={style.buttonsContainer}>
                {cart.length > 0 ? <button onClick={handleCompleteOrder}>Request</button> : ''}
                <button onClick={() => navigate('/Reservation-App/')}>
                    Home
                </button>
            </div>
        </div>
    );
}

export default Cart;
