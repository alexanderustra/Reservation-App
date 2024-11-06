import { useNavigate } from 'react-router-dom';
import style from './deals.module.css'
function Deals () {
    const navigate = useNavigate()
    return (
        <div className={style.deals} id='formContainer'>
            <h1 id='title'>Deals</h1>
            <ul className={style.dealsContainer}>
            <p>Discounts</p>
                <li className={style.dealsLi}><p>Pizzas </p><p className={style.discount}> 30% Off</p></li>
                <li className={style.dealsLi}><p>Hamburguers </p><p className={style.discount}> 30% Off</p></li>
            </ul>
            <button onClick={()=>navigate('/Reservation-App/')}>Home</button>
        </div>
    )
}
export default Deals