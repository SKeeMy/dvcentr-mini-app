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

interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  allows_to_write_to_pm?: boolean
  added_to_attachment_menu?: boolean
  phone_number?: string
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
    phone: "+79147275655"
  },
  {
    id: 555555555,
    first_name: "Maria",
    last_name: "Johnson",
    username: "maria_j",
    language_code: "en",
    is_premium: true,
    phone: "+79147275655"
  },
  {
    id: 111111111,
    first_name: "Alex",
    username: "alex_tech",
    language_code: "en",
    is_premium: false,
    phone: "+79147275655"
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

  useEffect(() => {
    const initializeWebApp = async () => {
      try {
        const WebApp = (await import('@twa-dev/sdk')).default

        if (WebApp.initDataUnsafe.user) {
          const telegramUser = WebApp.initDataUnsafe.user as TelegramWebAppUser

          // Преобразуем Telegram пользователя в наш формат
          const userData: UserData = {
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
            language_code: telegramUser.language_code || 'ru',
            is_premium: telegramUser.is_premium,
            phone: telegramUser.phone_number // Используем phone_number из Telegram
          }

          setUserData(userData)
          console.log('User data initialized:', userData)

          if (telegramUser.phone_number) {
            console.log('📱 Телефон из Telegram initData:', telegramUser.phone_number)
          } else {
            console.log('📱 Телефон не найден в initData')
          }
        } else {
          // Используем mock данные
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

  const getUserPhone = async (): Promise<string> => {
    try {
      const WebApp = (await import('@twa-dev/sdk')).default

      // Сначала проверяем, есть ли телефон уже в userData
      if (userData?.phone) {
        console.log('📱 Телефон уже есть в userData:', userData.phone)
        return userData.phone
      }

      // Проверяем телефон в initDataUnsafe
      //@ts-ignore
      if (WebApp.initDataUnsafe.user?.phone_number) {
         //@ts-ignore
        const phone = WebApp.initDataUnsafe.user.phone_number
        console.log('📱 Телефон из initData:', phone)

        // Обновляем userData с телефоном
        if (userData) {
          setUserData({
            ...userData,
            phone: phone
          })
        }

        return phone
      }

      // Если телефона нет, пробуем запросить через requestContact
      console.log('📱 Запрашиваем телефон через requestContact...')

      if (WebApp?.requestContact) {
        return await new Promise((resolve) => {
          // requestContact возвращает boolean - успешность отправки запроса
          const requestSent = WebApp.requestContact(() => {
            // Колбэк срабатывает когда пользователь выбирает контакт
            console.log('✅ Пользователь предоставил контакт')

            // После выбора контакта телефон должен появиться в initData
            setTimeout(() => {
              const newPhone = WebApp.initDataUnsafe.user?.phone_number
              if (newPhone) {
                console.log('📱 Получен телефон через requestContact:', newPhone)

                // Обновляем userData
                if (userData) {
                  setUserData({
                    ...userData,
                    phone: newPhone
                  })
                }

                resolve(newPhone)
              } else {
                console.log('❌ Телефон не получен после requestContact')
                resolve(getFallbackPhone())
              }
            }, 500)
          })
 //@ts-ignore
          if (!requestSent) {
            console.log('❌ Не удалось отправить запрос телефона')
            resolve(getFallbackPhone())
          }
        })
      } else {
        console.log('❌ requestContact недоступен')
        return getFallbackPhone()
      }

    } catch (error) {
      console.error('Ошибка при получении телефона:', error)
      return getFallbackPhone()
    }
  }

  const getFallbackPhone = (): string => {
    const fallbackPhone = '+79147275655'
    console.log('⚠️ Используем fallback телефон:', fallbackPhone)
    return fallbackPhone
  }

  const sendPhoneRequest = async () => {
    // Открываем попап в любом случае
    setOpenPopup(true)

    // Если данные уже есть, не делаем повторный запрос
    if (data !== null) {
      console.log('📊 Данные уже загружены, показываем попап')
      return
    }

    // Если данные пустые и не в процессе загрузки - делаем запрос
    if (data === null && !loading) {
      await requestPhoneAndData()
    }
  }

  const requestPhoneAndData = async () => {
    setError(null)
    setLoading(true)

    try {
      // Получаем телефон (из существующих данных или запрашиваем новый)
      const phone = await getUserPhone()

      // Загружаем данные с полученным телефоном
      await fetchDataWithPhone(phone)

    } catch (err: any) {
      setError(err.message)
      console.error('❌ Ошибка при загрузке данных:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchDataWithPhone = async (phone: string) => {
    setLoading(true)

    try {
      const response = await fetch('/api/tg-react-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Proto': 'https',
          'X-Forwarded-Ssl': 'on',
          'HTTPS': 'YES',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ phone })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      console.log('✅ Данные успешно загружены с телефоном:', phone)

    } catch (err: any) {
      setError(err.message)
      console.error('❌ Ошибка при загрузке данных:', err)
    } finally {
      setLoading(false)
    }
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
                      {userData?.phone || 'Не указан'}
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

              {/* Отображение загрузки или данных */}
              {loading ? (
                <Orders orderData={null} loading={loading} />
              ) : data ? (
                data.DATA.Data.map((order, index) => (
                  <Orders
                    key={`${order.SalesId}-${index}`}
                    orderData={order}
                    loading={loading}
                  />
                ))
              ) : error ? (
                <div className="error-message">
                  Ошибка загрузки: {error}
                </div>
              ) : null}
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
              <div className="user-phone-status">
                {userData.phone ? (
                  <span className="phone-verified">📱 Телефон: {userData.phone}</span>
                ) : (
                  <span className="phone-missing">📱 Телефон не указан</span>
                )}
              </div>
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