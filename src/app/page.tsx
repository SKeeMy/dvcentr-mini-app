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
import { BannerSlider } from '@/components/pages/banner-slider/banner-slider'
import { Section } from '@/components/section/section'
import { useAuthStore } from '@/store/auth-store'

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
  const { user, apiUserData, userLoading } = useAuthStore()
  const [data, setData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openPopup, setOpenPopup] = useState<boolean>(false)






  const sendPhoneRequest = async () => {
    console.log('📞 Вызов sendPhoneRequest...');
    setOpenPopup(true);
    setError(null);

    if (data === null) {
      setLoading(true);

      try {
        const phoneToSend = user?.phone ? user?.phone : '79147275655';

        if (!phoneToSend) {
          throw new Error('Не удалось получить номер телефона');
        }

        console.log('1. Отправляем запрос к API с номером:', phoneToSend);


        const response = await fetch('/api/tg-react-app/get-order-phone', {
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




  return (
    <Section name={null}>
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
                      {user?.phone || 'Номер не получен'}
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

        <BannerSlider />

        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-container">


            </div>
            {!apiUserData ?
              <div className="user-info">
                <h2 className="user-name">
                  {userLoading ? <span className='skeleton-text-loading'></span> : `Здравствуйте,  ${user?.first_name}!👋`}

                </h2>
              </div> :
              <div className="user-info">
                <h2 className="user-name">
                  {userLoading ? <span className='skeleton-text-loading'></span> : `  Здравствуйте,  ${apiUserData.name}!👋`}

                </h2>
              </div>
            }


            {/* {apiUserData && (
              <div className="api-user-data">
                <h3>Данные из системы:</h3>
                <div className="api-data-grid">
                  <div className="api-data-item">
                    <strong>Bitrix ID:</strong> {apiUserData.bitrix_id}
                  </div>
                  <div className="api-data-item">
                    <strong>Имя:</strong> {apiUserData.name}
                  </div>
                  <div className="api-data-item">
                    <strong>Фамилия:</strong> {apiUserData.last_name}
                  </div>
                  <div className="api-data-item">
                    <strong>Отчество:</strong> {apiUserData.second_name}
                  </div>
                  <div className="api-data-item">
                    <strong>Email:</strong> {apiUserData.email}
                  </div>
                  <div className="api-data-item">
                    <strong>Телефон:</strong> {apiUserData.personal_phone}
                  </div>
                </div>
              </div>
            )} */}
          </div>

          <div className="profile-stats">
            {userLoading ? <div className='profile-stats-loading-wrapper'>
              <div className='profile-stats-loading'></div>
              <div className='profile-stats-loading'></div>
            </div> :

              apiUserData ? <div className="actions-container">

                <button
                  onClick={sendPhoneRequest}
                  className="action-button primary"
                >
                  Доступно по доверенности
                </button>
                <button
                  onClick={sendPhoneRequest}
                  className="action-button primary"
                >
                  Мои остатки
                </button>
              </div> : <div className="actions-container">
                <button
                  onClick={sendPhoneRequest}
                  className="action-button primary"
                >
                  Зарегистрироваться
                </button>
                <p className="reg-description">
                  Для доступа ко всем функциям пройдите быструю регистрацию
                </p>
              </div>
            }


          </div>
        </div>

        <Link href={'/catalog'} className="action-button primary">
          Каталог
        </Link>



      </div>
    </Section>
  )
}