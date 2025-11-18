import { Close } from '@/components/shared/icons/close'
import clsx from 'clsx'
import React from 'react'
import s from './raiting-modal.module.scss'

interface Player {
  id: number
  name: string
  score: number
  position: number
}

export const RaitingModal = ({isStatsShow, setStatsShow}: {isStatsShow: boolean, setStatsShow: (value: boolean) => void}) => {
  const players: Player[] = [
    { id: 1, name: "Беляев6636", score: 125, position: 1 },
    { id: 2, name: "Иванов123", score: 110, position: 2 },
    { id: 3, name: "Петров456", score: 95, position: 3 },

  ]

  const getMedal = (position: number) => {
    switch (position) {
      case 1: return "🥇"
      case 2: return "🥈" 
      case 3: return "🥉"
      default: return "🎖️"
    }
  }

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return "#FFD700" // золотой
      case 2: return "#C0C0C0" // серебряный
      case 3: return "#CD7F32" // бронзовый
      default: return "#FFFFFF" // белый
    }
  }

  const PlayerItem = ({ player }: { player: Player }) => {
    return (
      <div className={s.player} style={{ 
        borderLeft: `4px solid ${getPositionColor(player.position)}` 
      }}>
       
        <div className={s.player_info}>
          <span className={s.player_position}>#{player.position}</span>
          <span className={s.player_medal}>{getMedal(player.position)}</span>
          <span className={s.player_name}>{player.name}</span>
        </div>
        <span className={s.player_score}>{player.score} очков</span>
      </div>
    )
  }

  return (
    <div className={clsx(s.modal, isStatsShow && s.show)}>
       <button onClick={() => setStatsShow(false)} className={s.close_button}>
          <Close />
        </button>
      <div className={s.modal_header}>
        <h2 className={s.modal_title}>🏆 Топ игроков сезона</h2>
        <div className={s.modal_subtitle}>Лучшие результаты мини-игры</div>
      </div>

      <div className={s.modal_content}>
        <div className={s.stats_header}>
          <span>Игрок</span>
          <span>Очки</span>
        </div>
        
        <div className={s.players_list}>
          {players.map(player => (
            <PlayerItem key={player.id} player={player} />
          ))}
        </div>

        <div className={s.modal_footer}>
          <div className={s.total_players}>Всего игроков: 20</div>
          <div className={s.highest_score}>Максимум: {Math.max(...players.map(p => p.score))} очков</div>
        </div>
      </div>
    </div>
  )
}