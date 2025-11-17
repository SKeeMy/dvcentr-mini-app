import React from 'react'
import clsx from 'clsx'
import { Remains } from '../pages/home/remains/remains'
import { useAuthStore } from '@/store/auth-store'
import { useRemainsStore } from '@/store/remains-store'

export const GetRemains = () => {
  const { user } = useAuthStore()
  const { data, isLoading } = useRemainsStore()

  return (
    <div className='popup_inner'>
      <h3 style={{textAlign: 'center'}}>Мои остатки</h3>
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
            <p className='popup__title'>Позиций</p>
          </div>}
        </div>
      </div>
      {data && data.DATA.Data.map((remain, index) => (
        <Remains
          key={`${remain.ItemId}-${remain.Company}-${index}`}
          remainData={remain}
          loading={isLoading}
        />
      ))}

      {data === null && isLoading &&
        <Remains
          remainData={null}
          loading={isLoading}
        />
      }
    </div>
  )
}