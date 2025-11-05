// components/ui/input/Input.tsx
import React from 'react'
import { UseFormRegister, FieldValues, Path } from 'react-hook-form'
import s from './input.module.scss'

interface InputProps<T extends FieldValues> {
  label: string
  name: Path<T>
  type?: 'text' | 'email' | 'tel' | 'password'
  register: UseFormRegister<T>
  error?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  validation?: any
}

export const Input = <T extends FieldValues>({
  label,
  name,
  type = 'text',
  register,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  validation = {}
}: InputProps<T>) => {
  return (
    <div className={s.inputWrapper}>
      <label className={s.label}>
        {label}
        {required && <span className={s.required}>*</span>}
      </label>
      <input
        type={type}
        className={`${s.input} ${error ? s.inputError : ''} ${disabled ? s.inputDisabled : ''}`}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name, {
          required: required ? 'Это поле обязательно' : false,
          ...validation
        })}
      />
      {error && <span className={s.error}>{error}</span>}
    </div>
  )
}