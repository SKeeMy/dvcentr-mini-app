import React, { useState, useEffect, useRef } from 'react'
import s from './concrete-mixer-game.module.scss'

export const ConcreteMixerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const carImageRef = useRef<HTMLImageElement | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [carLoaded, setCarLoaded] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [showDebug, setShowDebug] = useState(false) // Добавляем переключатель дебага

  const groundYRef = useRef(0)

  const carRef = useRef({
    x: 75,
    y: 0,
    width: 80,
    height: 50,
    velocityY: 1,
    jumpForce: 12.5,
    isJumping: false,
  })

  const objectsRef = useRef<
    { 
      x: number; 
      y: number; 
      width: number; 
      height: number;
      type: 'obstacle' | 'coin' | 'airObstacle';
    }[]
  >([])
  const objectSpawnTimerRef = useRef(0)

  const gravity = 0.8
  const baseGameSpeed = 6

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
      setCarLoaded(true)
    }
  }, [])

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
        
        groundYRef.current = canvas.height - (canvas.height / 2.5)
        carRef.current.y = groundYRef.current - carRef.current.height
      }
    }
  }

  const calculateDifficulty = () => {
    const timeFactor = Math.min(gameTime / 20, 4)
    const scoreFactor = Math.min(score / 80, 3)
    return 1 + timeFactor + scoreFactor
  }

  const drawDebugInfo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, groundY: number, difficulty: number) => {
    if (!showDebug) return
    
    // Сохраняем текущие настройки
    ctx.save()
    
    // Рисуем границы canvas
    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    
    // Рисуем линию дороги
    ctx.strokeStyle = '#FFFF00'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])
    ctx.beginPath()
    ctx.moveTo(0, groundY)
    ctx.lineTo(canvas.width, groundY)
    ctx.stroke()
    
    // Рисуем хитбокс машинки
    const car = carRef.current
    ctx.strokeStyle = '#FF0000'
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.strokeRect(
      car.x - car.width/2, 
      car.y, 
      car.width, 
      car.height
    )
    
    // Рисуем хитбоксы объектов
    objectsRef.current.forEach(object => {
      if (object.type === 'obstacle') {
        ctx.strokeStyle = '#FF00FF'
      } else if (object.type === 'airObstacle') {
        ctx.strokeStyle = '#00FFFF'
      } else {
        ctx.strokeStyle = '#FFFF00'
      }
      ctx.strokeRect(object.x, object.y, object.width, object.height)
    })
    
    // Отображаем информацию
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '12px Arial'
    ctx.fillText(`Машинка: x=${car.x.toFixed(1)}, y=${car.y.toFixed(1)}`, 10, 20)
    ctx.fillText(`Размер: ${car.width}x${car.height}`, 10, 35)
    ctx.fillText(`Дорога: y=${groundY}`, 10, 50)
    ctx.fillText(`Сложность: ${difficulty.toFixed(2)}`, 10, 65)
    ctx.fillText(`Объектов: ${objectsRef.current.length}`, 10, 80)
    
    // Восстанавливаем настройки
    ctx.restore()
  }

  const gameLoop = () => {
    const difficulty = calculateDifficulty()
    const gameSpeed = baseGameSpeed * difficulty

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const groundY = groundYRef.current
    
    // Очистка canvas с красивым фоном
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    skyGradient.addColorStop(0, '#87CEEB')
    skyGradient.addColorStop(1, '#4682B4')
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const car = carRef.current
    car.y += car.velocityY
    car.velocityY += gravity

    // Проверка столкновения с дорогой
    if (car.y > groundY - car.height) {
      car.y = groundY - car.height
      car.velocityY = 0
      car.isJumping = false
    }

    // Рисуем машинку
    if (carLoaded && carImageRef.current) {
      const bounceOffset = car.isJumping ? 0 : Math.sin(Date.now() * 0.01) * 1.5
      
      ctx.drawImage(
        carImageRef.current, 
        car.x - car.width/2, 
        car.y + bounceOffset,
        car.width, 
        car.height
      )
    } else {
      ctx.fillStyle = '#FF6B35'
      ctx.fillRect(car.x - car.width/2, car.y, car.width, car.height)
    }

    // Спавн объектов
    objectSpawnTimerRef.current += 1
    const baseSpawnRate = 90
    const spawnRate = baseSpawnRate / (difficulty * 0.8)
    
    if (objectSpawnTimerRef.current > spawnRate) {
      const random = Math.random()
      let objectType: 'obstacle' | 'coin' | 'airObstacle'
      
      let obstacleChance = 0.35
      let airObstacleChance = 0.35
      let coinChance = 0.3
      
      if (gameTime > 15) {
        airObstacleChance = 0.45
        coinChance = 0.2
      }
      if (gameTime > 30) {
        airObstacleChance = 0.55
        obstacleChance = 0.25
        coinChance = 0.2
      }
      if (gameTime > 45) {
        airObstacleChance = 0.65
        obstacleChance = 0.2
        coinChance = 0.15
      }
      
      if (random < obstacleChance) {
        objectType = 'obstacle'
      } else if (random < obstacleChance + airObstacleChance) {
        objectType = 'airObstacle'
      } else {
        objectType = 'coin'
      }
      
      if (objectType === 'obstacle') {
        const baseHeight = 30
        const extraHeight = gameTime > 20 ? Math.random() * 30 + 15 : 0
        const obstacleHeight = baseHeight + extraHeight
        
        objectsRef.current.push({
          x: canvas.width,
          y: groundY - obstacleHeight,
          width: Math.random() * 30 + 30,
          height: obstacleHeight,
          type: 'obstacle'
        })
      } else if (objectType === 'airObstacle') {
        const heights = [80, 100, 120, 140]
        const selectedHeight = heights[Math.floor(Math.random() * heights.length)]
        const heightReduction = gameTime > 20 ? Math.random() * 50 + 30 : 0
        const obstacleY = groundY - (selectedHeight - Math.min(heightReduction, 70))
        
        if (Math.random() < 0.3 && gameTime > 25) {
          const secondHeight = heights[Math.floor(Math.random() * heights.length)]
          const secondY = groundY - (secondHeight - Math.min(heightReduction, 70))
          
          objectsRef.current.push({
            x: canvas.width + 40,
            y: secondY,
            width: Math.random() * 25 + 25,
            height: 20,
            type: 'airObstacle'
          })
        }
        
        objectsRef.current.push({
          x: canvas.width,
          y: obstacleY,
          width: Math.random() * 25 + 25,
          height: 20,
          type: 'airObstacle'
        })
      } else {
        const positions = [
          groundY - 150,
          groundY - 100,
          groundY - 60,
          groundY - 180
        ]
        const coinY = positions[Math.floor(Math.random() * positions.length)]
        
        if (Math.random() < 0.4 && gameTime > 20) {
          const obstacleHeight = Math.random() * 40 + 80
          const obstacleY = groundY - obstacleHeight
          const coinOffset = Math.random() < 0.5 ? -35 : 35
          
          objectsRef.current.push({
            x: canvas.width + coinOffset,
            y: obstacleY,
            width: 20,
            height: 20,
            type: 'coin'
          })
        } else {
          objectsRef.current.push({
            x: canvas.width,
            y: coinY,
            width: 20,
            height: 20,
            type: 'coin'
          })
        }
      }
      objectSpawnTimerRef.current = 0
    }

    // Обработка объектов
    for (let i = objectsRef.current.length - 1; i >= 0; i--) {
      const object = objectsRef.current[i]
      object.x -= gameSpeed

      // Рисуем объекты
      if (object.type === 'obstacle') {
        ctx.fillStyle = '#8B4513'
        ctx.fillRect(object.x, object.y, object.width, object.height)
        
        ctx.strokeStyle = '#654321'
        ctx.lineWidth = 2
        ctx.strokeRect(object.x, object.y, object.width, object.height)
      } else if (object.type === 'airObstacle') {
        ctx.fillStyle = '#DC143C'
        ctx.fillRect(object.x, object.y, object.width, object.height)
        
        const blinkSpeed = difficulty > 3 ? 0.05 : 0.03
        const blink = Math.sin(Date.now() * blinkSpeed) > 0 ? '#FF0000' : '#B22222'
        ctx.strokeStyle = blink
        ctx.lineWidth = 3
        ctx.strokeRect(object.x, object.y, object.width, object.height)
      } else {
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.arc(object.x + object.width/2, object.y + object.height/2, object.width/2, 0, Math.PI * 2)
        ctx.fill()
        
        const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`
        ctx.beginPath()
        ctx.arc(object.x + object.width/3, object.y + object.height/3, object.width/6, 0, Math.PI * 2)
        ctx.fill()
      }

      // Коллизия
      const carLeft = car.x - car.width/2
      const carRight = car.x + car.width/2
      const carTop = car.y
      const carBottom = car.y + car.height

      const objectLeft = object.x
      const objectRight = object.x + object.width
      const objectTop = object.y
      const objectBottom = object.y + object.height

      const collision = 
        carRight > objectLeft &&
        carLeft < objectRight &&
        carBottom > objectTop &&
        carTop < objectBottom

      if (collision) {
        if (object.type === 'obstacle' || object.type === 'airObstacle') {
          setGameOver(true)
          if (requestRef.current) {
            cancelAnimationFrame(requestRef.current)
          }
          return
        } else {
          setScore(prev => prev + 5)
          objectsRef.current.splice(i, 1)
          continue
        }
      }

      if (object.x + object.width < 0) {
        objectsRef.current.splice(i, 1)
      }
    }

    // Рисуем дорогу
    ctx.fillStyle = '#2F4F4F'
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY)
    
    // Разметка на дороге
    const dashSpeed = difficulty > 2 ? 0.05 : 0.03
    const dashOffset = (Date.now() * dashSpeed) % 60
    ctx.setLineDash([50, 50])
    ctx.beginPath()
    ctx.moveTo(dashOffset, groundY + 15)
    ctx.lineTo(canvas.width, groundY + 15)
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.setLineDash([])

    // Рисуем дебаг-информацию ПОСЛЕ всего остального
    drawDebugInfo(ctx, canvas, groundY, difficulty)

    requestRef.current = requestAnimationFrame(gameLoop)
  }

  const handleJump = () => {
    const car = carRef.current
    if (!car.isJumping) {
      car.velocityY = -car.jumpForce
      car.isJumping = true
    }
  }

  const toggleDebug = () => {
    setShowDebug(!showDebug)
  }

  const resetGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    resizeCanvas()
    
    carRef.current = {
      x: 75,
      y: groundYRef.current - carRef.current.height,
      width: 80,
      height: 50,
      velocityY: 0,
      jumpForce: 12.5,
      isJumping: false,
    }
    objectsRef.current = []
    objectSpawnTimerRef.current = 0
    setScore(0)
    setGameTime(0)
    setGameOver(false)
    requestRef.current = requestAnimationFrame(gameLoop)
  }

  // Таймер игры
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!gameOver && carLoaded) {
      timer = setInterval(() => {
        setGameTime(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameOver, carLoaded])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      resizeCanvas()

      const handleResize = () => {
        resizeCanvas()
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          handleJump()
        }
        // Добавляем горячую клавишу для дебага
        if (e.code === 'KeyD') {
          setShowDebug(prev => !prev)
        }
      }

      const handleTouchStart = () => handleJump()

      window.addEventListener('resize', handleResize)
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('touchstart', handleTouchStart)

      if (carLoaded && !gameOver) {
        requestRef.current = requestAnimationFrame(gameLoop)
      }

      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('touchstart', handleTouchStart)
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    }
  }, [carLoaded, gameOver])

  const getScoreClass = (score: number) => {
    if (score < 50) return s.scorePoor
    if (score < 100) return s.scoreGood
    if (score < 200) return s.scoreGreat
    return s.scoreExcellent
  }

  const getPerformanceClass = (score: number) => {
    if (score < 50) return s.performancePoor
    if (score < 100) return s.performanceGood
    if (score < 200) return s.performanceGreat
    return s.performanceExcellent
  }

  const getPerformanceText = (score: number) => {
    if (score < 50) return 'Поднимите больше мешков! 🙃'
    if (score < 100) return 'Отличная работа! 🥳'
    if (score < 200) return 'Коллекция мешков! 😎'
    return 'Невероятный результат!!! 🤩'
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
            <p className={s.loadingText}>Загрузка...</p>
          </div>
        )}
        
        {gameOver && (
          <div className={s.gameOverOverlay}>
            <p className={s.finalScore}>
              Время: {gameTime} сек.
            </p>
            <p className={s.finalScore}>
              Конечный счет:{' '}
              <span className={`${s.scoreValue} ${getScoreClass(score)}`}>
                {score}
              </span>
            </p>
            <p className={`${s.performanceText} ${getPerformanceClass(score)}`}>
              {getPerformanceText(score)}
            </p>    
            <h2 className={s.gameOverTitle}>Конец игры</h2>
            <button
              onClick={resetGame}
              className={s.restartButton}
            >
              Перезапустить
            </button>
          </div>
        )}
      </div>

      <div className={s.scoreDisplay}>
        <p className={s.scoreText}>Мешки: {score} | Время: {gameTime} сек.</p>
        {/* <button 
          onClick={toggleDebug}
          className={s.debugButton}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            background: showDebug ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Дебаг: {showDebug ? 'ВКЛ' : 'ВЫКЛ'}
        </button> */}
      </div>
    </div>
  )
}