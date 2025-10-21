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
import { init, requestContact, initData, viewport, isTMA } from '@telegram-apps/sdk';

interface UserData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code: string
  is_premium?: boolean
  phone?: string
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false)
  const [isTelegramEnv, setIsTelegramEnv] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)
  
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

          const updatedUserData = {
            id: contactData.contact.user_id,
            first_name: contactData.contact.first_name || 'User',
            last_name: contactData.contact.last_name,
            language_code: 'ru',
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
        console.log('1. Инициализируем Telegram WebApp...');
        init();
        console.log('✅ Инициализация завершена');

        console.log('2. Получаем initData...');

        //@ts-ignore
        const initDataValue = initData();
        console.log('   initData.user:', initDataValue?.user);

        const isInTelegram = !!initDataValue?.user;
        console.log('🔍 Проверка окружения Telegram:', isInTelegram);
        setIsTelegramEnv(isInTelegram);

        console.log('3. Проверяем доступность requestContact.isAvailable()...');
        const isContactAvailable = requestContact.isAvailable();
        console.log('   requestContact.isAvailable() =', isContactAvailable);

        if (initDataValue?.user) {
          console.log('✅ Используем реальные данные Telegram пользователя');
          const telegramUser = initDataValue.user as UserData;
          setUserData(telegramUser);

          if (isContactAvailable) {
            console.log('🎉 requestContact доступен - предоставляем полный доступ');
            setAccessGranted(true);
          }
        }
      } catch (error) {
        console.log('❌ Ошибка инициализации Telegram SDK:', error);
        setIsTelegramEnv(false);
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
  }, []);

  const sendPhoneRequest = async () => {
    console.log('📞 Вызов sendPhoneRequest...');
    setOpenPopup(true);
    setError(null);
    
    if (data === null) {
      setLoading(true);

      try {
        const phoneToSend = userData?.phone;

        if (!phoneToSend) {
          throw new Error('Не удалось получить номер телефона');
        }

        console.log('1. Отправляем запрос к API с номером:', phoneToSend);
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
        console.log('2. API ответ получен');
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

  if (!accessGranted) {
    return (
      <Container>
        <div className="access-screen">
          {/* Header */}
          <header className="app-header">
            <div className="header-content">
              <h1 className="app-title">Приветствуем, DVCENTR.RU!👋</h1>
              <p className="app-subtitle">Наше мини приложение</p>
              <div className="access-badge restricted">⚠️ Требуется подтверждение доступа</div>
            </div>
            <div className="header-decoration">
              <div className="decoration-circle circle-1"></div>
              <div className="decoration-circle circle-2"></div>
            </div>
          </header>

          {/* Access Content */}
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
              📱 Предоставить доступ
            </button>

            <p className="access-note">
              Нажмите кнопку выше и разрешите доступ к вашему контакту в Telegram
            </p>
          </div>
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
                  background: `linear-gradient(135deg, #${userData?.id?.toString().slice(0, 6) || '000000'}, #${userData?.id?.toString().slice(3, 9) || 'ffffff'})`
                }}
              >
                {userData?.first_name?.[0]}{userData?.last_name?.[0] || ''}
              </div>
              {userData?.is_premium && (
                <div className="premium-badge">⭐</div>
              )}
            </div>
            <div className="user-info">
              <h2 className="user-name">
                {userData?.first_name} {userData?.last_name || ''}
              </h2>
              {userData?.username && (
                <p className="user-username">@{userData.username}</p>
              )}
              <div className="user-id">ID: {userData?.id}</div>
              {userData?.phone && (
                <div className="user-phone">📱 {userData.phone}</div>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{userData?.id?.toString().slice(0, 3) || '000'}</div>
              <div className="stat-label">Префикс</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userData?.language_code?.toUpperCase() || 'RU'}</div>
              <div className="stat-label">Язык</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {userData?.is_premium ? 'Yes' : 'No'}
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
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">Доступ открыт</h3>
            <p className="feature-description">Все функции доступны</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actions-container">
          <button 
            onClick={sendPhoneRequest} 
            className="action-button primary"
          >
            Доступно по доверенности
          </button>
        </div>
      </div>
    </Container>
  )
}