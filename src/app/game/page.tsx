'use client'
import { ConcreteMixerGame } from "@/components/game/ConcreteMixerGame"
import { useState } from "react"
import { StartGame } from "@/components/game/start-game"

export default function GameSection() {
  const [gameStarted, setGameStarted] = useState<boolean>(false)

  return (
    <div style={{ height: '100vh', maxHeight: '700px' }}>
      {gameStarted ?
        <ConcreteMixerGame /> : <StartGame setGameStarted={setGameStarted} />
      }
    </div>
  )
}