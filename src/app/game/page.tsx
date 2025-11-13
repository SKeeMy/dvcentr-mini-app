'use client'
import { ConcreteMixerGame } from "@/components/game/ConcreteMixerGame" 

export default function GameSection() {
  return (
    <div style={{ height: '100vh', maxHeight: '700px' }}>
      <ConcreteMixerGame />
    </div>
  )
}