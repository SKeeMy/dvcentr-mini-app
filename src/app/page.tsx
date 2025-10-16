'use client'
import './styles/global.scss'
import { useEffect, useState } from 'react'
import { Container } from '@/components/container/container'
import clsx from 'clsx'
import Link from 'next/link'
import { Orders } from '@/components/pages/home/orders/orders'
import { IApiResponse, IOrderData } from '@/components/pages/home/orders/orders.interface'
import { ButtonClose } from '@/components/shared/buttons/button-close'
import { Close } from '@/components/shared/icons/close'
import { requestContact } from '@telegram-apps/sdk';

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
    is_premium: true,
    phone: "+79147275655"
  },
  {
    id: 987654321,
    first_name: "Дмитрий",
    last_name: "Петров",
    username: "dmitry_petrov",
    language_code: "ru",
    is_premium: false,
    phone: "+79147275656"
  }
]

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMockIndex, setCurrentMockIndex] = useState(0)
  const [data, setData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false)

  // Функция для запроса номера телефона
  const requestPhoneNumber = async () => {
    try {
      if (requestContact.isAvailable()) {
        const contactData = await requestContact();

        // Форматируем объект для красивого вывода в alert
        const formattedContact = JSON.stringify(contactData, null, 2);

        // Выводим объект в alert
        alert(`Полученные данные контакта:\n${formattedContact}`);

        console.log('Данные контакта:', contactData);

        // Обновляем данные пользователя если нужно
        if (contactData.contact) {
          setUserData(prev => prev ? {
            ...prev,
            phone: contactData.contact.phone_number,
            first_name: contactData.contact.first_name || prev.first_name,
            last_name: contactData.contact.last_name || prev.last_name
          } : null);
        }

        return contactData;
      } else {
        console.log('requestContact не доступен');
        alert('Функция запроса контакта не доступна в текущем окружении');

        // Используем моковые данные для демонстрации
        const mockContact = {
          contact: {
            user_id: mockUsers[currentMockIndex]?.id || 123456789,
            phone_number: mockUsers[currentMockIndex]?.phone || '+79147275655',
            first_name: mockUsers[currentMockIndex]?.first_name || 'Mock',
            last_name: mockUsers[currentMockIndex]?.last_name || 'User'
          },
          auth_date: new Date(),
          hash: 'mock_hash_' + Date.now()
        };

        const formattedMockContact = JSON.stringify(mockContact, null, 2);
        alert(`Моковые данные (requestContact не доступен):\n${formattedMockContact}`);

        return mockContact;
      }
    } catch (error) {
      console.error('Ошибка при запросе номера телефона:', error);
      alert(`Ошибка при получении номера телефона: ${error}`);
      return null;
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

  // useEffect для автоматического запроса номера телефона при загрузке
  useEffect(() => {
    if (!isLoading && userData) {
      // Небольшая задержка чтобы пользователь увидел интерфейс
      const timer = setTimeout(() => {
        requestPhoneNumber();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, userData]);

  const sendPhoneRequest = async () => {
    setOpenPopup(true)
    setError(null);
    if (data === null) {
      setLoading(true);

      try {
        // Сначала получаем номер телефона
        const contactData = await requestPhoneNumber();
        const phoneToSend = contactData?.contact?.phone_number || userData?.phone || '79147275655';

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
        console.log('API Response:', result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
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
        <div
          className={clsx('popup-overlay', openPopup && 'visible')}
          onClick={() => setOpenPopup(false)}
        >
          <div
            className={clsx('popup', openPopup && 'visible')}
          >
            <div className='popup_inner'>
              <ButtonClose aria-label='Close dialog' className='popup__close-btn' onClose={() => setOpenPopup(false)}>
                <Close />
              </ButtonClose>
              <span className='popup__line'></span>
              <div className='popup_content_wrapper'>
                <div className="popup__data">
                  <div>
                    <span className="popup__desc">
                      {userData?.phone || 'Номер не получен'}
                    </span>
                    <p className='popup__title'>Телефон</p>
                  </div>
                  {data && <div>
                    <span className="popup__desc">{data.DATA.Data.length}</span>
                    <p className='popup__title'>Доступно</p>
                  </div>}
                </div>
              </div>
              {data && data.DATA.Data.map((order, index) => (
                <Orders
                  key={`${order.SalesId}-${index}`}
                  orderData={order}
                  loading={loading}
                />
              ))}

              {data === null && loading &&
                <Orders
                  orderData={null}
                  loading={loading}
                />
              }
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
              {userData.phone && (
                <div className="user-phone">📱 {userData.phone}</div>
              )}
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

          {/* Кнопка для повторного запроса номера телефона */}
          <button onClick={requestPhoneNumber} className="action-button secondary">
            Получить номер телефона
          </button>
        </div>
      </div>
    </Container>
  )
}