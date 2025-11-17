import React from 'react'
import s from './concrete-mixer-game.module.scss'
export const StartGame = ({setGameStarted}: {setGameStarted: (val: boolean) => void}) => {
  return (
    <div className={s.startOverlay}>
        <div className={s.startContent}>
          <h1 className={s.gameTitle}>Цементовозик</h1>
          <p className={s.gameInstructions}>
            Прыгай через препятствия и собирай мешки с цементом!
          </p>
          <p className={s.controlsInfo}>
            Управление: клик для прыжка
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className={s.startButton}
          >
            СТАРТ
          </button>
        </div>
      </div>
  )
}
