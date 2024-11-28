import React, { ReactNode } from 'react';
import styles from '../../styles/form.module.scss';

// Interfaces for Form component properties
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  className?: string;
}

interface FormFieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

interface FormRadioGroupProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

interface FormSelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

const Form: React.FC<FormProps> & {
  Field: React.FC<FormFieldProps>;
  Input: React.FC<FormInputProps>;
  RadioGroup: React.FC<FormRadioGroupProps>;
  Select: React.FC<FormSelectProps>;
  Actions: React.FC<{ children: ReactNode }>;
} = ({ children, className = '', ...props }) => {
  return (
    <form className={`${styles['form-container']} ${className}`} {...props}>
      {children}
    </form>
  );
};

// Field Subcomponent
Form.Field = ({ label, error, children, className = '' }) => (
  <div className={`${styles['form-field']} ${className}`}>
    {label && <label className={styles['form-label']}>{label}</label>}
    {children}
    {error && <span className={styles['form-error']}>{error}</span>}
  </div>
);

// Input Subcomponent
Form.Input = ({ error, className = '', ...inputProps }) => (
  <input
    className={`${styles['form-input']} ${error ? styles['form-input-error'] : ''} ${className}`}
    {...inputProps}
  />
);

// RadioGroup Subcomponent
Form.RadioGroup = ({ options, value, onChange, error }) => (
  <div className={styles['form-radio-group']}>
    {options.map((option) => (
      <label key={option.value} className={styles['form-radio-label']}>
        <input
          type="radio"
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange?.(option.value)}
          className={styles['form-radio-input']}
        />
        {option.label}
      </label>
    ))}
    {error && <span className={styles['form-error']}>{error}</span>}
  </div>
);

// Select Subcomponent
Form.Select = ({ options, value, onChange, error, className = '', ...props }: FormSelectProps) => (
  <div className={`${styles['form-field']} ${className}`}>
    <select
      value={value || ''}  
      onChange={(e) => onChange?.(e.target.value)} 
      className={`${styles['form-select-input']} ${error ? styles['form-select-error'] : ''}`}
      {...props}
    >
      <option value="" disabled>
        Select an option
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <span className={styles['form-error']}>{error}</span>}
  </div>
);



// Actions Subcomponent
Form.Actions = ({ children }) => (
  <div className={styles['form-actions']}>
    {children}
  </div>
);

export default Form;
