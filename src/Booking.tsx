import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from './components/Inputs';
import style from './booking.module.css';

const generateRandomId = () => Math.floor(10000 + Math.random() * 90000);

function Booking() {
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [bookingInfo, setBookingInfo] = useState({
    date: '',
    time: { start: '', end: '' },
    seats: { adults: '', kids: '' },
    specialRequest: '',
    name: '',
    phone: '',
    id: generateRandomId(),
  });

  const ReservationConfirmed = ({ bookingInfo }: { bookingInfo: any }) => (
    <div className={style.reservationModal}>
      <h2>Your reservation is confirmed!</h2>
      <p>
        We have reserved a table for {bookingInfo.seats.adults} adults and {bookingInfo.seats.kids} kids on{' '}
        {bookingInfo.date} from {bookingInfo.time.start} to {bookingInfo.time.end}. We look forward to seeing you soon!
      </p>
      <button onClick={handleCancel} className={style.cancelBtn}>Cancel</button>
    </div>
  );

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
        return { ...prevState, time: { ...prevState.time, [id]: value } };
      } else if (id === 'adults' || id === 'kids') {
        return { ...prevState, seats: { ...prevState.seats, [id]: value } };
      } else {
        return { ...prevState, [id]: value };
      }
    });
  };

  const validateInputs = () => {
    const errorList: string[] = [];
    if (!bookingInfo.name) errorList.push('name');
    if (!bookingInfo.date) errorList.push('date');
    if (!bookingInfo.phone) errorList.push('phone');
    if (!bookingInfo.time.start) errorList.push('start');
    if (!bookingInfo.time.end) errorList.push('end');
    if (!bookingInfo.seats.adults) errorList.push('adults');
    if (Number(bookingInfo.time.start) >= Number(bookingInfo.time.end)) errorList.push('start');

    setErrors(errorList);
    return errorList.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateInputs()) {
      localStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
      setConfirmed(true);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('bookingInfo');
    setBookingInfo({
      date: '',
      time: { start: '', end: '' },
      seats: { adults: '', kids: '' },
      specialRequest: '',
      name: '',
      phone: '',
      id: generateRandomId(),
    });
    setConfirmed(false);
  };

  return (
    <div id="formContainer">
      <h1 id="title">Booking Page</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: confirmed ? 'none' : 'flex' }}
        className={style.form}
      >
        <Input
          errorMsg="A name is needed"
          labelTop
          width="95%"
          id="name"
          label="Name"
          type="text"
          valid={!errors.includes('name')}
          value={bookingInfo.name}
          onChange={handleInputChange}
        />
        <Input
          errorMsg="Need phone number"
          labelTop
          width="95%"
          id="phone"
          label="Phone"
          type="text"
          valid={!errors.includes('phone')}
          value={bookingInfo.phone}
          onChange={handleInputChange}
        />
        <div className={style.timeContainer}>
          <Input
            errorMsg="Select a valid Date"
            labelTop
            width="165px"
            id="date"
            label="Date"
            type="text"
            placeholder="mm/dd"
            valid={!errors.includes('date')}
            value={bookingInfo.date}
            onChange={handleInputChange}
          />
          <Input
            errorMsg="Select a valid Start Time"
            numberType
            labelTop
            width="55px"
            id="start"
            label="Time"
            placeholder="Start"
            type="number"
            valid={!errors.includes('start')}
            value={bookingInfo.time.start}
            onChange={handleInputChange}
          />
          <Input
            errorMsg="Select a valid End Time"
            labelTop
            label="End"
            width="55px"
            id="end"
            placeholder="End"
            type="number"
            valid={!errors.includes('end')}
            value={bookingInfo.time.end}
            onChange={handleInputChange}
          />
        </div>

        <div className={style.seatsContainer}>
          <Input
            errorMsg="At least one Adult"
            labelTop
            width="55px"
            id="adults"
            label="Seats"
            placeholder="Adults"
            type="number"
            valid={!errors.includes('adults')}
            value={bookingInfo.seats.adults}
            onChange={handleInputChange}
          />
          <Input
            labelTop
            width="55px"
            id="kids"
            label="Kids"
            placeholder="Kids"
            type="number"
            valid={!errors.includes('kids')}
            value={bookingInfo.seats.kids}
            onChange={handleInputChange}
          />
        </div>

        <div id="specialRequestContainer">
          <label htmlFor="specialRequest">Special Request</label>
          <textarea
            id="specialRequest"
            value={bookingInfo.specialRequest}
            onChange={(e) => handleInputChange('specialRequest', e.target.value)}
          ></textarea>
        </div>

        <button type="button" onClick={handleSubmit}>
          Request
        </button>
      </form>
      {confirmed && <ReservationConfirmed bookingInfo={bookingInfo} />}
      <Link to="/Reservation-App/">
        <button id='homeBtn'>Home</button>
      </Link>
    </div>
  );
}

export default Booking;
