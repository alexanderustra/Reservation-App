import styles from './inputs.module.css'
import React from 'react';

interface InputsProps {
    labelTop?:boolean
    width?:string
    value:string | number
    id: string;
    valid: boolean;
    errorMsg?: string | null;
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
        <div  className={labelTop ? styles.inputTop : styles.input}
        style={{
            width: width,
            marginLeft: numberType ? '8px' : '0px',
            marginRight: numberType ? '8px' : '0px',}}>
            {label && (
                <label
                    className={labelTop ? styles.labelTop : styles.label}
                    htmlFor={id}
                    style={{
                        color: valid ? '#FFFFFF' : '#A30000',
                        marginLeft: numberType ? '8px' : '0px',
                    }}
                >
                    {valid ? label : errorMsg}
                </label>
            )}
            
            <input 
                style={{ 
                    backgroundColor: valid ? "#000000" : "#530909",
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