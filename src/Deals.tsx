import { Link } from 'react-router-dom';
import style from './deals.module.css'
function Deals () {
    return (
        <div id='deals'>
            <h1>Deals</h1>
            <p>Discounts</p>
            <ul className={style.dealsContainer}>
                <li className={style.dealsLi}><p>Pizzas </p><p className='discount'> 30% Off</p></li>
                <li className={style.dealsLi}><p>Hamburguers </p><p className='discount'> 30% Off</p></li>
            </ul>
            <button><Link to="/">Home</Link></button>
        </div>
    )
}
export default Deals