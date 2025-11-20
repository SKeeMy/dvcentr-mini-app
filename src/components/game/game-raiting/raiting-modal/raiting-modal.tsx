import { Close } from '@/components/shared/icons/close'
import { useGameStore } from '@/store/game-store'
import clsx from 'clsx'
import React from 'react'
import s from './raiting-modal.module.scss'
export interface Player {
  id: number
  name: string
  score: number
  position: number
}

export const RaitingModal = () => {

  const { showRaiting, setShowRaiting, isLoadingRaiting, players, currentResult, count_players, current_player } = useGameStore()


  // const players: Player[] = [
  //   { id: 1, name: "Беляев6636", score: 125, position: 1 },
  //   { id: 2, name: "Иванов123", score: 110, position: 2 },
  //   { id: 3, name: "Петров456", score: 95, position: 3 },

  // ]

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

  const PlayerItem = ({ player, isCurrent }: { player: Player, isCurrent?: boolean }) => {
    return (
      <div 
        className={clsx(s.player, isCurrent && s.current_player)} 
        style={{ 
          borderLeft: `4px solid ${getPositionColor(player.position)}` 
        }}
      >
        <div className={s.player_info}>
          <span className={s.player_position}>#{player.position}</span>
          <span className={s.player_medal}>{getMedal(player.position)}</span>
          <span className={s.player_name}>{player.name}</span>
        </div>
        <span className={s.player_score}>{player.score} очков</span>
      </div>
    )
  }

  const SkeletonPlayer = () => {
    return (
      <div className={s.skeleton_player}>
        <div className={s.skeleton_info}>
          <div className={s.skeleton_position}></div>
          <div className={s.skeleton_medal}></div>
          <div className={s.skeleton_name}></div>
        </div>
        <div className={s.skeleton_score}></div>
      </div>
    )
  }

  const SkeletonFooter = () => {
    return (
      <div className={s.modal_footer}>
        <div className={s.skeleton_footer_item}></div>
        <div className={s.skeleton_footer_item}></div>
      </div>
    )
  }

  return (
    <div className={clsx(s.modal, showRaiting && s.show)}>
      <button onClick={() => setShowRaiting(false)} className={s.close_button}>
        <Close />
      </button>
      <div className={s.modal_header}>
        <h2 className={s.modal_title}>🏆 Топ игроков сезона</h2>
        {players !== null && players?.length > 0 ? <div className={s.modal_subtitle}>Лучшие результаты мини-игры</div > : <div className={s.modal_subtitle}>Пока здесь пусто</div >}
      </div>

      <div className={s.modal_content}>
        {players !== null && players?.length > 0 && <div className={s.stats_header}>
          <span>Игрок</span>
          <span>Очки</span>
        </div>}

        <div className={s.players_list}>
          {isLoadingRaiting ? (
            [...Array(3)].map((_, index) => (
              <SkeletonPlayer key={index} />
            ))
          ) : players && players.length > 0 ? (
            <>
              {players.map(player => (
                <PlayerItem isCurrent={current_player ?  (player.id === current_player.id) : false} key={player.id} player={player} />
              ))}

              {current_player &&
                (current_player.position === 4 ? (
                  <PlayerItem isCurrent={true} key={current_player.id} player={current_player} />
                ) : current_player.position > 4 ? (
                  <div className={s.more_players}>
                    <span className={s.dots}>...</span>
                    <PlayerItem isCurrent={true} key={current_player.id} player={current_player} />
                  </div>
                ) : null
                )}
            </>
          ) : (
            <div className={s.empty_state}>
              <p>Будьте первым, кто установит рекорд!</p>
            </div>
          )}
        </div>

        {isLoadingRaiting ? (
          <SkeletonFooter />
        ) : (
          players !== null && players?.length > 0 ? <div className={s.modal_footer}>
            {count_players && <div className={s.total_players}>Всего игроков: {count_players}</div>}
            {players && <div className={s.highest_score}>
              Максимум: {Math.max(...players.map(p => p.score))} очков
            </div>}
          </div> : <></>
        )}
      </div>
    </div>
  )
}