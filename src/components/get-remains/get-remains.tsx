import React from 'react'
import clsx from 'clsx'
import { Remains } from '../pages/home/remains/remains'
import { useAuthStore } from '@/store/auth-store'
import { useRemainsStore } from '@/store/remains-store'
import { Box } from '../shared/box/box'
import s from './get-remains.module.scss'
export const GetRemains = () => {
  const { user } = useAuthStore()
  const { data, isLoading } = useRemainsStore()

  const hasData = data && data.DATA && data.DATA.length > 0
  const isEmptyData = data && data.DATA && data.DATA.length === 0

  return (
    <div className='popup_inner'>
      <h3 style={{textAlign: 'center'}}>Мои остатки</h3>
      
      {hasData && data.DATA.map((remain, index) => (
        <Remains
          key={`${remain.ItemId}-${remain.Company}-${index}`}
          remainData={remain}
          loading={isLoading}
        />
      ))}
      
      {isEmptyData && (
        <Box className={s.empty}>
          <h3>У вас нет остатков</h3>
        </Box>
      )}

      {data === null && isLoading && (
        <Remains
          remainData={null}
          loading={isLoading}
        />
      )}

      {!data && !isLoading && (
        <Box>
          <h3>У вас нет остатков</h3>
        </Box>
      )}
    </div>
  )
}