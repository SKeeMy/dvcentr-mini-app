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

// Ключи для localStorage
const STORAGE_KEYS = {
  USER_PHONE: 'tg_user_phone',
  USER_DATA: 'tg_user_data'
};

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMockIndex, setCurrentMockIndex] = useState(0)
  const [data, setData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false)
  const [isTelegramEnv, setIsTelegramEnv] = useState(false)
  const [hasRequestedPhone, setHasRequestedPhone] = useState(false)

  // Функция для сохранения номера телефона в localStorage
  const savePhoneToStorage = (phone: string, userData: UserData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PHONE, phone);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      console.log('✅ Номер телефона сохранен в localStorage:', phone);
    } catch (error) {
      console.error('❌ Ошибка сохранения в localStorage:', error);
    }
  };

  // Функция для получения номера телефона из localStorage
  const getPhoneFromStorage = (): { phone: string | null; userData: UserData | null } => {
    try {
      const phone = localStorage.getItem(STORAGE_KEYS.USER_PHONE);
      const userDataStr = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      
      console.log('📱 Получен номер из localStorage:', phone);
      return { phone, userData };
    } catch (error) {
      console.error('❌ Ошибка чтения из localStorage:', error);
      return { phone: null, userData: null };
    }
  };

  // Функция для запроса номера телефона
  const requestPhoneNumber = async (forceRequest: boolean = false) => {
    console.log('=== НАЧАЛО ФУНКЦИИ requestPhoneNumber ===');
    
    // Проверяем, есть ли уже сохраненный номер
    const storedData = getPhoneFromStorage();
    
    if (!forceRequest && storedData.phone && storedData.userData) {
      console.log('✅ Используем сохраненный номер телефона:', storedData.phone);
      setUserData(storedData.userData);
      setHasRequestedPhone(true);
      return {
        contact: {
          user_id: storedData.userData.id,
          phone_number: storedData.phone,
          first_name: storedData.userData.first_name,
          last_name: storedData.userData.last_name
        },
        auth_date: new Date(),
        hash: 'stored_' + Date.now()
      };
    }

    // Логируем проверку доступности
    console.log('1. Проверяем доступность requestContact.isAvailable()...');
    const isAvailable = requestContact.isAvailable();
    console.log('   requestContact.isAvailable() =', isAvailable);
    
    try {
      if (isAvailable) {
        console.log('2. requestContact доступен, начинаем запрос контакта...');
        
        console.log('3. Вызываем requestContact()...');
        const contactData = await requestContact();
        console.log('4. requestContact() завершился успешно');
        
        // Логируем структуру объекта
        if (contactData && contactData.contact) {
          console.log('5. Контакт получен:', contactData.contact.phone_number);

          // Сохраняем номер телефона и обновляем данные пользователя
          if (contactData.contact) {
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
            savePhoneToStorage(contactData.contact.phone_number, updatedUserData);
            setHasRequestedPhone(true);
            
            console.log('✅ Данные пользователя обновлены и сохранены');
          }
        }

        return contactData;
      } else {
        console.log('2. requestContact не доступен в текущем окружении');
        
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
        
        console.log('3. Используем моковые данные:', mockContact.contact.phone_number);
        return mockContact;
      }
    } catch (error) {
      console.error('=== ОШИБКА В ФУНКЦИИ requestPhoneNumber ===');
      console.error('Ошибка:', error);
      
      // В случае ошибки пробуем использовать сохраненный номер
      if (storedData.phone && storedData.userData) {
        console.log('🔄 Используем сохраненный номер из-за ошибки');
        setUserData(storedData.userData);
        setHasRequestedPhone(true);
        
        return {
          contact: {
            user_id: storedData.userData.id,
            phone_number: storedData.phone,
            first_name: storedData.userData.first_name,
            last_name: storedData.userData.last_name
          },
          auth_date: new Date(),
          hash: 'fallback_' + Date.now()
        };
      }
      
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

        // Проверяем сохраненный номер телефона
        const storedData = getPhoneFromStorage();
        
        if (initDataValue?.user) {
          console.log('✅ Используем реальные данные Telegram пользователя');
          const telegramUser = initDataValue.user as UserData;
          
          // Если есть сохраненный номер, используем его вместе с данными Telegram
          if (storedData.phone && storedData.userData) {
            console.log('📱 Используем сохраненный номер телефона:', storedData.phone);
            const userWithPhone = {
              ...telegramUser,
              phone: storedData.phone,
              first_name: storedData.userData.first_name || telegramUser.first_name,
              last_name: storedData.userData.last_name || telegramUser.last_name
            };
            setUserData(userWithPhone);
            setHasRequestedPhone(true);
          } else {
            console.log('📱 Сохраненного номера нет, используем данные Telegram');
            setUserData(telegramUser);
          }
        } else {
          console.log('🔄 Используем моковые данные пользователя');
          const mockUser = mockUsers[currentMockIndex];
          
          // Если есть сохраненный номер, используем его
          if (storedData.phone && storedData.userData) {
            console.log('📱 Используем сохраненный номер с моковыми данными:', storedData.phone);
            setUserData({
              ...mockUser,
              phone: storedData.phone,
              first_name: storedData.userData.first_name || mockUser.first_name,
              last_name: storedData.userData.last_name || mockUser.last_name
            });
            setHasRequestedPhone(true);
          } else {
            setUserData(mockUser);
          }
        }
      } catch (error) {
        console.log('❌ Ошибка инициализации Telegram SDK:', error);
        const mockUser = mockUsers[currentMockIndex];
        
        // Пробуем использовать сохраненные данные даже при ошибке
        const storedData = getPhoneFromStorage();
        if (storedData.phone && storedData.userData) {
          setUserData(storedData.userData);
          setHasRequestedPhone(true);
        } else {
          setUserData(mockUser);
        }
        setIsTelegramEnv(false);
      } finally {
        console.log('⏳ Завершение загрузки...');
        setTimeout(() => {
          console.log('✅ Загрузка завершена');
          setIsLoading(false);
        }, 1000);
      }
    };

    initializeWebApp();
  }, [currentMockIndex]);

  // useEffect для автоматического запроса номера телефона при загрузке
  useEffect(() => {
    if (!isLoading && userData && isTelegramEnv && !hasRequestedPhone) {
      console.log('🏗️ Автоматический запрос номера телефона...');
      
      const timer = setTimeout(() => {
        console.log('⏰ Запрашиваем номер телефона...');
        requestPhoneNumber();
      }, 1000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoading, userData, isTelegramEnv, hasRequestedPhone]);

  const sendPhoneRequest = async () => {
    console.log('📞 Вызов sendPhoneRequest...');
    setOpenPopup(true);
    setError(null);
    
    if (data === null) {
      setLoading(true);

      try {
        // Получаем номер телефона (если еще не получен)
        let phoneToSend = userData?.phone;
        
        if (!phoneToSend) {
          console.log('1. Номер телефона отсутствует, запрашиваем...');
          const contactData = await requestPhoneNumber(true); // forceRequest = true
          phoneToSend = contactData?.contact?.phone_number;
        } else {
          console.log('1. Используем существующий номер:', phoneToSend);
        }

        if (!phoneToSend) {
          throw new Error('Не удалось получить номер телефона');
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

  // Функция для принудительного запроса номера (если пользователь хочет обновить)
  const forceRequestPhone = async () => {
    console.log('🔄 Принудительный запрос номера телефона...');
    await requestPhoneNumber(true);
  };

  // Остальной код компонента остается без изменений...
  // [здесь остается весь ваш JSX код]

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
          {/* @ts-ignore */}
          <button onClick={requestPhoneNumber} className="action-button secondary">
            Получить номер телефона
          </button>
        </div>
      </div>
    </Container>
  )
}