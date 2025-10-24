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
  const { user } = useAuthStore()
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
        const phoneToSend = user?.phone;

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
            <div className="user-info">
              <h2 className="user-name">
                {user?.first_name} {user?.last_name || ''}
              </h2>
              {user?.username && (
                <p className="user-username">@{user.username}</p>
              )}

              {user?.phone && (
                <div className="user-phone">📱 {user.phone}</div>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <div className="actions-container">
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
            </div>
          </div>
        </div>

        <Link href={'/catalog'} className="action-button primary">
          Каталог
        </Link>



      </div>
    </Section>
  )
}