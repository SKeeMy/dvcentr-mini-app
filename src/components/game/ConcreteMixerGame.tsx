import React, { useState, useEffect, useRef } from 'react'
import s from './concrete-mixer-game.module.scss'
import { ButtonStats } from './game-raiting/button-stats/button-stats'

export const ConcreteMixerGame = ({ setStatsShow }: { setStatsShow: (value: boolean) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const carImageRef = useRef<HTMLImageElement | null>(null)
  const coinImageRef = useRef<HTMLImageElement | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [carLoaded, setCarLoaded] = useState(false)
  const [coinLoaded, setCoinLoaded] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [showDebug, setShowDebug] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const groundYRef = useRef(0)
  const gameTimeRef = useRef(0)

  // Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null)
  const soundBuffersRef = useRef<{ [key: string]: AudioBuffer }>({})

  // Оптимизация FPS
  const lastTimeRef = useRef(0)
  const fps = 60
  const frameInterval = 1000 / fps

  const carRef = useRef({
    x: 75,
    y: 0,
    width: 100,
    height: 35,
    velocityY: 1,
    jumpForce: 15.5,
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

  // Определение мобильного устройства
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Инициализация Web Audio API
  const initWebAudio = async () => {
    try {
      // Создаем AudioContext только если его еще нет
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      // Ждем пока пользователь взаимодействует с страницей для разблокировки аудио
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      // Загружаем звуковые файлы
      const soundFiles = {
        jump: '/sounds/jump.mp3',
        coin: '/sounds/coin.mp3',
        crash: '/sounds/crush.mp3'
      }

      for (const [name, url] of Object.entries(soundFiles)) {
        try {
          const response = await fetch(url)
          if (!response.ok) throw new Error(`Failed to load ${url}`)

          const arrayBuffer = await response.arrayBuffer()
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
          soundBuffersRef.current[name] = audioBuffer
        } catch (error) {
          console.warn(`Failed to load sound ${name}:`, error)
        }
      }

      console.log('Web Audio API initialized successfully')
    } catch (error) {
      console.error('Web Audio API initialization failed:', error)
    }
  }

  // Воспроизведение звука через Web Audio API
  const playSound = (soundName: string) => {
    if (!soundEnabled || !audioContextRef.current) return

    const buffer = soundBuffersRef.current[soundName]
    if (!buffer) {
      console.warn(`Sound buffer not found: ${soundName}`)
      return
    }

    try {
      const source = audioContextRef.current.createBufferSource()
      const gainNode = audioContextRef.current.createGain()

      source.buffer = buffer
      gainNode.gain.value = 0.3 // Громкость

      source.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)
      source.start(0)

      // Очистка после воспроизведения
      source.onended = () => {
        source.disconnect()
        gainNode.disconnect()
      }
    } catch (error) {
      console.warn(`Failed to play sound ${soundName}:`, error)
    }
  }

  const toggleSound = () => {
    setSoundEnabled(prev => !prev)
  }

  // Система сложности
  const getDifficultySettings = (time: number) => {
    if (time < 10) {
      return {
        level: 1,
        spawnRate: 120,
        obstacleChance: 0.5,
        airObstacleChance: 0.1,
        coinChance: 0.4,
        speedMultiplier: 1.0,
        doubleObstacleChance: 0.0,
        maxObjects: 3
      }
    } else if (time < 120) {
      return {
        level: 2,
        spawnRate: 90,
        obstacleChance: 0.4,
        airObstacleChance: 0.3,
        coinChance: 0.3,
        speedMultiplier: 1.3,
        doubleObstacleChance: 0.2,
        maxObjects: 4
      }
    } else if (time < 180) {
      return {
        level: 3,
        spawnRate: 70,
        obstacleChance: 0.4,
        airObstacleChance: 0.4,
        coinChance: 0.2,
        speedMultiplier: 1.6,
        doubleObstacleChance: 0.4,
        maxObjects: 5
      }
    } else if (time < 240) {
      return {
        level: 4,
        spawnRate: 50,
        obstacleChance: 0.3,
        airObstacleChance: 0.5,
        coinChance: 0.2,
        speedMultiplier: 1.9,
        doubleObstacleChance: 0.6,
        maxObjects: 6
      }
    } else {
      return {
        level: 4,
        spawnRate: 50,
        obstacleChance: 0.3,
        airObstacleChance: 0.5,
        coinChance: 0.2,
        speedMultiplier: 1.9,
        doubleObstacleChance: 0.6,
        maxObjects: 6
      }
    }
  }

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

  // Загрузка изображения монеты
  useEffect(() => {
    const coinImage = new Image()
    coinImage.src = '/images/coin.png'
    coinImage.onload = () => {
      coinImageRef.current = coinImage
      setCoinLoaded(true)
    }
    coinImage.onerror = () => {
      console.error('Failed to load coin image')
      setCoinLoaded(true)
    }
  }, [])

  // Инициализация Web Audio API при загрузке компонента
  useEffect(() => {
    const initAudio = async () => {
      // Ждем пользовательского взаимодействия для разблокировки аудио
      const handleUserInteraction = async () => {
        try {
          await initWebAudio()
          document.removeEventListener('click', handleUserInteraction)
          document.removeEventListener('touchstart', handleUserInteraction)
        } catch (error) {
          console.error('Audio initialization failed:', error)
        }
      }

      // Добавляем обработчики для пользовательского взаимодействия
      document.addEventListener('click', handleUserInteraction, { once: true })
      document.addEventListener('touchstart', handleUserInteraction, { once: true })

      // Авто-инициализация через 3 секунды (на случай если пользователь не взаимодействует)
      const timeoutId = setTimeout(() => {
        initWebAudio().catch(console.error)
      }, 3000)

      return () => {
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
        clearTimeout(timeoutId)
      }
    }

    initAudio()

    return () => {
      // Очистка AudioContext при размонтировании
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error)
      }
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

  const spawnObject = (canvas: HTMLCanvasElement, difficulty: any) => {
    if (objectsRef.current.length >= difficulty.maxObjects) {
      return
    }

    const groundY = groundYRef.current
    const random = Math.random()

    let objectType: 'obstacle' | 'coin' | 'airObstacle'

    if (random < difficulty.obstacleChance) {
      objectType = 'obstacle'
    } else if (random < difficulty.obstacleChance + difficulty.airObstacleChance) {
      objectType = 'airObstacle'
    } else {
      objectType = 'coin'
    }

    if (objectType === 'obstacle') {
      const baseHeight = 30
      const extraHeight = gameTimeRef.current > 20 ? Math.random() * 30 + 15 : 0
      const obstacleHeight = baseHeight + extraHeight

      objectsRef.current.push({
        x: canvas.width,
        y: groundY - obstacleHeight,
        width: Math.random() * 30 + 30,
        height: obstacleHeight,
        type: 'obstacle'
      })

      if (Math.random() < difficulty.doubleObstacleChance && objectsRef.current.length < difficulty.maxObjects - 1) {
        objectsRef.current.push({
          x: canvas.width + 60,
          y: groundY - (obstacleHeight * 0.7),
          width: Math.random() * 25 + 25,
          height: obstacleHeight * 0.7,
          type: 'obstacle'
        })
      }
    } else if (objectType === 'airObstacle') {
      const heights = [80, 100, 120, 140, 160, 180]
      const selectedHeight = heights[Math.floor(Math.random() * heights.length)]
      const obstacleY = groundY - selectedHeight

      objectsRef.current.push({
        x: canvas.width,
        y: obstacleY,
        width: Math.random() * 25 + 25,
        height: 20,
        type: 'airObstacle'
      })

      if (Math.random() < difficulty.doubleObstacleChance && objectsRef.current.length < difficulty.maxObjects - 1) {
        const secondHeight = heights[Math.floor(Math.random() * heights.length)]
        const secondY = groundY - secondHeight

        objectsRef.current.push({
          x: canvas.width + 40,
          y: secondY,
          width: Math.random() * 25 + 25,
          height: 20,
          type: 'airObstacle'
        })
      }
    } else {
      const positions = [
        groundY - 150,
        groundY - 100,
        groundY - 60,
        groundY - 180,
        groundY - 200,
        groundY - 80
      ]
      const coinY = positions[Math.floor(Math.random() * positions.length)]

      objectsRef.current.push({
        x: canvas.width,
        y: coinY,
        width: 35,
        height: 35,
        type: 'coin'
      })
    }
  }

  const drawDebugInfo = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, groundY: number, difficulty: any) => {
    if (!showDebug) return

    // Пропускаем дебаг на мобильных для производительности
    if (isMobileDevice()) return

    ctx.save()

    ctx.strokeStyle = '#00FF00'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#FFFF00'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])
    ctx.beginPath()
    ctx.moveTo(0, groundY)
    ctx.lineTo(canvas.width, groundY)
    ctx.stroke()

    const car = carRef.current
    ctx.strokeStyle = '#FF0000'
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.strokeRect(
      car.x - car.width / 2,
      car.y,
      car.width,
      car.height
    )

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

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '12px Arial'
    ctx.fillText(`Уровень: ${difficulty.level}`, 10, 20)
    ctx.fillText(`Время в цикле: ${gameTimeRef.current}сек`, 10, 35)
    ctx.fillText(`Сложность: ${difficulty.speedMultiplier.toFixed(2)}`, 10, 50)
    ctx.fillText(`Скорость: ${(baseGameSpeed * difficulty.speedMultiplier).toFixed(1)}`, 10, 65)
    ctx.fillText(`Спавн: ${difficulty.spawnRate}`, 10, 80)
    ctx.fillText(`Объектов: ${objectsRef.current.length}/${difficulty.maxObjects}`, 10, 95)
    ctx.fillText(`Препятствия: ${(difficulty.obstacleChance * 100).toFixed(0)}%`, 10, 110)
    ctx.fillText(`Воздушные: ${(difficulty.airObstacleChance * 100).toFixed(0)}%`, 10, 125)
    ctx.fillText(`Двойные: ${(difficulty.doubleObstacleChance * 100).toFixed(0)}%`, 10, 140)

    ctx.restore()
  }

  const gameLoop = (timestamp: number) => {
    // Ограничиваем FPS для мобильных устройств
    const deltaTime = timestamp - lastTimeRef.current
    if (deltaTime < frameInterval) {
      requestRef.current = requestAnimationFrame(gameLoop)
      return
    }
    lastTimeRef.current = timestamp - (deltaTime % frameInterval)

    const difficulty = getDifficultySettings(gameTimeRef.current)
    const gameSpeed = baseGameSpeed * difficulty.speedMultiplier

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const groundY = groundYRef.current

    if (difficulty.level !== currentLevel) {
      setCurrentLevel(difficulty.level)
    }

    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    skyGradient.addColorStop(0, '#87CEEB')
    skyGradient.addColorStop(1, '#4682B4')
    ctx.fillStyle = skyGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const car = carRef.current
    car.y += car.velocityY
    car.velocityY += gravity

    if (car.y > groundY - car.height) {
      car.y = groundY - car.height
      car.velocityY = 0
      car.isJumping = false
    }

    if (carLoaded && carImageRef.current) {
      const bounceOffset = car.isJumping ? 0 : Math.sin(Date.now() * 0.01) * 1.5

      ctx.drawImage(
        carImageRef.current,
        car.x - car.width / 2,
        car.y + bounceOffset,
        car.width,
        car.height
      )
    } else {
      ctx.fillStyle = '#FF6B35'
      ctx.fillRect(car.x - car.width / 2, car.y, car.width, car.height)
    }

    objectSpawnTimerRef.current += 1
    if (objectSpawnTimerRef.current > difficulty.spawnRate) {
      spawnObject(canvas, difficulty)
      objectSpawnTimerRef.current = 0
    }

    for (let i = objectsRef.current.length - 1; i >= 0; i--) {
      const object = objectsRef.current[i]
      object.x -= gameSpeed

      if (object.type === 'obstacle') {
        ctx.fillStyle = '#8B4513'
        ctx.fillRect(object.x, object.y, object.width, object.height)

        ctx.strokeStyle = '#654321'
        ctx.lineWidth = 2
        ctx.strokeRect(object.x, object.y, object.width, object.height)
      } else if (object.type === 'airObstacle') {
        ctx.fillStyle = '#DC143C'
        ctx.fillRect(object.x, object.y, object.width, object.height)

        const blinkSpeed = difficulty.speedMultiplier > 2 ? 0.08 : 0.05
        const blink = Math.sin(Date.now() * blinkSpeed) > 0 ? '#FF0000' : '#B22222'
        ctx.strokeStyle = blink
        ctx.lineWidth = 3
        ctx.strokeRect(object.x, object.y, object.width, object.height)
      } else {
        // Упрощенная отрисовка монет для мобильных
        if (coinLoaded && coinImageRef.current) {
          // Убираем сложные эффекты для мобильных
          ctx.drawImage(
            coinImageRef.current,
            object.x,
            object.y,
            object.width,
            object.height
          )
        } else {
          // Простой круг вместо сложной анимации
          ctx.fillStyle = '#FFD700'
          ctx.beginPath()
          ctx.arc(object.x + object.width / 2, object.y + object.height / 2, object.width / 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const carLeft = car.x - car.width / 2
      const carRight = car.x + car.width / 2
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
          playSound('crash')
          setGameOver(true)
          if (requestRef.current) {
            cancelAnimationFrame(requestRef.current)
          }
          return
        } else {
          playSound('coin')
          setScore(prev => prev + 5)
          objectsRef.current.splice(i, 1)
          continue
        }
      }

      if (object.x + object.width < 0) {
        objectsRef.current.splice(i, 1)
      }
    }

    ctx.fillStyle = '#2F4F4F'
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY)

    // Разметка на дороге - упрощенная для мобильных
    const isMobile = isMobileDevice()
    const dashSpeed = isMobile ? 0.04 : 0.08
    const dashOffset = (Date.now() * dashSpeed) % 100
    const dashLength = isMobile ? 30 : 40
    const gapLength = isMobile ? 30 : 40

    ctx.setLineDash([dashLength, gapLength])
    ctx.lineDashOffset = -dashOffset
    ctx.beginPath()
    ctx.moveTo(0, groundY + 15)
    ctx.lineTo(canvas.width, groundY + 15)
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = isMobile ? 2 : 3
    ctx.stroke()
    ctx.setLineDash([])

    drawDebugInfo(ctx, canvas, groundY, difficulty)

    requestRef.current = requestAnimationFrame(gameLoop)
  }

  const handleJump = () => {
    const car = carRef.current
    if (!car.isJumping) {
      car.velocityY = -car.jumpForce
      car.isJumping = true
      playSound('jump')
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
      width: 100,
      height: 35,
      velocityY: 0,
      jumpForce: 15.5,
      isJumping: false,
    }
    objectsRef.current = []
    objectSpawnTimerRef.current = 0
    setScore(0)
    setGameTime(0)
    gameTimeRef.current = 0
    setCurrentLevel(1)
    setGameOver(false)

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
    lastTimeRef.current = performance.now()
    requestRef.current = requestAnimationFrame(gameLoop)
  }

  // Таймер игры
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!gameOver && carLoaded && coinLoaded) {
      timer = setInterval(() => {
        setGameTime(prev => {
          const newTime = prev + 1
          gameTimeRef.current = newTime
          return newTime
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameOver, carLoaded, coinLoaded])

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
        if (e.code === 'KeyD') {
          setShowDebug(prev => !prev)
        }
      }

      const handleTouchStart = () => handleJump()

      window.addEventListener('resize', handleResize)
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('touchstart', handleTouchStart)

      if (carLoaded && coinLoaded && !gameOver) {
        lastTimeRef.current = performance.now()
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
  }, [carLoaded, coinLoaded, gameOver])

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

  const allImagesLoaded = carLoaded && coinLoaded

  return (
    <div className={s.gameContainer}>
      <div className={s.gameWrapper}>
        <canvas
          ref={canvasRef}
          className={`${s.gameCanvas} ${gameOver ? s.gameOver : ''}`}
        />

        {!allImagesLoaded && (
          <div className={s.loadingOverlay}>
            <p className={s.loadingText}>Загрузка...</p>
          </div>
        )}

        {gameOver && (
          <div className={s.gameOverOverlay}>
            <p className={s.finalScore}>
              Время: {gameTime} сек. | Уровень: {currentLevel}
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

            <ButtonStats type='end' setStatsShow={setStatsShow} />
          </div>
        )}
      </div>

      <div className={s.scoreDisplay}>
        <p className={s.scoreText}>
          Мешки: {score} | Время: {gameTime} сек.
          {showDebug && ` | Скорость: ${(baseGameSpeed * getDifficultySettings(gameTime).speedMultiplier).toFixed(1)}`}
        </p>
        {/* <p style={{ textAlign: 'center' }} className={s.scoreText}>
          Уровень: {currentLevel}
        </p> */}

        {/* Кнопка управления звуком */}
        {/* <div className={s.soundControls}>
          <button 
            onClick={toggleSound}
            className={`${s.soundButton} ${soundEnabled ? s.soundOn : s.soundOff}`}
          >
            Звуки: {soundEnabled ? 'ВКЛ' : 'ВЫКЛ'}
          </button>
        </div> */}
      </div>
    </div>
  )
}