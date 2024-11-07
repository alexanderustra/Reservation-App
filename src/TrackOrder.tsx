import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './components/Inputs';
import  styles from './trackOrder.module.css'
import { BikeSvg, HouseSvg, NoteSvg, SaladSvg, SearchIcon, TrackOrderSvg } from './components/Svgs';
import { SuccessModal } from './components/successModals';

interface orderInfoProps {
    name: string;    
    quantity: number;  
    price: number;  
    ingredients: string[]; 
    id: string;
}

function TrackOrder() {
    const navigate = useNavigate();
    const [searchedId,setSearchedId] = useState('')
    const [orderPlaced, setOrderPlaced] = useState<string | boolean>('');
    const [noId,setNoId] = useState(false)
    const [orderInfo, setOrderInfo] = useState<orderInfoProps | null>(null);
    const [openModal,setOpenModal] = useState<boolean>(false)
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
            setNoId(false)
        }
        setOrderPlaced(time || false);
        checkTime()
        checkOrderExpiration();

        const modalPay = localStorage.getItem('openModalPay')
        setOpenModal(modalPay === "true")
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            checkTime()
            checkOrderExpiration();
        }, 60000);

        return () => clearInterval(interval); 
    }, []);

    const checkOrderExpiration = () => {
        const time = localStorage.getItem('payment');
        if (time && hasPassedMinutes(time, 60)) {
            localStorage.removeItem('finalOrder');
            setNoId(true)
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
    const paymentInfo =  JSON.parse(localStorage.getItem('paymentInfo') || '{}')

    const handleCloseModal = ()=>{
        setOpenModal(false)
        localStorage.setItem('openModalPay',JSON.stringify(false))
      }

    
        return (
            <div className={styles.container} >
                <SuccessModal msg='Your order has been Sent' open = {openModal} onClick={handleCloseModal}/>
                <h1 id='title'>TrackOrder</h1>
                <div className={styles.searchContainer}>
                    <Input
                        width="78%"
                        id='search'
                        type='text'
                        placeholder='Order ID'
                        validInfo={true}
                        value={searchedId}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleSearch}><SearchIcon/></button>
                </div>
                {(!noId || localStorage.getItem('orderInfo')) && orderInfo && 
                <>
                    <div className={styles.dataContainer}>
                        <p>OrderID: {orderInfo ? orderInfo.id : ''}</p>
                        <p>Amount: {orderInfo ? orderInfo.price : ''}</p>
                    </div>
                    <ul className={styles.listContainer}>
        
                        <li  className={times.placed ? styles.completed : styles.trackList}>
                            <NoteSvg/>
                            <h3>Order Placed</h3>
                            <h4 className={styles.timer} >{times.placed ? 'Completed' : 'pending...'}</h4>
                        </li>
                        <li className={times.preparing ? styles.completed : styles.trackList}>
                            <SaladSvg/>
                            <h3>Preparing Order</h3>
                            <h4 className={styles.timer}>{times.preparing ? 'Completed' : 'pending...'}</h4>
                        </li>
                        <li className={times.delivering ? styles.completed : styles.trackList}>
                            <BikeSvg/>
                            <h3>Delivering</h3>
                            <h4 className={styles.timer}>{times.delivering ? 'Completed' : 'pending...'}</h4>
                        </li>
                        <li className={times.delivered ? styles.completed : styles.trackList}>
                            <HouseSvg/>
                            <h3>Delivered</h3>
                            <h4 className={styles.timer}>{times.delivered ? 'Completed' : 'pending...'}</h4>
                        </li>
                    </ul>
                    <div className={styles.deliveryAdress}>
                        <TrackOrderSvg/>
                        <div>
                            <h3>Delivery Adress</h3>
                            <h3>{paymentInfo.deliverTo}</h3>
                        </div>
                    </div>
                </>
                }
                {noId && <>
                    <h3 className={styles.idNotFoundedH3}>Your order does not exist or has expired</h3>
                    <button className={styles.cancelBtn} onClick={()=>setNoId(false)}>Cancel</button>
                </>
                }
                <button onClick={()=> navigate('/Reservation-App/')}>Home</button>
            </div>
        );
    }

export default TrackOrder;
