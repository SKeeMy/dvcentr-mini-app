import React from 'react'
import { UseFormRegister, FieldValues, Path } from 'react-hook-form'
import s from './checkbox.module.scss'

interface CustomCheckboxProps<T extends FieldValues> {
  label: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: string
  required?: boolean
}

export const Checkbox = <T extends FieldValues>({
  label,
  name,
  register,
  error,
  required = false
}: CustomCheckboxProps<T>) => {
  return (
    <div className={s.checkboxWrapper}>
      <label className={s.checkboxLabel}>
        <input
          type="checkbox"
          className={s.checkbox}
          {...register(name, {
            required: required ? 'Это поле обязательно' : false
          })}
        />
        <span className={s.checkmark}></span>
        <span dangerouslySetInnerHTML={{__html: label}} className={s.checkboxText}></span>
      </label>
      {error && <span className={s.error}>{error}</span>}
    </div>
  )
}