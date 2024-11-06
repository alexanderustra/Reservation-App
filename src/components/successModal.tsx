import styles from './modal.module.css'
interface ModalProps {
    msg:string
    open:boolean
    onClick:() => void;
}

export const SuccessModal = ({msg,open,onClick}:ModalProps)=>{
    return (
        <div className={open ? styles.modalIn : styles.modalOut}>
            <h2>{msg}</h2>
            <button onClick={onClick}>Close</button>
        </div>
    )
}