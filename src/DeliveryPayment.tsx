import { useEffect, useState } from 'react';
import Input from './components/Inputs';
import { useNavigate, useLocation } from 'react-router-dom';
import { validatePaymentInputs } from './components/validationUtils';
import styles from './deliveryForm.module.css'


/*
interface OrderItem {
  name: string;
  cuantity: number;
  price: number | string;
  isDessert: boolean;
  ingredients: string[];
  discount: number;
}
*/
type PaymentInfo = {
  payment: {
    expiry: string;
    cvv: string;
    name: string;
    [key: string]: string | number;
  };
  [key: string]: any;
};

function DeliveryPayment() {
  const location = useLocation();
  const previousPage = location.state?.from;
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    deliverTo: '',
    phone: '',
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

  // Para conseguir el precio de la órden.
  // No es necesario pero lo quería agregar.
  /*
  useEffect(() => {
    let order: OrderItem[] = [];
    const orderMethod = localStorage.getItem('orderMethod');

    if (orderMethod === 'fromDeliveryOrder') {
      const finalOrder = localStorage.getItem('finalOrder');
      order = finalOrder ? JSON.parse(finalOrder) : [];
    }

    if (orderMethod === 'fromCart') {
      const cart = localStorage.getItem('cart');
      order = cart ? JSON.parse(cart) : [];

      const calculateTotalPrice = (orderItems: OrderItem[]): number => {
        return orderItems.reduce((total, item) => {
          const itemPrice = parseFloat(item.price as string) * item.cuantity;
          return total + itemPrice;
        }, 0);
      };

      const total = calculateTotalPrice(order);
    }
  }, []);
  */

  const handleInputChange = (id: string, value: string | number) => {
    let newValue = value.toString();
    setPaymentInfo(({prevState}:PaymentInfo) => {

      if (id === "expiry") {
        let formattedExpiry = value.toString().replace(/\D/g, '');

        if (formattedExpiry.length > 2) {
          formattedExpiry = formattedExpiry.slice(0, 2) + '/' + formattedExpiry.slice(2, 4);
        }
        
        if (formattedExpiry.length > 5) {
          formattedExpiry = formattedExpiry.slice(0, 5); 
        }

        return {
          ...prevState,
          payment: {
            ...prevState.payment,
            expiry: formattedExpiry
          }
        };
      }
      if (id === "cvv") {
     
        if (/^\d{0,3}$/.test(newValue)) {
          return {
            ...prevState,
            payment: {
              ...prevState.payment,
              [id]: value
            }
          };
        } else {
          return prevState; 
        }
      } else if (id === "name") {
   
        if (/^[a-zA-Z\s]*$/.test(newValue)) {
          return {
            ...prevState,
            payment: {
              ...prevState.payment,
              [id]: value
            }
          };
        } else {
          return prevState; 
        }
      }
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

  const handleRequest = () => {
    const errorList = validatePaymentInputs(paymentInfo);
    setErrors(errorList);

    if (errorList.length === 0) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const payment = hours + " : " + minutes;
      localStorage.setItem('payment', payment);
      localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
      localStorage.setItem('openModalPay', JSON.stringify(true));
      navigate('/trackOrder');
    }
  };

  return (
    <div id='formContainer'>
      <h1 id='title'>Payment</h1>
      <form action="" className={styles.paymentForm}>
        <Input
          errorMsg='Deliver address is needed'
          width='100%'
          id="deliverTo"
          label="Deliver To"
          type="text"
          validInfo={!errors.includes('deliverTo')}
          value={paymentInfo.deliverTo}
          onChange={handleInputChange}
        />
        <Input
          errorMsg='Phone number needed'
          width='100%'
          id="phone"
          label="Phone Number"
          type="number"
          validInfo={!errors.includes('phone')}
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
            errorMsg='Name is needed'
            width='70%'
            id="name"
            label="Name"
            type="text"
            validInfo={!errors.includes('name')}
            value={paymentInfo.payment.name}
            onChange={handleInputChange}
          />

          <Input
            errorMsg='Invalid expiry date'
            width='70px'
            needsMarginLeft
            id="expiry"
            label="Expiry"
            placeholder='MM/YY'
            type="text"
            validInfo={!errors.includes('expiry')}
            value={paymentInfo.payment.expiry}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.creditCardContainer}>
          <Input
            errorMsg='Invalid number card'
            width='70%'
            id="cardNumber"
            label="Card Number"
            type="number"
            validInfo={!errors.includes('cardNumber')}
            value={paymentInfo.payment.cardNumber}
            onChange={handleInputChange}
          />

          <Input
            errorMsg='Invalid CVV'
            width='70px'
            needsMarginLeft
            id="cvv"
            label="CVV"
            type="number"
            validInfo={!errors.includes('cvv')}
            value={paymentInfo.payment.cvv}
            onChange={handleInputChange}
          />
        </div>

        <button onClick={handleRequest} type="button">Request</button>
      </form>
      <button onClick={() => navigate(previousPage)}>
        Go Back
      </button>
    </div>
  );
}

export default DeliveryPayment;