import React, { useState, useEffect, useRef } from 'react'
import s from './concrete-mixer-game.module.scss'

export const ConcreteMixerGame: React.FC = () => {
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
  // const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const groundYRef = useRef(0)
  const gameTimeRef = useRef(0)

  // Refs для звуков
  // const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const jumpSoundRef = useRef<HTMLAudioElement | null>(null)
  const coinSoundRef = useRef<HTMLAudioElement | null>(null)
  const crashSoundRef = useRef<HTMLAudioElement | null>(null)

  // Оптимизация FPS
  const lastTimeRef = useRef(0)
  const fps = 60
  const frameInterval = 1000 / fps

  const carRef = useRef({
    x: 75,
    y: 0,
    width: 130,
    height: 50,
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

  // Оптимизированная инициализация звуков
  const initAudio = () => {
    try {
      // Создаем элементы audio с предзагрузкой
      // backgroundMusicRef.current = new Audio()
      jumpSoundRef.current = new Audio()
      coinSoundRef.current = new Audio()
      crashSoundRef.current = new Audio()
      
      // Настраиваем фоновую музыку
      // if (backgroundMusicRef.current) {
      //   backgroundMusicRef.current.src = '/sounds/main_theme.mp3'
      //   backgroundMusicRef.current.loop = true
      //   backgroundMusicRef.current.volume = 0.2
      //   backgroundMusicRef.current.preload = 'auto'
      // }
      
      // Настраиваем звуковые эффекты
      const soundEffects = [
        { ref: jumpSoundRef, src: '/sounds/jump.mp3' },
        { ref: coinSoundRef, src: '/sounds/coin.mp3' },
        { ref: crashSoundRef, src: '/sounds/crush.mp3' }
      ]
      
      soundEffects.forEach(({ ref, src }) => {
        if (ref.current) {
          ref.current.src = src
          ref.current.volume = 0.3
          ref.current.preload = 'auto'
        }
      })

      // Предзагружаем звуки
      setTimeout(() => {
        soundEffects.forEach(({ ref }) => {
          if (ref.current) {
            ref.current.load()
          }
        })
        // if (backgroundMusicRef.current) {
        //   backgroundMusicRef.current.load()
        // }
      }, 1000)
      
    } catch (error) {
      console.log('Audio initialization failed:', error)
    }
  }

  // const playBackgroundMusic = () => {
  //   if (musicEnabled && backgroundMusicRef.current) {
  //     try {
  //       const playPromise = backgroundMusicRef.current.play()
  //       if (playPromise !== undefined) {
  //         playPromise.catch(e => {
  //           console.log('Background music play failed, retrying...')
  //           setTimeout(() => {
  //             backgroundMusicRef.current?.play().catch(() => {})
  //           }, 1000)
  //         })
  //       }
  //     } catch (error) {
  //       console.log('Background music error:', error)
  //     }
  //   }
  // }

  // const stopBackgroundMusic = () => {
  //   if (backgroundMusicRef.current) {
  //     backgroundMusicRef.current.pause()
  //     backgroundMusicRef.current.currentTime = 0
  //   }
  // }

  const playJumpSound = () => {
    if (soundEnabled && jumpSoundRef.current) {
      try {
        jumpSoundRef.current.currentTime = 0
        const playPromise = jumpSoundRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } catch (error) {
        // Игнорируем ошибки воспроизведения на мобильных
      }
    }
  }

  const playCoinSound = () => {
    if (soundEnabled && coinSoundRef.current) {
      try {
        coinSoundRef.current.currentTime = 0
        const playPromise = coinSoundRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } catch (error) {
        // Игнорируем ошибки
      }
    }
  }

  const playCrashSound = () => {
    if (soundEnabled && crashSoundRef.current) {
      try {
        crashSoundRef.current.currentTime = 0
        const playPromise = crashSoundRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } catch (error) {
        // Игнорируем ошибки
      }
    }
  }

  // const toggleMusic = () => {
  //   setMusicEnabled(prev => {
  //     if (!prev) {
  //       playBackgroundMusic()
  //     } else {
  //       stopBackgroundMusic()
  //     }
  //     return !prev
  //   })
  // }

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
    } else if (time < 20) {
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
    } else if (time < 35) {
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
    } else if (time < 50) {
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
        level: 5,
        spawnRate: 30,
        obstacleChance: 0.2,
        airObstacleChance: 0.6,
        coinChance: 0.2,
        speedMultiplier: 2.2,
        doubleObstacleChance: 0.8,
        maxObjects: 8
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

  // Инициализация звуков при загрузке компонента
  useEffect(() => {
    const initSounds = () => {
      initAudio()
      
      // if (musicEnabled) {
      //   const isMobile = isMobileDevice()
      //   setTimeout(() => {
      //     playBackgroundMusic()
      //   }, isMobile ? 2000 : 500)
      // }
    }

    if (document.readyState === 'complete') {
      initSounds()
    } else {
      window.addEventListener('load', initSounds)
    }
    
    return () => {
      window.removeEventListener('load', initSounds)
      // stopBackgroundMusic()
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
          ctx.arc(object.x + object.width/2, object.y + object.height/2, object.width/2, 0, Math.PI * 2)
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
          playCrashSound()
          setGameOver(true)
          if (requestRef.current) {
            cancelAnimationFrame(requestRef.current)
          }
          return
        } else {
          playCoinSound()
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
      playJumpSound()
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
      width: 130,
      height: 50,
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

    // Перезапускаем музыку при рестарте
    // if (musicEnabled) {
    //   setTimeout(() => {
    //     playBackgroundMusic()
    //   }, 100)
    // }

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
          </div>
        )}
      </div>

      <div className={s.scoreDisplay}>
        <p className={s.scoreText}>
          Мешки: {score} | Время: {gameTime} сек.
          {showDebug && ` | Скорость: ${(baseGameSpeed * getDifficultySettings(gameTime).speedMultiplier).toFixed(1)}`}
        </p>
        <p style={{ textAlign: 'center' }} className={s.scoreText}>
          Уровень: {currentLevel}
        </p>
        
        {/* Кнопки управления звуком */}
        {/* <div className={s.soundControls}>
          <button 
            onClick={toggleMusic}
            className={`${s.soundButton} ${musicEnabled ? s.soundOn : s.soundOff}`}
          >
            Музыка: {musicEnabled ? 'ВКЛ' : 'ВЫКЛ'}
          </button>
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