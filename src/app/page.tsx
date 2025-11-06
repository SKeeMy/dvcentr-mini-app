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
import { PrimaryButton } from '@/components/shared/buttons/primary-button/primary-button'
import { useFooterStore } from '@/store/footer-strore'
import { useOrdersStore } from '@/store/orders-store'

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
  const { user, apiUserData, userLoading, fetchUserData } = useAuthStore()
  const [error, setError] = useState<string | null>(null);

  const {openFooter} = useFooterStore()

  const { setLoading, setData, data} = useOrdersStore()


  useEffect(() => {
    console.log('📱 Home component mounted');
    
    if (user?.phone) {
      console.log('✅ Using existing phone:', user.phone);
      fetchUserData(user.phone);
    } else {
      console.log('🔄 Fetching user data without phone');
    }
  }, [user?.phone]);



  const sendPhoneRequest = async () => {
    console.log('📞 Вызов sendPhoneRequest...');
    openFooter('orders')
    setError(null);

    if (data === null) {
      setLoading(true);

      try {
        const phoneToSend = user?.phone ? user?.phone : '79147275655';
        // const phoneToSend ='79147275655';

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
      openFooter('orders');
    }
  };




  return (
    <Section name={null}>
      <div className="app-container">
        

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
          </div>

          <div className="profile-stats">
            {userLoading ? <div className='profile-stats-loading-wrapper'>
              <div className='profile-stats-loading'></div>
              <div className='profile-stats-loading'></div>
            </div> :

              apiUserData ? <div className="actions-container">
                <PrimaryButton onClick={() => openFooter('profile')} buttonText='Мой профиль' />
                <PrimaryButton onClick={sendPhoneRequest} buttonText='Доступно по доверенности' />
                <PrimaryButton onClick={sendPhoneRequest} buttonText='Мои остатки' />
              </div> : <div className="actions-container">
                <PrimaryButton onClick={() => openFooter('registration')} buttonText='Зарегистрироваться' />
                <p className="reg-description">
                  Для доступа ко всем функциям пройдите быструю регистрацию
                </p>
              </div>
            }


          </div>
        </div>

        <PrimaryButton href={'/catalog'} buttonText='Каталог' />
        



      </div>
    </Section>
  )
}