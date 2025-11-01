import React from 'react'
import clsx from 'clsx'
import s from './count-icon.module.scss'
export const CountIcon = ({ value, className }: { value: number, className?: string }) => {
  return (
    <span className={clsx(s.count, className)}>{value}</span>
  )
}
