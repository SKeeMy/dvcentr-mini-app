// components/app-provider.tsx
'use client'
import { useAuthStore } from '@/store/auth-store'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { init, initData, isTMA, requestContact } from '@telegram-apps/sdk'

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const { 
    user, 
    accessGranted, 
    isLoading, 
    setUser, 
    setAccessGranted, 
    setIsLoading, 
    fetchUserData,
    apiUserData 
  } = useAuthStore()
  
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (await isTMA()) {
          init()
          //@ts-ignore
          const initDataValue = initData()
          
          if (initDataValue?.user) {
            const telegramUser = initDataValue.user as any
            setUser(telegramUser)

            if (requestContact.isAvailable()) {
              setAccessGranted(true)
              
              // ВСЕГДА делаем запрос за данными пользователя при запуске
              // даже если у нас уже есть сохраненные данные
              if (telegramUser.phone) {
                console.log('🔄 Запрос актуальных данных пользователя...')
                await fetchUserData(telegramUser.phone)
              }
            }
          }
        }
      } catch (error) {
        console.error('Ошибка инициализации:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [setUser, setAccessGranted, setIsLoading, fetchUserData])

  // Дополнительно: периодически обновляем данные при смене страниц
  useEffect(() => {
    if (user?.phone && accessGranted) {
      // Можно добавить дебаунс или проверку времени последнего обновления
      console.log('🔄 Обновление данных пользователя при смене маршрута...')
      fetchUserData(user.phone)
    }
  }, [pathname, user?.phone, accessGranted, fetchUserData])

  useEffect(() => {
    if (isLoading) return

    if (!accessGranted && pathname !== '/') {
      router.replace('/')
      return
    }

    if (accessGranted && pathname === '/') {
      // Можно добавить автоматический редирект на каталог если нужно
      // router.replace('/catalog')
    }
  }, [accessGranted, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="telegram-loader">
          <div className="telegram-loader__spinner"></div>
          <p className="telegram-loader__text">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!accessGranted && pathname === '/') {
    return <AuthScreen />
  }

  if (!accessGranted) {
    return null
  }

  return <>{children}</>
}

function AuthScreen() {
  const { setUser, setAccessGranted, fetchUserData } = useAuthStore()

  const requestPhoneNumber = async () => {
    try {
      if (requestContact.isAvailable()) {
        const contactData = await requestContact()
        
        if (contactData?.contact) {
          const updatedUserData = {
            id: contactData.contact.user_id,
            first_name: contactData.contact.first_name || 'User',
            last_name: contactData.contact.last_name,
            language_code: 'ru',
            phone: contactData.contact.phone_number
          }

          setUser(updatedUserData)
          setAccessGranted(true)

          // Всегда запрашиваем данные после авторизации
          await fetchUserData(contactData.contact.phone_number)
        }
      }
    } catch (error) {
      console.error('Ошибка запроса контакта:', error)
    }
  }

  return (
    <div className="access-screen">
      <div className="access-content">
        <div className="access-icon">🔒</div>
        <h2 className="access-title">Доступ к приложению</h2>
        <p className="access-description">
          Для использования всех функций приложения необходимо предоставить доступ к вашему номеру телефона
        </p>

        <div className="access-features">
          <div className="access-feature">
            <span className="feature-icon">✅</span>
            <span className="feature-text">Безопасный доступ</span>
          </div>
          <div className="access-feature">
            <span className="feature-icon">✅</span>
            <span className="feature-text">Все функции приложения</span>
          </div>
          <div className="access-feature">
            <span className="feature-icon">✅</span>
            <span className="feature-text">Персональные предложения</span>
          </div>
        </div>

        <button
          onClick={requestPhoneNumber}
          className="access-button primary"
        >
          Поделиться номером 📱 
        </button>

        <p className="access-note">
          Нажмите кнопку выше и разрешите доступ к вашему контакту в Telegram
        </p>
      </div>
    </div>
  )
}