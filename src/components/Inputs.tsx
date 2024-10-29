import styles from './inputs.module.css'
import React, { useState } from 'react';

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
    errorMsg
}: InputsProps) {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, e.target.value); 
    };

    return (
        <div  className={labelTop ? styles.inputTop : styles.input}>
            {label && <label className={labelTop ? styles.labelTop : styles.label} htmlFor={id}
            style={valid ? {color:'#FFFFFF'} : {color:'#A30000'}}
            > { valid ? label : errorMsg}
            </label>}
            
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


interface SelectProps {
    label?:string
    placeholder?: string;
    onSelect?: (value: string) => void;
    children: React.ReactNode;
}



function Select({ placeholder, onSelect, children , label}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(placeholder);

    const handleOptionClick = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
        if (onSelect) {
            onSelect(value);
        }
    };

    return (
        <div className={styles.selectContainer}>
            {label && (
                <p className={styles.label}>{label}</p>
            )}
            <div className={styles.select} role="listbox" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
                <p>{selectedValue || placeholder || ''}</p>
                {isOpen && (
                    <ul>
                        {React.Children.map(children, (child) => {
                            const option = child as React.ReactElement;
                            return (
                                <li key={option.props.value} onClick={() => handleOptionClick(option.props.value)}>
                                    {option.props.children}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
    
}
export default Input;
export { Select };