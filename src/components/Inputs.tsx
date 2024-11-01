import styles from './inputs.module.css'
import React from 'react';

interface InputsProps {
    labelTop?:boolean
    width?:string
    value:string | number
    id: string;
    valid: boolean;
    errorMsg?:string;
    label?: string;
    type?: string; 
    placeholder?: string;
    numberType?:boolean
    onChange: (id: string, value: string) => void;
}

function Input({
    labelTop,
    width,
    label = '', 
    type = 'text', 
    valid,
    placeholder,
    id,
    value,
    onChange,
    errorMsg,
    numberType,
}: InputsProps) {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, e.target.value); 
    };

    return (
        <div  className={labelTop ? styles.inputTop : styles.input}>
            {label && (
                <label
                    className={labelTop ? styles.labelTop : styles.label}
                    htmlFor={id}
                    style={{
                        color: valid ? '#FFFFFF' : '#A30000',
                        paddingLeft: numberType ? '10px' : '0px',
                    }}
                >
                    {valid ? label : errorMsg}
                </label>
            )}
            
            <input 
                style={{ 
                    backgroundColor: valid ? "#000000" : "#530909",
                    width: width
                }} 
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