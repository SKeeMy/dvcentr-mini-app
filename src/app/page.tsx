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

  // Функция для запроса номера телефона с использованием @telegram-apps/sdk
  const requestPhoneNumber = async () => {
    console.log('=== НАЧАЛО ФУНКЦИИ requestPhoneNumber ===');
    
    // Логируем проверку доступности
    console.log('1. Проверяем доступность requestContact.isAvailable()...');
    const isAvailable = requestContact.isAvailable();
    console.log('   requestContact.isAvailable() =', isAvailable);
    console.log('   Тип результата:', typeof isAvailable);
    
    try {
      if (isAvailable) {
        console.log('2. requestContact доступен, начинаем запрос контакта...');
        
        console.log('3. Вызываем requestContact()...');
        const contactData = await requestContact();
        console.log('4. requestContact() завершился успешно');
        console.log('   Тип contactData:', typeof contactData);
        console.log('   contactData:', contactData);
        
        // Логируем структуру объекта
        if (contactData) {
          console.log('5. Анализируем структуру contactData:');
          console.log('   - contactData.contact:', contactData.contact);
          console.log('   - contactData.auth_date:', contactData.auth_date);
          console.log('   - contactData.hash:', contactData.hash);
          
          if (contactData.contact) {
            console.log('6. Детали contactData.contact:');
            console.log('   - user_id:', contactData.contact.user_id);
            console.log('   - phone_number:', contactData.contact.phone_number);
            console.log('   - first_name:', contactData.contact.first_name);
            console.log('   - last_name:', contactData.contact.last_name);
          } else {
            console.log('6. contactData.contact отсутствует');
          }
        } else {
          console.log('5. contactData пустой или undefined');
        }

        // Форматируем объект для красивого вывода в alert
        console.log('7. Форматируем объект для alert...');
        const formattedContact = JSON.stringify(contactData, null, 2);
        console.log('   formattedContact:', formattedContact);

        // Выводим объект в alert
        console.log('8. Показываем alert с данными контакта...');
        alert(`Полученные данные контакта:\n${formattedContact}`);

        console.log('9. Обновляем данные пользователя...');
        // Обновляем данные пользователя если нужно
        if (contactData.contact) {
          console.log('   - contactData.contact существует, обновляем userData');
          setUserData(prev => {
            const newUserData = prev ? {
              ...prev,
              phone: contactData.contact.phone_number,
              first_name: contactData.contact.first_name || prev.first_name,
              last_name: contactData.contact.last_name || prev.last_name
            } : null;
            console.log('   - Новый userData:', newUserData);
            return newUserData;
          });
        } else {
          console.log('   - contactData.contact отсутствует, пропускаем обновление');
        }

        console.log('10. Завершаем функцию, возвращаем contactData');
        return contactData;
      } else {
        console.log('2. requestContact не доступен в текущем окружении');
        console.log('3. Создаем моковые данные для демонстрации...');
        
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
        
        console.log('4. Моковые данные созданы:', mockContact);
        
        console.log('5. Форматируем моковые данные для alert...');
        const formattedMockContact = JSON.stringify(mockContact, null, 2);
        console.log('   formattedMockContact:', formattedMockContact);
        
        console.log('6. Показываем информационный alert...');
        alert('Функция запроса контакта не доступна в текущем окружении');

        console.log('7. Показываем alert с моковыми данными...');
        alert(`Моковые данные (requestContact не доступен):\n${formattedMockContact}`);

        console.log('8. Завершаем функцию, возвращаем mockContact');
        return mockContact;
      }
    } catch (error) {
      console.error('=== ОШИБКА В ФУНКЦИИ requestPhoneNumber ===');
      console.error('Тип ошибки:', typeof error);
      console.error('Сообщение ошибки:', error.message);
      console.error('Стек ошибки:', error.stack);
      console.error('Полный объект ошибки:', error);
      
      console.log('Показываем alert с ошибкой...');
      alert(`Ошибка при получении номера телефона: ${error.message}`);
      
      console.log('Завершаем функцию с ошибкой, возвращаем null');
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
        console.log('   initData:', initDataValue);
        console.log('   initData.state:', initDataValue?.state);
        console.log('   initData.user:', initDataValue?.user);

        // Проверяем, находимся ли мы в Telegram
        const isInTelegram = !!initDataValue?.user;
        console.log('🔍 Проверка окружения Telegram:', isInTelegram);
        setIsTelegramEnv(isInTelegram);

        if (initDataValue?.user) {
          console.log('✅ Используем реальные данные Telegram пользователя');
          const user = initDataValue.user as UserData;
          setUserData(user);
          console.log('   User data:', user);
        } else {
          console.log('🔄 Используем моковые данные пользователя');
          const mockUser = mockUsers[currentMockIndex];
          setUserData(mockUser);
          console.log('   Mock user:', mockUser);
        }
      } catch (error) {
        console.log('❌ Ошибка инициализации Telegram SDK:', error);
        const mockUser = mockUsers[currentMockIndex];
        setUserData(mockUser);
        setIsTelegramEnv(false);
      } finally {
        console.log('⏳ Устанавливаем таймер завершения загрузки...');
        setTimeout(() => {
          console.log('✅ Загрузка завершена, isLoading = false');
          setIsLoading(false);
        }, 1000);
      }
    };

    initializeWebApp();
  }, [currentMockIndex]);

  // useEffect для автоматического запроса номера телефона при загрузке
  useEffect(() => {
    if (!isLoading && userData) {
      console.log('🏗️ useEffect: приложение загружено, начинаем автоматический запрос...');
      console.log('isTelegramEnv:', isTelegramEnv);
      console.log('userData:', userData);
      
      // Запрашиваем номер только если мы в Telegram окружении
      if (isTelegramEnv) {
        const timer = setTimeout(() => {
          console.log('⏰ Таймер сработал, вызываем requestPhoneNumber...');
          requestPhoneNumber();
        }, 1500);
        
        return () => {
          console.log('🧹 Очистка таймера...');
          clearTimeout(timer);
        };
      } else {
        // Если не в Telegram, показываем информационное сообщение
        const timer = setTimeout(() => {
          console.log('🌐 Показываем сообщение о запуске вне Telegram...');
          alert(
            'Приложение запущено вне Telegram.\n\n' +
            'Для полноценной работы с функцией запроса номера телефона ' +
            'необходимо открыть это приложение через Telegram бота.'
          );
        }, 1000);
        
        return () => {
          console.log('🧹 Очистка таймера...');
          clearTimeout(timer);
        };
      }
    }
  }, [isLoading, userData, isTelegramEnv]);

  const sendPhoneRequest = async () => {
    console.log('📞 Вызов sendPhoneRequest...');
    setOpenPopup(true);
    setError(null);
    
    if (data === null) {
      setLoading(true);

      try {
        // Сначала получаем номер телефона
        console.log('1. Запрашиваем номер телефона...');
        const contactData = await requestPhoneNumber();
        const phoneToSend = contactData?.contact?.phone_number || userData?.phone || '79147275655';
        console.log('   Используемый номер:', phoneToSend);

        console.log('2. Отправляем запрос к API...');
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
        console.log('3. API ответ получен:', result);
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