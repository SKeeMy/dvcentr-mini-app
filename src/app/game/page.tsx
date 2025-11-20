'use client'
import { ConcreteMixerGame } from "@/components/game/ConcreteMixerGame"
import { useEffect, useState } from "react"
import { StartGame } from "@/components/game/start-game"
import { useRouter } from "next/navigation"
import { isTMA } from "@telegram-apps/sdk"
import { useAppBackButton } from "../hooks/useAppBackButton"
import s from './game.module.scss'
import { RaitingModal } from "@/components/game/game-raiting/raiting-modal/raiting-modal"
export default function GameSection() {
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [isStatsShow, setStatsShow] = useState<boolean>(false)
  const router = useRouter();
  // const { showButton, hideButton, isVisible } = useAppBackButton(() => {
  //   router.push('/');
  // });
 

  // useEffect(() => {
  //   async function initializeGame() {
  //     try {
  //       if (await isTMA()) {
  //         showButton();
  //       }
  //     } catch (error) {
  //       console.error('Ошибка инициализации каталога:', error);
  //     }
  //   }

  //   initializeGame();

  //   return () => {
  //     hideButton();
  //   };
  // }, [showButton, hideButton, isVisible]);

  return (
    <div style={{ height: '100vh', maxHeight: '700px' }}>
      <RaitingModal  />
      {gameStarted ?
        <ConcreteMixerGame setStatsShow={setStatsShow}  /> : <StartGame setStatsShow={setStatsShow}  setGameStarted={setGameStarted} />
      }
    </div>
  )
}