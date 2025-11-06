import React from 'react'
import clsx from 'clsx'
import { Orders } from '../pages/home/orders/orders'
import { useAuthStore } from '@/store/auth-store'
import { useOrdersStore } from '@/store/orders-store'
export const GetOrder = () => {

  const { user } = useAuthStore()
  const { data, isLoading} = useOrdersStore()
  return (

    <div className='popup_inner'>
      <h3 style={{textAlign: 'center'}}>Доступно по доверенности</h3>
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
          loading={isLoading}
        />
      ))}

      {data === null && isLoading &&
        <Orders
          orderData={null}
          loading={isLoading}
        />
      }
    </div>
  )
}
