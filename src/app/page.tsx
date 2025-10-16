'use client'
import './styles/global.scss'
import { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/container/container'
import clsx from 'clsx'
import Link from 'next/link'
import { Orders } from '@/components/pages/home/orders/orders'
import { IApiResponse, IOrderData } from '@/components/pages/home/orders/orders.interface'
import { ButtonClose } from '@/components/shared/buttons/button-close'
import { Close } from '@/components/shared/icons/close'
import { requestContact, initData } from '@telegram-apps/sdk'

// Тип для контакта из Telegram
interface TelegramContact {
  user_id: number
  phone_number: string
  first_name: string
  last_name?: string
}

interface RequestContactResponse {
  contact: TelegramContact
  auth_date: Date
  hash: string
}

// Интерфейс для пользователя из Telegram
interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code: string
  is_premium?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

interface UserData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code: string
  is_premium?: boolean
  phone?: string
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

// Функция для преобразования Telegram User в наш UserData
const mapTelegramUserToUserData = (telegramUser: TelegramUser): UserData => {
  return {
    id: telegramUser.id,
    first_name: telegramUser.first_name,
    last_name: telegramUser.last_name,
    username: telegramUser.username,
    language_code: telegramUser.language_code,
    is_premium: telegramUser.is_premium
  }
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMockIndex, setCurrentMockIndex] = useState(0)
  const [data, setData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [contactData, setContactData] = useState<RequestContactResponse | null>(null)

  useEffect(() => {
    const initializeWebApp = async () => {
      try {
        // initData - это объект с функциями, нужно их вызывать
        console.log('initData object:', initData);
        
        // Получаем пользователя через функцию user()
        const telegramUser = initData.user();
        console.log('telegramUser from initData.user():', telegramUser);
        
        if (telegramUser) {
          const userData = mapTelegramUserToUserData(telegramUser as TelegramUser);
          setUserData(userData)
          console.log('Mapped userData:', userData)
          console.log('Using real Telegram user data')
        } else {
          // Если нет реальных данных, используем мок
          const mockUser = mockUsers[currentMockIndex]
          setUserData(mockUser)
          console.log('Using mock user data:', mockUser)
        }
      } catch (error) {
        console.log('Error initializing Telegram SDK, using mock data', error)
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

  const sendPhoneRequest = async () => {
    setOpenPopup(true)
    setError(null);
    
    // Если данных еще нет, запрашиваем контакт и делаем API запрос
    if (data === null) {
      setLoading(true);

      try {
        let phoneToSend = '79147275655' // fallback номер

        // Запрашиваем контакт, если доступно
        if (requestContact.isAvailable()) {
          const contact = await requestContact()
          console.log('contact', contact)
          setContactData(contact as unknown as RequestContactResponse)
          
          // Используем телефон из контакта
          if (contact.contact.phone_number) {
            setPhoneNumber(contact.contact.phone_number)
            phoneToSend = contact.contact.phone_number
          }
        }

        // Делаем API запрос
        const response = await fetch('/api/tg-react-app', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Forwarded-Proto': 'https',
            'X-Forwarded-Ssl': 'on',
            'HTTPS': 'YES',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            phone: phoneToSend
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        console.log('API response data:', result);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error in sendPhoneRequest:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Если данные уже есть, просто открываем попап
      setOpenPopup(true)
    }
  };

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
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="app-container">
        {/* Popup */}
        <div
          className={clsx('popup-overlay', openPopup && 'visible')}
          onClick={() => setOpenPopup(false)}
        >
          <div
            className={clsx('popup', openPopup && 'visible')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='popup_inner'>
              <ButtonClose 
                aria-label='Close dialog' 
                className='popup__close-btn' 
                onClose={() => setOpenPopup(false)}
              >
                <Close />
              </ButtonClose>
              <span className='popup__line'></span>
              
              <div className='popup_content_wrapper'>
                <div className="popup__data">
                  <div>
                    <span className="popup__desc">
                      {phoneNumber || contactData?.contact.phone_number || 'Не указан'}
                    </span>
                    <p className='popup__title'>Телефон</p>
                  </div>
                  {data && (
                    <div>
                      <span className="popup__desc">{data.DATA.Data.length}</span>
                      <p className='popup__title'>Доступно</p>
                    </div>
                  )}
                </div>
              </div>

              {data && data.DATA.Data.map((order, index) => (
                <Orders
                  key={`${order.SalesId}-${index}`}
                  orderData={order}
                  loading={loading}
                />
              ))}

              {data === null && loading && (
                <Orders
                  orderData={null}
                  loading={loading}
                />
              )}

              {error && (
                <div className="error-message">
                  Ошибка: {error}
                </div>
              )}
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
            Доступно по доверенности
          </button>
        </div>
      </div>
    </Container>
  )
}