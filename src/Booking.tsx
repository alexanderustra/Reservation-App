import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Input, { Select } from './components/Inputs';
import style from './booking.module.css';

const generateRandomId = () => {
  return Math.floor(10000 + Math.random() * 90000); 
};

function Booking() {
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [bookingInfo, setBookingInfo] = useState({
    date: '',
    time: {
      start: '',
      end: '',
    },
    seats: {
      adults: '',
      kids: '',
    },
    specialRequest: '',
    name: '',
    email: '',
    id: generateRandomId()
  });

  const ReservationConfirmed = ({ bookingInfo }: { bookingInfo: any }) => {
    return (
      <div className={style.reservationModal}>
        <h2>Your reservation is confirmed!</h2>
        <p>{bookingInfo.name}</p>
        <p>We have reserved a table for {bookingInfo.seats.adults} adults and {bookingInfo.seats.kids} kids on {bookingInfo.date} from {bookingInfo.time.start} to {bookingInfo.time.end}. We look forward to seeing you soon!</p>
        <p>Id: {bookingInfo.id}</p>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    );
  };

  useEffect(() => {
    const bookingData = localStorage.getItem('bookingInfo');
  
    if (bookingData) {
      try {
        const parsedBookingInfo = JSON.parse(bookingData); 
        setBookingInfo(parsedBookingInfo); 
        setConfirmed(true);
      } catch (error) {
        console.error("Error parsing booking info:", error);
      }
    }
  }, []);
  
  const handleInputChange = (id: string, value: string | number) => {
    setBookingInfo((prevState) => {
      if (id === 'start' || id === 'end') {
        console.log(value)
        return {
          ...prevState,
          time: {
            ...prevState.time,
            [id]: Number(value), 
          },
        };
      } else if (id === 'adults' || id === 'kids') {
        return {
          ...prevState,
          seats: {
            ...prevState.seats,
            [id]: Number(value),
          },
        };
      } else {
        return {
          ...prevState,
          [id]: value,
        };
      }
    });
  };

  const validateInputs = () => {
    const errorList: string[] = [];
    
    if (!bookingInfo.date) errorList.push('Date is required.');
    if (!bookingInfo.time.start) errorList.push('Start time is required.');
    if (!bookingInfo.time.end) errorList.push('End time is required.');
    if (!bookingInfo.seats.adults) errorList.push('At least one adult is required.');
    
    if (Number(bookingInfo.time.start) >= Number(bookingInfo.time.end)) {
        errorList.push('Start time must be earlier than end time.');
    }

    setErrors(errorList);
    
    return errorList.length === 0;
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateInputs()) {
        console.log('Booking Information:', bookingInfo);
        localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
        setConfirmed(true);
    } else {
        console.log('Errors:', errors);
    }
};


  const handleCancel = ()=>{
    localStorage.removeItem('bookingInfo'); 
    setBookingInfo({date: '',
      time: {
        start: '',
        end: '',
      },
      seats: {
        adults: '',
        kids: '',
      },
      specialRequest: '',
      name: '',
      email: '',
      id: generateRandomId()}); 
    setConfirmed(false);  
  }

  return (
    <div>
      <h1>Booking Page</h1>
      {errors.length > 0 && (
        <div>
          {errors.map((error, index) => (
            <p key={index} style={{ color: 'red' }}>{error}</p>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} 
        style={{ 
          display: confirmed ? "none" : "flex"
        }}
        className={style.form} >
        
        <Input
          errorMsg='A name is needed'
          labelTop
          width="170px"
          id='name'
          label='Name'
          type='text'
          valid={bookingInfo.name !== '' && bookingInfo.name.length > 5}
          value={bookingInfo.name}
          onChange={handleInputChange}
        />
        <Input
          labelTop
          width="230px"
          id='email'
          label='Email'
          type='email'
          valid={true}
          value={bookingInfo.email}
          onChange={handleInputChange}
        />
        <Input
          labelTop
          width='100px'
          id='date'
          label='Date'
          type='text'
          valid={true}
          value={bookingInfo.date}
          onChange={handleInputChange}
        />
        <label htmlFor="start">Time</label>
        <Input
          id='start'
          label='Start'
          type='number'
          valid={true}
          value={bookingInfo.time.start}
          onChange={handleInputChange}
        />
        <Input
          id='end'
          label='End'
          type='number'
          valid={true}
          value={bookingInfo.time.end}
          onChange={handleInputChange}
        />

        <p>Seats</p>
        <Input
          id='adults'
          label='Adults'
          type='number'
          valid={true}
          value={bookingInfo.seats.adults}
          onChange={handleInputChange}
        />

        <Input
          id='kids'
          label='Kids'
          type='number'
          valid={true}
          value={bookingInfo.seats.kids}
          onChange={handleInputChange}
        />

        <label htmlFor="specialRequest">Special Request</label>
        <textarea
          id="specialRequest"
          value={bookingInfo.specialRequest}
          onChange={(e) => handleInputChange('specialRequest', e.target.value)}
        ></textarea>

        <button type="button" onClick={handleSubmit}>Request</button>
      </form>
      {confirmed && <ReservationConfirmed bookingInfo={bookingInfo} />}
      <Link to="/">
        <button>Home</button>
      </Link>
    </div>
  );
}

export default Booking;
