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
    annotation: '',
    payment: {
      method: 'Credit Card',
      name: '',
      expiry: '',
      cardNumber: '',
      cvv: ''
    }
  });

  const [errors, setErrors] = useState({
    deliverTo: '',
    annotation: '',
    name: '',
    expiry: '',
    cardNumber: '',
    cvv: ''
  });
  
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

  const validateForm = () => {
    const newErrors = { deliverTo: '', annotation: '', name: '', expiry: '', cardNumber: '', cvv: '' };
    let valid = true;

    if (!paymentInfo.deliverTo.trim()) {
      newErrors.deliverTo = 'Delivery address is required';
      valid = false;
    }
    if (!paymentInfo.annotation.trim()) {
      newErrors.annotation = 'Annotation is required';
      valid = false;
    }
    if (!paymentInfo.payment.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!/^\d{16}$/.test(paymentInfo.payment.cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
      valid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentInfo.payment.expiry)) {
      newErrors.expiry = 'Expiry must be in MM/YY format';
      valid = false;
    } else {
      const [month, year] = paymentInfo.payment.expiry.split('/');
      const currentYear = new Date().getFullYear() % 100; 
      const currentMonth = new Date().getMonth() + 1;
      if (Number(year) < currentYear || (Number(year) === currentYear && Number(month) < currentMonth)) {
        newErrors.expiry = 'Card is expired';
        valid = false;
      }
    }

    if (!/^\d{3,4}$/.test(paymentInfo.payment.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRequest = () => {
    if (validateForm()) {
      console.log(paymentInfo);
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0'); 
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const payment = hours + " : " + minutes
      localStorage.setItem('payment', payment);
      navigate('/trackOrder')
    } 
  };

  return (
    <div>
      <h1>Payment</h1>
      <form action="" className={styles.paymentForm}>
        <Input
        width='240px'
          labelTop
          id="deliverTo"
          label="Deliver To"
          type="text"
          valid={!errors.deliverTo}
          value={paymentInfo.deliverTo}
          onChange={handleInputChange}
        />
        {errors.deliverTo && <p style={{ color: 'red' }}>{errors.deliverTo}</p>}
        
        <Input
        width='290px'
          labelTop
          id="annotation"
          label="Annotation"
          type="text"
          valid={!errors.annotation}
          value={paymentInfo.annotation}
          onChange={handleInputChange}
        />
        {errors.annotation && <p style={{ color: 'red' }}>{errors.annotation}</p>}

        <div className={styles.paymentDiv}>
          <h3>Payment</h3>
          <button type="button" onClick={() => handlePaymentMethodChange('Credit Card')}>
            Credit Card
          </button>
        </div>
        
        <div className={styles.creditCardContainer}>
          <Input
            width='205px'
            labelTop
            id="name"
            label="Name"
            type="text"
            valid={!errors.name}
            value={paymentInfo.payment.name}
            onChange={handleInputChange}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}

          <Input
          width='70px'
            labelTop
            id="expiry"
            label="Expiry"
            placeholder='MM/YY'
            type="text"
            valid={!errors.expiry}
            value={paymentInfo.payment.expiry}
            onChange={handleInputChange}
          />
          {errors.expiry && <p style={{ color: 'red' }}>{errors.expiry}</p>}

          <Input
            width='205px'
            labelTop
            id="cardNumber"
            label="Card Number"
            type="text"
            valid={!errors.cardNumber}
            value={paymentInfo.payment.cardNumber}
            onChange={handleInputChange}
          />
          {errors.cardNumber && <p style={{ color: 'red' }}>{errors.cardNumber}</p>}

          <Input
          width='70px'
            labelTop
            id="cvv"
            label="CVV"
            type="text"
            valid={!errors.cvv}
            value={paymentInfo.payment.cvv}
            onChange={handleInputChange}
          />
          {errors.cvv && <p style={{ color: 'red' }}>{errors.cvv}</p>}
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