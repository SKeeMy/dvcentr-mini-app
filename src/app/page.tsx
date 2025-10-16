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
import { init, requestContact, initData } from '@telegram-apps/sdk';

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
  const [isTelegramEnv, setIsTelegramEnv] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)

  // Функция для запроса номера телефона
  const requestPhoneNumber = async () => {
    console.log('=== НАЧАЛО ФУНКЦИИ requestPhoneNumber ===');
    
    try {
      console.log('1. Проверяем доступность requestContact.isAvailable()...');
      const isAvailable = requestContact.isAvailable();
      console.log('   requestContact.isAvailable() =', isAvailable);
      
      if (isAvailable) {
        console.log('2. requestContact доступен, начинаем запрос контакта...');
        
        console.log('3. Вызываем requestContact()...');
        const contactData = await requestContact();
        console.log('4. requestContact() завершился успешно');
        
        if (contactData && contactData.contact) {
          console.log('5. Контакт получен:', contactData.contact.phone_number);

          // Обновляем данные пользователя
          const updatedUserData = userData ? {
            ...userData,
            phone: contactData.contact.phone_number,
            first_name: contactData.contact.first_name || userData.first_name,
            last_name: contactData.contact.last_name || userData.last_name
          } : {
            id: contactData.contact.user_id,
            first_name: contactData.contact.first_name || 'User',
            last_name: contactData.contact.last_name,
            username: userData?.username,
            language_code: userData?.language_code || 'ru',
            is_premium: userData?.is_premium,
            phone: contactData.contact.phone_number
          };

          setUserData(updatedUserData);
          setAccessGranted(true);
          console.log('✅ Доступ предоставлен с номером:', contactData.contact.phone_number);
        }

        return contactData;
      } else {
        console.log('2. requestContact не доступен в текущем окружении');
        return null;
      }
    } catch (error) {
      console.error('=== ОШИБКА В ФУНКЦИИ requestPhoneNumber ===');
      console.error('Ошибка:', error);
      return null;
    } finally {
      console.log('=== ЗАВЕРШЕНИЕ ФУНКЦИИ requestPhoneNumber ===');
    }
  };

  useEffect(() => {
    const initializeWebApp = async () => {
      console.log('🚀 Начало инициализации WebApp с @telegram-apps/sdk...');
      try {
        // Инициализируем Telegram WebApp
        console.log('1. Инициализируем Telegram WebApp...');
        init();
        console.log('✅ Инициализация завершена');

        // Получаем данные инициализации
        console.log('2. Получаем initData...');

        //@ts-ignore
        const initDataValue = initData();
        console.log('   initData.user:', initDataValue?.user);

        // Проверяем, находимся ли мы в Telegram
        const isInTelegram = !!initDataValue?.user;
        console.log('🔍 Проверка окружения Telegram:', isInTelegram);
        setIsTelegramEnv(isInTelegram);

        // ГЛАВНАЯ ПРОВЕРКА: проверяем доступность requestContact
        console.log('3. Проверяем доступность requestContact.isAvailable()...');
        const isContactAvailable = requestContact.isAvailable();
        console.log('   requestContact.isAvailable() =', isContactAvailable);

        if (initDataValue?.user) {
          console.log('✅ Используем реальные данные Telegram пользователя');
          const telegramUser = initDataValue.user as UserData;
          setUserData(telegramUser);

          // Если requestContact доступен, сразу даем доступ
          if (isContactAvailable) {
            console.log('🎉 requestContact доступен - предоставляем полный доступ');
            setAccessGranted(true);
          } else {
            console.log('⚠️ requestContact недоступен - требуется ручной запрос');
            setAccessGranted(false);
          }
        } else {
          console.log('🔄 Используем моковые данные пользователя');
          const mockUser = mockUsers[currentMockIndex];
          setUserData(mockUser);
          
          // Вне Telegram тоже проверяем доступность
          if (isContactAvailable) {
            console.log('🎉 requestContact доступен - предоставляем полный доступ');
            setAccessGranted(true);
          } else {
            console.log('⚠️ requestContact недоступен - требуется ручной запрос');
            setAccessGranted(false);
          }
        }
      } catch (error) {
        console.log('❌ Ошибка инициализации Telegram SDK:', error);
        const mockUser = mockUsers[currentMockIndex];
        setUserData(mockUser);
        setIsTelegramEnv(false);
        setAccessGranted(false);
      } finally {
        console.log('⏳ Завершение загрузки...');
        setTimeout(() => {
          console.log('✅ Загрузка завершена');
          console.log('📊 Итоговый статус:', {
            accessGranted,
            isTelegramEnv,
            userData: userData?.first_name
          });
          setIsLoading(false);
        }, 1000);
      }
    };

    initializeWebApp();
  }, [currentMockIndex]);

  const sendPhoneRequest = async () => {
    console.log('📞 Вызов sendPhoneRequest...');
    setOpenPopup(true);
    setError(null);
    
    if (data === null) {
      setLoading(true);

      try {
        // Для запроса к API используем текущий номер или запрашиваем новый
        let phoneToSend = userData?.phone;

        // Если доступ не предоставлен, но есть номер - используем его
        if (!accessGranted && phoneToSend) {
          console.log('1. Используем существующий номер:', phoneToSend);
        } else if (!accessGranted && !phoneToSend) {
          console.log('1. Номер отсутствует, но доступ не предоставлен - используем моковый');
          phoneToSend = mockUsers[currentMockIndex]?.phone || '+79147275655';
        } else {
          console.log('1. Доступ предоставлен, используем номер:', phoneToSend);
        }

        console.log('2. Отправляем запрос к API с номером:', phoneToSend);
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
        console.log('3. API ответ получен');
        setData(result);
      } catch (err) {
        console.error('❌ Ошибка в sendPhoneRequest:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log('✅ sendPhoneRequest завершен');
      }
    } else {
      console.log('📊 Данные уже загружены, открываем popup');
      setOpenPopup(true);
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
            {accessGranted ? (
              <div className="access-badge granted">✅ Полный доступ предоставлен</div>
            ) : (
              <div className="access-badge restricted">⚠️ Требуется подтверждение номера</div>
            )}
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
              {!isTelegramEnv && (
                <div className="env-badge">🌐 Вне Telegram</div>
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
          {accessGranted ? (
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3 className="feature-title">Доступ открыт</h3>
              <p className="feature-description">Все функции доступны</p>
            </div>
          ) : (
            <div className="feature-card disabled">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Подтверждение</h3>
              <p className="feature-description">Требуется номер телефона</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="actions-container">
          <button 
            onClick={sendPhoneRequest} 
            className={clsx('action-button', accessGranted ? 'primary' : 'disabled')}
            disabled={!accessGranted}
          >
            {accessGranted ? 'Доступно по доверенности' : 'Требуется подтверждение номера'}
          </button>
          
          {/* Кнопка для запроса номера телефона показывается только если доступ не предоставлен */}
          {!accessGranted && (
            <button onClick={requestPhoneNumber} className="action-button secondary">
              Получить номер телефона
            </button>
          )}
        </div>

        {/* Информация о доступе */}
        {!accessGranted && (
          <div className="info-box">
            <h3>Для доступа к функциям приложения</h3>
            <p>Нажмите кнопку "Получить номер телефона" и разрешите доступ к вашему контакту</p>
          </div>
        )}
      </div>
    </Container>
  )
}