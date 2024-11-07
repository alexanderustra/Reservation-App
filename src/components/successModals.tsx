import { useState } from 'react';
import styles from './modal.module.css'
interface ModalProps {
    msg:string
    open:boolean
    onClick:() => void;
}
type BookingInfo = {
    date: string;
    time: { start: string; end: string };
    seats: { adults: string; kids: string };
    specialRequest: string;
    name: string;
    phone: string;
    id: number;
  };
type ReservationProps = {
    bookingInfo: BookingInfo
    handleCancel:()=>void
}
export const SuccessModal = ({ msg, open, onClick }: ModalProps) => {
    const [userClosed, setUserClosed] = useState(false);

    const modalClass = `${open ? styles.modalIn : styles.modalClosed} ${userClosed ? styles.modalOut : ''}`;

    return (
        <div className={modalClass}>
            <h2>{msg}</h2>
            <button
                onClick={() => {
                    onClick();
                    setUserClosed(true);
                }}
            >
                Close
            </button>
        </div>
    );
};

export const ReservationConfirmed = ({ bookingInfo,handleCancel  }:ReservationProps) => (
    <div className={styles.reservationModal}>
      <h2>Your reservation is confirmed!</h2>
      <p>
        We have reserved a table for {bookingInfo.seats.adults} adults and {bookingInfo.seats.kids} kids on{' '}
        {bookingInfo.date} from {bookingInfo.time.start} to {bookingInfo.time.end}. We look forward to seeing you soon!
      </p>
      <button onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
    </div>
  );