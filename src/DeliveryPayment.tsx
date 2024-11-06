import { useState } from 'react';
import Input from './components/Inputs';
import { useNavigate ,useLocation} from 'react-router-dom';

import styles from './deliveryForm.module.css'

function DeliveryPayment() {
  const location = useLocation();
  const previousPage = location.state?.from;
  const navigate = useNavigate()
  const [paymentInfo, setPaymentInfo] = useState({
    deliverTo: '',
    phone:'',
    annotation: '',
    payment: {
      method: 'Credit Card',
      name: '',
      expiry: '',
      cardNumber: '',
      cvv: ''
    }
  });

  const [errors, setErrors] = useState<string[]>([]);
  
  //useEffect(()=>{
    //const orderInfo = localStorage.getItem('finalOrder')
    //const cartInfo = localStorage.getItem('cart')
    //const paymentMethod = localStorage.getItem('orderMethod')
  //},[])

  const handleInputChange = (id: string, value: string | number) => {
    setPaymentInfo((prevState) => {
      if (id in prevState.payment) {
        return {
          ...prevState,
          payment: {
            ...prevState.payment,
            [id]: value
          }
        };
      } else {
        return {
          ...prevState,
          [id]: value
        };
      }
    });
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentInfo((prevState) => ({
      ...prevState,
      payment: {
        ...prevState.payment,
        method
      }
    }));
  };

  const validateInputs = () => {
    const errorList: string[] = [];

    if (!paymentInfo.deliverTo.trim()) {
        errorList.push('deliverTo');
    }

    if (!paymentInfo.phone.trim()) {
        errorList.push('phone');
    }

    if (!paymentInfo.payment.name.trim()) {
        errorList.push('name');
    }

    // Validación para el número de tarjeta de crédito (debe tener exactamente 16 dígitos)
    if (!/^\d{16}$/.test(paymentInfo.payment.cardNumber)) {
        errorList.push('cardNumber');
    }

    // Validación para la fecha de vencimiento (formato MM/YY y no expirada)
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentInfo.payment.expiry)) {
        errorList.push('expiry');
    } else {
        const [month, year] = paymentInfo.payment.expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (Number(year) < currentYear || (Number(year) === currentYear && Number(month) < currentMonth)) {
            errorList.push('expiry');
        }
    }

    // Validación para el CVV (debe tener 3 o 4 dígitos)
    if (!/^\d{3,4}$/.test(paymentInfo.payment.cvv)) {
        errorList.push('cvv');
    }

    setErrors(errorList);
    return errorList.length === 0;
};



  const handleRequest = () => {
    if (validateInputs()) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0'); 
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const payment = hours + " : " + minutes
      localStorage.setItem('payment', payment);
      localStorage.setItem('paymentInfo',JSON.stringify(paymentInfo))
      localStorage.setItem('openModalPay',JSON.stringify(true))
      navigate('/trackOrder')
    } 
  };

  return (
    <div id='formContainer'>
      <h1 id='title' >Payment</h1>
      <form action="" className={styles.paymentForm}>
        <Input
        errorMsg = 'Deliver adress is Needed'
        width='100%'
          labelTop
          id="deliverTo"
          label="Deliver To"
          type="text"
          valid={!errors.includes('deliverTo')}
          value={paymentInfo.deliverTo}
          onChange={handleInputChange}
        />
         <Input
         errorMsg = 'Phone number Needed'
        width='100%'
          labelTop
          id="phone"
          label="Phone Number"
          type="text"
          valid={!errors.includes('phone')}
          value={paymentInfo.phone}
          onChange={handleInputChange}
        />
        <div id="specialRequestContainer">
        <label htmlFor="specialRequest">Special Request</label>
        <textarea 
          name="anotation"
          id="annotation"
          value={paymentInfo.annotation}
          onChange={(e) => handleInputChange('annotation', e.target.value)}
        ></textarea>
        </div>

        <div className={styles.paymentDiv}>
          <h3>Payment</h3>
          <button className={styles.paymentSelector} type="button" onClick={() => handlePaymentMethodChange('Credit Card')}>
            Credit Card
          </button>
        </div>
        
        <div className={styles.creditCardContainer}>
          <Input
          errorMsg = 'Name is Needed'
            width='70%'
            labelTop
            id="name"
            label="Name"
            type="text"
            valid={!errors.includes('name')}
            value={paymentInfo.payment.name}
            onChange={handleInputChange}
          />

          <Input
          errorMsg = 'Invalid expiry date'
            width='70px'
            numberType
            labelTop
            id="expiry"
            label="Expiry"
            placeholder='MM/YY'
            type="text"
            valid={!errors.includes('expiry')}
            value={paymentInfo.payment.expiry}
            onChange={handleInputChange}
          />
          </div>
          <div className={styles.creditCardContainer}>
          <Input
          errorMsg = 'Invalid number card'
            width='70%'
            labelTop
            id="cardNumber"
            label="Card Number"
            type="text"
            valid={!errors.includes('cardNumber')}
            value={paymentInfo.payment.cardNumber}
            onChange={handleInputChange}
          />

          <Input
          errorMsg = 'Invalid CVV'
            width='70px'
            numberType
            labelTop
            id="cvv"
            label="CVV"
            type="text"
            valid={!errors.includes('cvv')}
            value={paymentInfo.payment.cvv}
            onChange={handleInputChange}
          />
        </div>

        <button onClick={handleRequest} type="button">Request</button>
      </form>
      <button onClick={()=> navigate(previousPage)}>
        Go Back
      </button>
    </div>
  );
}

export default DeliveryPayment;