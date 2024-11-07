import styles from './inputs.module.css'
import React from 'react';

interface InputsProps {
    labelOnTop?:boolean
    width?:string
    value:string | number
    id: string;
    validInfo: boolean;
    errorMsg?: string | null;
    label?: string;
    type?: string; 
    placeholder?: string;
    needsMarginLeft?:boolean
    min?:number
    onChange: (id: string, value: string) => void;
}

function Input({
    width,
    label = '', 
    type = 'text', 
    validInfo,
    placeholder,
    id,
    value,
    onChange,
    errorMsg,
    needsMarginLeft,
    min
}: InputsProps) {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, e.target.value); 
    };

    const marginLeft = needsMarginLeft ? '8px' : '0px';

    return (
        <div  className={styles.inputContainer}
        style={{
            width: width,
            marginLeft: marginLeft}}>
            {label && (
                <label
                    className={validInfo ? styles.label : styles.errorLabel}
                    htmlFor={id}
                >
                    {validInfo ? label : errorMsg}
                </label>
            )}
            
            <input 
                className={validInfo ? styles.input :  styles.errorInput}
                min= {min}
                value={value}
                onChange={handleInputChange} 
                type={type} 
                id={id} 
                placeholder={placeholder} 
            />
        </div>
    );
}

export default Input;