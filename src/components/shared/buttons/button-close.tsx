import React, { FC } from 'react'
import { IButtonCloseProps } from './button-close.interface'
import clsx from 'clsx'
import s from './button-close.module.scss'

export const ButtonClose: FC<IButtonCloseProps> = ({children, className, onClose, ...rest}) => {
  return (
    <button onClick={onClose} className={clsx(s.button, className)}>
      {children}
    </button>
  )
}
