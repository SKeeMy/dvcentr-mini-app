import React from 'react'
import s from './button-stats.module.scss'
import clsx from 'clsx'
export const ButtonStats = ({ setStatsShow, type }: { setStatsShow: (value: boolean) => void, type: 'start' | 'end' }) => {
  return (
    <button onClick={() => setStatsShow(true)} className={clsx(s.button, type === 'end' && s.end)}>Рейтинг 🏆</button>
  )
}
