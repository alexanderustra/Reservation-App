import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from './components/Inputs';
import  styles from './trackOrder.module.css'

interface orderInfoProps {
    name: string;    
    quantity: number;  
    price: number;  
    ingredients: string[]; 
    id: string;
}

function TrackOrder() {
    const [searchedId,setSearchedId] = useState('')
    const [orderPlaced, setOrderPlaced] = useState<string | boolean>('');
    const [noId,setNoId] = useState(false)
    const [orderInfo, setOrderInfo] = useState<orderInfoProps | null>(null);
    const [times, setTimes] = useState({
        placed:false,
        preparing: false,
        delivering: false,
        delivered: false
    });

    const hasPassedMinutes = (time: string | null, minutesToCheck: number): boolean => {
        if (time) {
            const [hours, minutes] = time.split(':').map(Number);
            const paymentDate = new Date();
            paymentDate.setHours(hours, minutes, 0);
    
            const now = new Date();
            const differenceInMinutes = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60));
    
            return differenceInMinutes >= minutesToCheck;
        }
        return false;
    };
    const checkTime = ()=>{
        const time = localStorage.getItem('payment');

            if (time) {
                setTimes({
                    placed: hasPassedMinutes(time, 1),
                    preparing: hasPassedMinutes(time, 3),
                    delivering: hasPassedMinutes(time, 6),
                    delivered: hasPassedMinutes(time, 9)
                });
            }
    }
    useEffect(() => {
        const local = localStorage.getItem('finalOrder');
        const time = localStorage.getItem('payment');
        if (local) {
            setOrderInfo(JSON.parse(local));
        }
        setOrderPlaced(time || false);
        checkTime()
        checkOrderExpiration();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            checkTime()
            checkOrderExpiration();
        }, 60000); // Ejecutar cada minuto

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, []);

    const checkOrderExpiration = () => {
        const time = localStorage.getItem('payment');
        if (time && hasPassedMinutes(time, 60)) {
            localStorage.removeItem('finalOrder');
            setOrderInfo(null); 
        }
    };
    const handleInputChange = (id:string ,value:string)=>{
        setSearchedId(value)
    }
    const handleSearch = () => {
        if (orderInfo && searchedId == orderInfo.id) {
            setNoId(false);  
        } else {
            setNoId(true);   
        }
    };
    
    if (!orderInfo || noId ) {
        return <div>
            <h1>TrackOrder</h1>
            <div className={styles.searchContainer}>
                <Input
                    width="185px"
                    id='email'
                    type='text'
                    placeholder='Order ID'
                    valid={true}
                    value={searchedId}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <h3>No Order Finded</h3>
            <button><Link to="/">Home</Link></button>
        </div>; 
    }
    return (
        <div className={styles.container}>
            <h1>TrackOrder</h1>
            <div className={styles.searchContainer}>
                <Input
                    width="185px"
                    id='email'
                    type='text'
                    placeholder='Order ID'
                    valid={true}
                    value={searchedId}
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className={styles.dataContainer}>
                <p>OrderID: {orderInfo.id}</p>
                <p>Amount: {orderInfo.price}</p>
            </div>
            <ul className={styles.listContainer}>
                <li>
                    <div className={times.placed ? styles.completed : styles.trackList}>
                        <h3>Order Placed</h3>
                        <h4 className={styles.timer} >{times.placed ? 'Completed' : '...'}</h4>
                    </div>
                </li>
                <li>
                    <div className={times.preparing ? styles.completed : styles.trackList}>
                        <h3>Preparing Order</h3>
                        <h4 className={styles.timer}>{times.preparing ? 'Completed' : '...'}</h4>
                    </div>
                </li>
                <li>
                    <div className={times.delivering ? styles.completed : styles.trackList}>
                        <h3>Delivering</h3>
                        <h4 className={styles.timer}>{times.delivering ? 'Completed' : '...'}</h4>
                    </div>
                </li>
                <li>
                    <div className={times.delivered ? styles.completed : styles.trackList}>
                        <h3>Delivered</h3>
                        <h4 className={styles.timer}>{times.delivered ? 'Completed' : '...'}</h4>
                    </div>
                </li>
            </ul>
            <button><Link to="/">Home</Link></button>
        </div>
    );
}

export default TrackOrder;
