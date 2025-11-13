// components/mini-game/concrete-mixer-game.tsx
import { useAppBackButton } from '@/app/hooks/useAppBackButton'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import s from './concrete-mixer-game.module.scss'
import { init, viewport, backButton, isTMA, swipeBehavior } from '@telegram-apps/sdk';
import { useRouter } from 'next/navigation';
interface Obstacle {
  id: number
  type: 'cone' | 'barrier' | 'hole'
  position: number // позиция от правого края (100 = справа, 0 = слева)
  passed: boolean
}

interface GameState {
  isPlaying: boolean
  score: number
  speed: number
  isJumping: boolean
  gameOver: boolean
}

export const ConcreteMixerGame: React.FC = () => {
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
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    speed: 5,
    isJumping: false,
    gameOver: false
  })

  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [mixerRotation, setMixerRotation] = useState(0)
  const gameLoopRef = useRef<number | null>(null)
  const obstacleIdRef = useRef(0)
  const roadPositionRef = useRef(0)
  const lastObstacleTimeRef = useRef(0)

  // Создание препятствий (появляются справа)
  const createObstacle = useCallback(() => {
    const types: Obstacle['type'][] = ['cone', 'barrier', 'hole']
    const type = types[Math.floor(Math.random() * types.length)]
    
    setObstacles(prev => [...prev, {
      id: obstacleIdRef.current++,
      type,
      position: 100, // Начинаем справа (100% от правого края)
      passed: false
    }])
  }, [])

  // Прыжок
  const jump = useCallback(() => {
    if (!gameState.isJumping && gameState.isPlaying && !gameState.gameOver) {
      setGameState(prev => ({ ...prev, isJumping: true }))
      setTimeout(() => {
        setGameState(prev => ({ ...prev, isJumping: false }))
      }, 600)
    }
  }, [gameState.isJumping, gameState.isPlaying, gameState.gameOver])

  // Обработка касаний/кликов
  const handleTap = useCallback(() => {
    if (gameState.gameOver) {
      startGame()
    } else if (!gameState.isPlaying) {
      startGame()
    } else {
      jump()
    }
  }, [gameState.isPlaying, gameState.gameOver, jump])

  // Запуск игры
  const startGame = () => {
    setGameState({
      isPlaying: true,
      score: 0,
      speed: 5,
      isJumping: false,
      gameOver: false
    })
    setObstacles([])
    obstacleIdRef.current = 0
    roadPositionRef.current = 0
    lastObstacleTimeRef.current = Date.now()
    
    // Останавливаем предыдущий игровой цикл если был
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
  }

  // Проверка столкновений
  const checkCollision = useCallback((obstacle: Obstacle) => {
    // Бетономешалка находится на 20% слева
    // Препятствие сталкивается когда его позиция достигает 20%
    const collisionPosition = 20
    
    // Столкновение если препятствие в зоне 15-25% и игрок не прыгает
    return (
      obstacle.position <= collisionPosition + 5 && 
      obstacle.position >= collisionPosition - 5 &&
      !gameState.isJumping
    )
  }, [gameState.isJumping])

  // Игровой цикл
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    let lastTime = Date.now()
    
    const gameLoop = () => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Обновляем счет только если игра активна
      setGameState(prev => ({ 
        ...prev, 
        score: prev.score + 1,
        speed: Math.min(8, 5 + Math.floor(prev.score / 500)) // Еще медленнее увеличиваем скорость
      }))

      // Вращение бетономешалки
      setMixerRotation(prev => prev + 6)

      // Движение дороги
      roadPositionRef.current = (roadPositionRef.current - gameState.speed) % 100

      // Обновление позиций препятствий (двигаем слева направо - УМЕНЬШАЕМ position)
      // ЗАМЕДЛЯЕМ В 3 РАЗА: speed * 0.23 вместо speed * 0.7
      setObstacles(prev => {
        let hasCollision = false
        
        const updated = prev.map(obs => ({
          ...obs,
          position: obs.position - gameState.speed * 0.23 // ЗАМЕДЛЕНО В 3 РАЗА
        })).filter(obs => {
          // Удаляем когда ушли за левый край (position < 0)
          if (obs.position < -10) return false
          
          // Проверка столкновений
          if (!obs.passed && checkCollision(obs)) {
            hasCollision = true
            return false
          }
          
          // Отмечаем пройденные
          if (!obs.passed && obs.position < 15) {
            obs.passed = true
          }
          
          return true
        })

        // Если было столкновение - завершаем игру
        if (hasCollision) {
          setGameState(prev => ({ ...prev, gameOver: true, isPlaying: false }))
          return updated
        }

        return updated
      })

      // Создание новых препятствий с БОЛЬШИМ интервалом
      const now = Date.now()
      const obstacleInterval = Math.max(1500, 3000 - gameState.speed * 100) // Еще реже препятствия
      if (now - lastObstacleTimeRef.current > obstacleInterval) {
        createObstacle()
        lastObstacleTimeRef.current = now
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.isPlaying, gameState.gameOver, gameState.speed, createObstacle, checkCollision])

  // Обработка клавиш для десктопа
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault()
        handleTap()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleTap])

  return (
    <div className={s.gameContainer} onClick={handleTap}>
      {/* Стартовый экран */}
      {!gameState.isPlaying && !gameState.gameOver && (
        <div className={s.startScreen}>
          <div className={s.title}>БЕТОНОМЕШАЛКА</div>
          <div className={s.instructions}>
            <p>💡 Тапайте по экрану чтобы прыгать</p>
            <p>⏱️ Уворачивайтесь от препятствий</p>
            <p>🎯 Препятствия едут МЕДЛЕННО</p>
            <p>🚀 У вас много времени!</p>
          </div>
          <div className={s.startButton}>ТАПНИТЕ ЧТОБЫ НАЧАТЬ</div>
        </div>
      )}

      {/* Экран Game Over */}
      {gameState.gameOver && (
        <div className={s.gameOverScreen}>
          <div className={s.gameOverTitle}>ИГРА ОКОНЧЕНА</div>
          <div className={s.finalScore}>Счет: {gameState.score}</div>
          <div className={s.restartButton}>ТАПНИТЕ ДЛЯ РЕСТАРТА</div>
        </div>
      )}

      {/* Игровая зона */}
      <div className={s.gameArea}>
        {/* Небо */}
        <div className={s.sky}>
          <div className={s.cloud} style={{ left: '10%' }} />
          <div className={s.cloud} style={{ left: '50%' }} />
          <div className={s.cloud} style={{ left: '80%' }} />
        </div>

        {/* Счет */}
        <div className={s.scoreDisplay}>СЧЕТ: {gameState.score}</div>

        {/* Препятствия (двигаются слева направо ОЧЕНЬ МЕДЛЕННО) */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className={`${s.obstacle} ${s[obstacle.type]}`}
            style={{ left: `${obstacle.position}%` }}
          />
        ))}

        {/* Бетономешалка */}
        <img className={`${s.concreteMixer} ${gameState.isJumping ? s.jumping : ''}`} src={'/images/game.png'} />
     

        {/* Дорога */}
        <div 
          className={s.road}
          style={{ backgroundPositionX: `${roadPositionRef.current}px` }}
        >
          <div className={s.roadLine} />
          <div className={s.roadLine} style={{ left: '33%' }} />
          <div className={s.roadLine} style={{ left: '66%' }} />
        </div>

        {/* Земля */}
        <div className={s.ground} />
      </div>

      {/* Подсказка управления */}
      <div className={s.controlsHint}>
        {gameState.isPlaying && !gameState.gameOver && 'ТАПНИТЕ ДЛЯ ПРЫЖКА'}
        {gameState.gameOver && 'ТАПНИТЕ ДЛЯ РЕСТАРТА'}
      </div>
    </div>
  )
}