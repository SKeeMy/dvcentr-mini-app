'use client'
import './styles/global.scss'
import { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/container/container'
import clsx from 'clsx'
import Link from 'next/link'
interface UserData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code: string
  is_premium?: boolean
}



// Mock данные для тестирования
const mockUsers: UserData[] = [
  {
    id: 123456789,
    first_name: "Анна",
    last_name: "Иванова",
    username: "anna_ivanova",
    language_code: "ru",
    is_premium: true
  },
  {
    id: 987654321,
    first_name: "Дмитрий",
    last_name: "Петров",
    username: "dmitry_petrov",
    language_code: "ru",
    is_premium: false
  },
  {
    id: 555555555,
    first_name: "Maria",
    last_name: "Johnson",
    username: "maria_j",
    language_code: "en",
    is_premium: true
  },
  {
    id: 111111111,
    first_name: "Alex",
    username: "alex_tech",
    language_code: "en",
    is_premium: false
  }
]

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMockIndex, setCurrentMockIndex] = useState(0)
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false)

  const [popupPosition, setPopupPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  // Обработчики жестов
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    currentYRef.current = touch.clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !popupRef.current) return;

    const touch = e.touches[0];
    currentYRef.current = touch.clientY;

    const deltaY = currentYRef.current - startYRef.current;

    // Уменьшаем чувствительность - делим на 2
    if (deltaY > 0) {
      const popupHeight = popupRef.current.offsetHeight;
      const position = Math.min(deltaY / popupHeight, 1);
      setPopupPosition(position * 0.5); // Уменьшаем коэффициент для меньшей чувствительности
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    const deltaY = currentYRef.current - startYRef.current;
    const popupHeight = popupRef.current?.offsetHeight || 0;

    // Увеличиваем порог закрытия до 40% высоты попапа
    if (deltaY > popupHeight * 0.4) {
      setOpenPopup(false);
    }

    // Сбрасываем позицию с анимацией
    setTimeout(() => setPopupPosition(0), 50);
  };
  const sendPhoneRequest = async () => {
    setLoading(true);
    setError(null);
    if (data === null) {
      try {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://dvcentr.ru/api/tg-react-app/';

        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Forwarded-Proto': 'https',
            'X-Forwarded-Ssl': 'on',
            'HTTPS': 'YES',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            phone: '79147275655'
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setOpenPopup(true)
        console.log('test', data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setOpenPopup(true)
    }

  };

  useEffect(() => {
    const initializeWebApp = async () => {
      try {
        const WebApp = (await import('@twa-dev/sdk')).default

        if (WebApp.initDataUnsafe.user) {
          setUserData(WebApp.initDataUnsafe.user as UserData)
          console.log('Using real Telegram user data')
        } else {
          const mockUser = mockUsers[currentMockIndex]
          setUserData(mockUser)
          console.log('Using mock user data:', mockUser)
        }
      } catch (error) {
        console.log('Error loading Telegram SDK, using mock data')
        const mockUser = mockUsers[currentMockIndex]
        setUserData(mockUser)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    initializeWebApp()
  }, [currentMockIndex])

  // Функция для переключения между mock пользователями
  const switchMockUser = () => {
    setIsLoading(true)
    setTimeout(() => {
      const nextIndex = (currentMockIndex + 1) % mockUsers.length
      setCurrentMockIndex(nextIndex)
      setUserData(mockUsers[nextIndex])
      setIsLoading(false)
    }, 500)
  }

  if (isLoading) {
    return (
      <Container>
        <div className="loading-container">
          <div className="telegram-loader">
            <div className="telegram-loader__spinner"></div>
            <p className="telegram-loader__text">Загрузка...</p>
          </div>
        </div>
      </Container>
    )
  }

  if (!userData) {
    return (
      <Container>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Доступ ограничен</h2>
          <p className="error-description">
            Пожалуйста, откройте это приложение через Telegram бота
          </p>
          <button className="demo-button" onClick={switchMockUser}>
            Попробовать демо режим
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="app-container">
        <div
          className={clsx('popup-overlay', openPopup && 'visible')}
          onClick={() => setOpenPopup(false)}
        >
          <div
            ref={popupRef}
            className={clsx('popup', openPopup && 'visible', isDragging && 'dragging')}
            style={{
              transform: `translateY(calc(${popupPosition * 100}% + ${popupPosition * 20}px))`
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='popup_inner'>
              <span
                className='popup__line'
                onMouseDown={(e) => {
                  // Для десктопа - начинаем драг
                  e.preventDefault();
                  startYRef.current = e.clientY;
                  currentYRef.current = e.clientY;
                  setIsDragging(true);
                }}
              ></span>
              <div className='popup_content_wrapper'>
                <div className="popup__data">
                  <div>
                    <span className="popup__desc">79147275655</span>
                    <p className='popup__title'>Телефон</p>
                  </div>
                  <div>
                    <span className="popup__desc">3</span>
                    <p className='popup__title'>Заказов кол-во</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">Приветствуем, DVCENTR.RU!👋</h1>
            <p className="app-subtitle">Наше мини приложение</p>
          </div>
          <div className="header-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
          </div>
        </header>

        {/* User Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-container">
              <div
                className="user-avatar"
                style={{
                  background: `linear-gradient(135deg, #${userData.id.toString().slice(0, 6)}, #${userData.id.toString().slice(3, 9)})`
                }}
              >
                {userData.first_name[0]}{userData.last_name?.[0] || ''}
              </div>
              {userData.is_premium && (
                <div className="premium-badge">⭐</div>
              )}
            </div>
            <div className="user-info">
              <h2 className="user-name">
                {userData.first_name} {userData.last_name || ''}
              </h2>
              {userData.username && (
                <p className="user-username">@{userData.username}</p>
              )}
              <div className="user-id">ID: {userData.id}</div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{userData.id.toString().slice(0, 3)}</div>
              <div className="stat-label">Префикс</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userData.language_code.toUpperCase()}</div>
              <div className="stat-label">Язык</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {userData.is_premium ? 'Yes' : 'No'}
              </div>
              <div className="stat-label">Premium</div>
            </div>
          </div>
        </div>
        <Link href={'/catalog'} className="action-button primary">
          Каталог
        </Link>

        {/* User Stats */}


        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Быстро</h3>
            <p className="feature-description">Мгновенная работа</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Безопасно</h3>
            <p className="feature-description">Ваши данные защищены</p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="actions-container">
          <button onClick={sendPhoneRequest} className="action-button primary">
            Получить данные по заказу
          </button>

        </div>
      </div>
    </Container>
  )
}