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
        {/* Mostrar HomePage solo en la ruta "/" */}
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

  if (location.pathname !== "/") {
    return null; 
  }

  return (
    <nav >
      <h1 id='title'>Restaurant Name</h1>
      <ul id='homeNav'>
        <Link  className='homeLink' id='cartBtn' to="/cart"><CartSvg/></Link>
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