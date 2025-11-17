'use client'
import { ConcreteMixerGame } from "@/components/game/ConcreteMixerGame"
import { useEffect, useState } from "react"
import { StartGame } from "@/components/game/start-game"
import { useRouter } from "next/router"
import { isTMA } from "@telegram-apps/sdk"
import { useAppBackButton } from "../hooks/useAppBackButton"

export default function GameSection() {
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const router = useRouter();
  const { showButton, hideButton } = useAppBackButton(() => {
    router.push('/');
  });

  // Инициализация кнопки назад - ТОЛЬКО ПРИ МОНТИРОВАНИИ
  useEffect(() => {
    const initBackButton = async () => {
      try {
        if (await isTMA()) {
          showButton();
        }
      } catch (error) {
        console.error('Ошибка инициализации кнопки назад:', error);
      }
    };

    initBackButton();

    return () => {
      hideButton();
    };
  }, []); 
  return (
    <div style={{ height: '100vh', maxHeight: '700px' }}>
      {gameStarted ?
        <ConcreteMixerGame /> : <StartGame setGameStarted={setGameStarted} />
      }
    </div>
  )
}