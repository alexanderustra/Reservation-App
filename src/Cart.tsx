import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

interface Food {
    name: string;
    description: string;
    ingredients: string[];
    tags: string[];
    image: string;
    category: string;
    price: number;
    discount:number
}

function Cart() {
    const navigate = useNavigate()
    const [cart, setCart] = useState<CartItem[]>([]);
    const [foodToEdit, setFoodToEdit] = useState<Food | null>(null);
    const [openModal, setOpenModal] = useState(false);
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

    const handleEdit = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        const foodName = cart[index].name;

        fetch('/foods.json')
        .then((response) => response.json())
        .then((data: Food[]) => {
          const foundFood = data.find((food) => food.name === foodName);
          if (foundFood) {
            setFoodToEdit(foundFood);
            setOpenModal(true);
          } else {
            console.log('Food not found in the JSON');
          }
        })
        .catch((error) => console.error('Error fetching the JSON file:', error));
    };

    const toggleIngredient = (ingredientName: string) => {
        if (foodToEdit) {
            setFoodToEdit({
                ...foodToEdit,
                ingredients: foodToEdit.ingredients.map((ing) =>
                    ing === ingredientName ? `❌${ing}` : ing
                ),
            });
        }
    };

    const handleDelete = (index: number) => {
        const updatedCart = cart.filter((_, i) => i !== index); 
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setOpenModal(false);
    };
    const handleCompleteOrder =()=>{
        navigate('/deliveryPayment', { state: { from: location.pathname }})
        localStorage.setItem('orderMethod', 'fromCart')
    }

    const FoodModal = ({ foodToEdit, index }: { foodToEdit: Food, index: number }) => {
        return (
            <form>
                <h2>{foodToEdit.name}</h2>
                <p>{foodToEdit.description}</p>
                <h3>Ingredients:</h3>
                <ul>
                    {foodToEdit.ingredients.map((ing, index) => (
                        <li
                            key={index}
                            onClick={() => toggleIngredient(ing)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>{ing}</span>
                        </li>
                    ))}
                </ul>
    
                <p>Price: ${ foodToEdit.price  * (1 - foodToEdit.discount / 100)}</p>
    
                <button type="button" onClick={() => setOpenModal(false)}>Close</button>
                <button type="button" onClick={() => handleDelete(index)}>Delete</button>
            </form>
        );
    };
    
    return (
        <>  
            <h1 id='title'>Cart</h1>
            <ul className={style.cartContainer}>
                {cart.map((item, index) => (
                    <li key={index} onClick={(e) => handleEdit(index, e)}>
                        {item.isDessert ? <DessertSvg/> : <FoodSvg/>}
                        <h3 className={style.name}>{item.name}</h3>
                        <h3 className={style.price}>{item.cuantity}</h3>
                    </li>
                ))}
            </ul>
            <p>Total : {totalPrice}</p>
            {cart.length > 0 ? <button onClick={handleCompleteOrder}>Complete Order</button> : ''}
            {openModal && foodToEdit && (
                <FoodModal foodToEdit={foodToEdit} index={cart.findIndex(item => item.name === foodToEdit.name)} />
            )}

            <button>
                <Link to="/">Home</Link>
            </button>
        </>
    );
}

export default Cart; 
