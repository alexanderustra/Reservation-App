import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from './components/Inputs';
import style from './booking.module.css';
import { ReservationConfirmed } from './components/successModals';

type ErrorList = {
  name?: string;
  date?: string;
  phone?: string;
  start?: string;
  end?: string;
  adults?: string;
  [key: string]: string | undefined;
};
const generateRandomId = () => Math.floor(10000 + Math.random() * 90000);

function Booking() {
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<ErrorList>({}); 
  const [bookingInfo, setBookingInfo] = useState({
    date: '',
    time: { start: '', end: '' },
    seats: { adults: '', kids: '' },
    specialRequest: '',
    name: '',
    phone: '',
    id: generateRandomId(),
  });

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
    const errorList: ErrorList = {};

    function timeToMinutes(time:any) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
    const MIN_TIME = timeToMinutes("08:00"); 
    const MAX_TIME = timeToMinutes("23:00"); 

    function isValidTime(time:any) {
        const timeInMinutes = timeToMinutes(time);
        return timeInMinutes >= MIN_TIME && timeInMinutes <= MAX_TIME;
    }
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; 
    const currentHours = today.getHours();
    const currentMinutes = today.getMinutes();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    if (!bookingInfo.name) errorList['name'] = 'A name is required.';
    if (!bookingInfo.date) errorList['date'] = 'Please select a date.';
    if (!bookingInfo.phone) errorList['phone'] = 'Phone number is required.';
    if (!bookingInfo.seats.adults) errorList['adults'] = 'Please specify the number of adults.';

    if ((Number(bookingInfo.seats.adults) + Number(bookingInfo.seats.kids)) > 12) {
        errorList['adults'] = 'Total seats cannot exceed 10.';
    }

    if (!bookingInfo.time.start) {
        errorList['start'] = 'Start time is required.';
    } else if (!isValidTime(bookingInfo.time.start)) {
        errorList['start'] = 'Start time must be between 8:00 AM and 11:00 PM.';
    }

    if (!bookingInfo.time.end) {
        errorList['end'] = 'End time is required.';
    } else if (!isValidTime(bookingInfo.time.end)) {
        errorList['end'] = 'End time must be between 8:00 AM and 11:00 PM.';
    }

    if (
        bookingInfo.time.start &&
        bookingInfo.time.end &&
        timeToMinutes(bookingInfo.time.start) >= timeToMinutes(bookingInfo.time.end)
    ) {
        errorList['start'] = 'Start time must be earlier than end time.';
        errorList['end'] = 'End time must be later than start time.';
    }

    if (
      bookingInfo.time.start &&
      bookingInfo.time.end &&
      timeToMinutes(bookingInfo.time.end) - timeToMinutes(bookingInfo.time.start) < 30
    ) {
      errorList['end'] = 'End time must be at least 30 minutes after the start time.';
    }

    if (bookingInfo.date < todayString) {
      errorList['date'] = 'The date must be in the future.';
  } else if (bookingInfo.date === todayString) {
      const startTimeInMinutes = timeToMinutes(bookingInfo.time.start);
      if (startTimeInMinutes <= currentTimeInMinutes) {
          errorList['start'] = 'Start time must be in the future.';
      }
  }

    setErrors(errorList);
    return Object.keys(errorList).length === 0;
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
          errorMsg={errors['name'] || null} 
          labelOnTop
          width="100%"
          id="name"
          label="Name"
          type="text"
          validInfo={!errors['name']}
          value={bookingInfo.name}
          onChange={handleInputChange}
        />
        <Input
          errorMsg={errors['phone'] || null}
          labelOnTop
          width="100%"
          id="phone"
          label="Phone"
          type="number"
          validInfo={!errors['phone']}
          value={bookingInfo.phone}
          onChange={handleInputChange}
        />
        <div className={style.timeContainer}>
          <Input
            errorMsg={errors['date'] || null}
            labelOnTop
            width="165px"
            id="date"
            label="Date"
            type="date" 
            placeholder="dd/mm"
            validInfo={!errors['date']}
            value={bookingInfo.date}
            onChange={handleInputChange}
          />
          <Input
            errorMsg={errors['start'] || null}
            needsMarginLeft
            labelOnTop
            width="80px"
            id="start"
            label="Time"
            placeholder="Start"
            type="time"
            validInfo={!errors['start']}
            value={bookingInfo.time.start}
            onChange={handleInputChange}
          />
          <Input
            errorMsg={errors['end'] || null}
            labelOnTop
            needsMarginLeft
            label="End"
            width="80px"
            id="end"
            placeholder="End"
            type="time"
            validInfo={!errors['end']}
            value={bookingInfo.time.end}
            onChange={handleInputChange}
          />
        </div>

        <div className={style.seatsContainer}>
          <Input
            errorMsg={errors['adults'] || null}
            labelOnTop
            width="80px"
            id="adults"
            label="Seats"
            placeholder="Adults"
            type="number"
            validInfo={!errors['adults']}
            value={bookingInfo.seats.adults}
            onChange={handleInputChange}
          />
          <Input
          errorMsg={errors['kids'] || null}
            needsMarginLeft
            labelOnTop
            width="80px"
            id="kids"
            label="Kids"
            placeholder="Kids"
            type="number"
            validInfo={!errors['kids']}
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
      {confirmed && <ReservationConfirmed bookingInfo={bookingInfo} handleCancel={handleCancel}/>}
      <Link to="/Reservation-App/">
        <button id='homeBtn'>Home</button>
      </Link>
    </div>
  );
}

export default Booking;