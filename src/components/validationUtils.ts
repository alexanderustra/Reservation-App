// VALIDATE BOOKING
export type ErrorList = {
    name?: string;
    date?: string;
    phone?: string;
    start?: string;
    end?: string;
    adults?: string;
    [key: string]: string | undefined;
  };
  
  export function validateBookingInputs(
    bookingInfo: {
      date: string;
      time: { start: string; end: string };
      seats: { adults: string; kids: string };
      name: string;
      phone: string;
    },
    setErrors: React.Dispatch<React.SetStateAction<ErrorList>>
  ): boolean {
    const errorList: ErrorList = {};
  
    function timeToMinutes(time: string) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
  
    const MIN_TIME = timeToMinutes("08:00");
    const MAX_TIME = timeToMinutes("23:00");
  
    function isValidTime(time: string) {
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
  }

// VAliDATE PAYMENT
type PaymentInfo = {
    deliverTo: string;
    phone: string;
    payment: {
      name: string;
      cardNumber: string;
      expiry: string;
      cvv: string;
    };
  };

  export const validatePaymentInputs = (paymentInfo: PaymentInfo): string[] => {
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
  
    if (!/^\d{16}$/.test(paymentInfo.payment.cardNumber)) {
      errorList.push('cardNumber');
    }
  
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
  
    if (!/^\d{3,4}$/.test(paymentInfo.payment.cvv)) {
      errorList.push('cvv');
    }
  
    return errorList;
  };