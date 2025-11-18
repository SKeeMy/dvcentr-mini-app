import React from 'react'
import s from './concrete-mixer-game.module.scss'
import { ButtonStats } from './game-raiting/button-stats/button-stats'
export const StartGame = ({setGameStarted,setStatsShow }: {setGameStarted: (val: boolean) => void, setStatsShow: (value: boolean) => void }) => {
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
          <ButtonStats type='start' setStatsShow={setStatsShow} />
        </div>
      </div>
  )
}
