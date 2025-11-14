import React, { useState, useEffect, useRef } from 'react'
import s from './concrete-mixer-game.module.scss'

export const ConcreteMixerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const carImageRef = useRef<HTMLImageElement | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [carLoaded, setCarLoaded] = useState(false)

  const groundYRef = useRef(0)

  const carRef = useRef({
    x: 75,
    y: 0,
    width: 60,
    height: 40,
    velocityY: 1,
    jumpForce: 15,
    isJumping: false,
  })

  const obstaclesRef = useRef<
    { x: number; y: number; width: number; height: number }[]
  >([])
  const obstacleSpawnTimerRef = useRef(0)

  const gravity = 0.7
  const baseGameSpeed = 4

  // Загрузка изображения машинки
  useEffect(() => {
    const carImage = new Image()
    carImage.src = '/images/game.png'
    carImage.onload = () => {
      carImageRef.current = carImage
      setCarLoaded(true)
    }
    carImage.onerror = () => {
      console.error('Failed to load car image')
      setCarLoaded(true) // Продолжаем без картинки
    }
  }, [])

  const gameLoop = () => {
    const difficulty = Math.min(1 + score * 0.01, 3)
    const gameSpeed = baseGameSpeed * difficulty

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const groundY = groundYRef.current
    
    // Очистка canvas с плавным переходом
    ctx.fillStyle = 'rgba(220, 38, 38, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const car = carRef.current
    car.y += car.velocityY
    car.velocityY += gravity

    if (car.y > groundY - car.height) {
      car.y = groundY - car.height
      car.velocityY = 0
      car.isJumping = false
    }

    // Рисуем машинку
    if (carLoaded && carImageRef.current) {
      // Анимация подпрыгивания на неровностях
      const bounceOffset = car.isJumping ? 0 : Math.sin(Date.now() * 0.01) * 1.5
      
      ctx.drawImage(
        carImageRef.current, 
        car.x - car.width/2, 
        car.y - car.height/2 + bounceOffset, 
        car.width, 
        car.height
      )
    } else {
      // Фолбэк если картинка не загрузилась
      ctx.fillStyle = '#34D399'
      ctx.fillRect(car.x - car.width/2, car.y - car.height/2, car.width, car.height)
    }

    // Спавн препятствий
    obstacleSpawnTimerRef.current += 1
    if (obstacleSpawnTimerRef.current > 60 / difficulty) {
      const obstacleHeight = Math.random() * 30 + 20
      obstaclesRef.current.push({
        x: canvas.width,
        y: groundY - obstacleHeight,
        width: Math.random() * 20 + 20,
        height: obstacleHeight,
      })
      obstacleSpawnTimerRef.current = 0
    }

    // Обработка препятствий
    for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
      const obstacle = obstaclesRef.current[i]
      obstacle.x -= gameSpeed

      // Анимированные препятствия
      ctx.fillStyle = '#1a95a5'
      const pulse = Math.sin(Date.now() * 0.005 + i) * 2
      ctx.fillRect(obstacle.x, obstacle.y + pulse, obstacle.width, obstacle.height)

      // Коллизия
      const carLeft = car.x - car.width/2
      const carRight = car.x + car.width/2
      const carTop = car.y - car.height/2
      const carBottom = car.y + car.height/2

      const obstacleLeft = obstacle.x
      const obstacleRight = obstacle.x + obstacle.width
      const obstacleTop = obstacle.y
      const obstacleBottom = obstacle.y + obstacle.height

      if (
        carRight > obstacleLeft &&
        carLeft < obstacleRight &&
        carBottom > obstacleTop &&
        carTop < obstacleBottom
      ) {
        setGameOver(true)
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
        return
      }

      if (obstacle.x + obstacle.width < 0) {
        obstaclesRef.current.splice(i, 1)
        setScore((prev) => prev + 1)
      }
    }

    // Рисуем дорогу
    ctx.beginPath()
    ctx.moveTo(0, groundY)
    ctx.lineTo(canvas.width, groundY)
    ctx.strokeStyle = '#9CA3AF'
    ctx.lineWidth = 2
    ctx.stroke()

    // Разметка на дороге (анимированная)
    const dashOffset = (Date.now() * 0.01) % 40
    ctx.setLineDash([20, 20])
    ctx.beginPath()
    ctx.moveTo(dashOffset, groundY - 1)
    ctx.lineTo(canvas.width, groundY - 1)
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.setLineDash([])

    requestRef.current = requestAnimationFrame(gameLoop)
  }

  const handleJump = () => {
    const car = carRef.current
    if (!car.isJumping) {
      car.velocityY = -car.jumpForce
      car.isJumping = true
    }
  }

  const resetGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    carRef.current = {
      x: 75,
      y: groundYRef.current - 40,
      width: 60,
      height: 40,
      velocityY: 0,
      jumpForce: 15,
      isJumping: false,
    }
    obstaclesRef.current = []
    obstacleSpawnTimerRef.current = 0
    setScore(0)
    setGameOver(false)
    requestRef.current = requestAnimationFrame(gameLoop)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth > 600 ? 600 : window.innerWidth - 40
      canvas.height = 300
      groundYRef.current = canvas.height - 20
      carRef.current.y = groundYRef.current - carRef.current.height

      const handleKeyDown = (e: KeyboardEvent) =>
        e.code === 'Space' && handleJump()
      const handleTouchStart = () => handleJump()

      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('touchstart', handleTouchStart)

      if (carLoaded && !gameOver) {
        requestRef.current = requestAnimationFrame(gameLoop)
      }

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('touchstart', handleTouchStart)
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    }
  }, [carLoaded, gameOver])

  const getScoreClass = (score: number) => {
    if (score < 5) return s.scorePoor
    if (score < 10) return s.scoreGood
    if (score < 20) return s.scoreGreat
    return s.scoreExcellent
  }

  const getPerformanceClass = (score: number) => {
    if (score < 5) return s.performancePoor
    if (score < 10) return s.performanceGood
    if (score < 20) return s.performanceGreat
    return s.performanceExcellent
  }

  const getPerformanceText = (score: number) => {
    if (score < 5) return 'You Need More Practice! 🙃'
    if (score < 10) return 'Good Job! 🥳'
    if (score < 20) return 'Great! 😎'
    return 'Excellent Performance! 🤩'
  }

  return (
    <div className={s.gameContainer}>
      <div className={s.gameWrapper}>
        <canvas 
          ref={canvasRef} 
          className={`${s.gameCanvas} ${gameOver ? s.gameOver : ''}`}
        />
        
        {!carLoaded && (
          <div className={s.loadingOverlay}>
            <p className={s.loadingText}>Loading car...</p>
          </div>
        )}
        
        {gameOver && (
          <div className={s.gameOverOverlay}>
            <p className={s.finalScore}>
              Final Score:{' '}
              <span className={`${s.scoreValue} ${getScoreClass(score)}`}>
                {score}
              </span>
            </p>
            <p className={`${s.performanceText} ${getPerformanceClass(score)}`}>
              {getPerformanceText(score)}
            </p>    
            <h2 className={s.gameOverTitle}>Game Over</h2>
            <button
              onClick={resetGame}
              className={s.restartButton}
            >
              Restart
            </button>
          </div>
        )}
      </div>

      {/* <div className={s.scoreDisplay}>
        <p className={s.scoreText}>Score: {score}</p>
      </div> */}

      {/* <div className={s.instructions}>
        <p className={s.instructionText}>
          Press SPACE or tap to jump over obstacles!
        </p>
      </div> */}
    </div>
  )
}