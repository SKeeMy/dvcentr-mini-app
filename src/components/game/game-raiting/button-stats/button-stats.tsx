import React from 'react'
import s from './button-stats.module.scss'
import clsx from 'clsx'
import { useGameStore } from '@/store/game-store'
import { useAuthStore } from '@/store/auth-store'
export const ButtonStats = ({ setStatsShow, type }: { setStatsShow: (value: boolean) => void, type: 'start' | 'end' }) => {
  const { setShowRaiting, getRaiting  } = useGameStore()
  const { user} = useAuthStore()

  const handleCheckRaiting = async () => {
    setShowRaiting(true)
    if (user?.phone) {
     const res =  await getRaiting('')
    }
  }


  return (
    <button onClick={handleCheckRaiting} className={clsx(s.button, type === 'end' && s.end)}>Рейтинг 🏆</button>
  )
}
