import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Booking from './Booking';
import Deals from './Deals';
import Delivery from './Delivery';
import TrackOrder from './TrackOrder';
import {BookingSvg, DealsSvg,TrackOrderSvg,DeliverySvg, CartSvg} from './components/Svgs';

import DeliveryOrder from './DeliveyOrder';
import DeliveryPayment from './DeliveryPayment';
import Cart from './Cart';

function App() {
  return (
    <Router>
      <Navigation />
      
      <Routes>
        <Route path="/booking" element={<Booking />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/trackorder" element={<TrackOrder />} />
        <Route path="/deliveryOrder" element={<DeliveryOrder />} />
        <Route path="/deliveryPayment" element={<DeliveryPayment />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

function Navigation() {
  const location = useLocation();

  if (location.pathname !== "/Reservation-App/") {
    return null; 
  }
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]') as any[];
  return (
    <nav id='homeContainer' >
      <div id='titleCartContainer'>
        <h1 id='restaurantName'>Restaurant Name</h1>
        <div id='cartBtn' >
          <Link  className='homeLink' to="/cart"><CartSvg/><p id='cartNumber'>{cartItems.length}</p></Link>
        </div>
      </div>
      <ul id='homeNav'>
        <div className='linkContainer'>
          <Link  className='homeLink' to="/booking"><BookingSvg /><h2>Booking</h2></Link>
          <Link  className='homeLink' to="/deals"><DealsSvg/> <h2>Deals</h2></Link>
        </div>
        <div className='linkContainer'>
          <Link  className='homeLink' to="/delivery"><DeliverySvg /> <h2>Delivery</h2></Link>
          <Link  className='homeLink' to="/trackorder"><TrackOrderSvg/> <h2>Track Order</h2></Link>
        </div>
      </ul>
    </nav>
  );
}

export default App;