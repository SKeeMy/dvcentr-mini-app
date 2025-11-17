import React from 'react'
import s from './remains.module.scss'
import { FC } from 'react'
import { IRemainsProps } from './remains.interface'

export const Remains: FC<IRemainsProps> = (props) => {
  const { loading, remainData } = props

  if (loading || !remainData) {
    return (
      <div className={s.remains}>
        {[...Array(4)].map((_, index) => (
          <div key={index} className={s.remains_item}>
            <div className={`${s.skeleton_title} ${s.skeleton}`}></div>
            <div className={`${s.skeleton_text} ${s.skeleton}`}></div>
          </div>
        ))}
      </div>
    )
  } 

  return (
    <div className={s.remains}>
      <div className={s.remains_item}>
        <p className={s.remains_item_title}>Компания:</p>
        <p className={s.remains_item_text}>{remainData.Company}</p>
      </div>
      <div className={s.remains_item}>
        <p className={s.remains_item_title}>Продукт:</p>
        <p className={s.remains_item_text}>{remainData.ItemId}</p>
      </div>
      <div className={s.remains_item}>
        <p className={s.remains_item_title}>Завод:</p>
        <p className={s.remains_item_text}>{remainData.Factory}</p>
      </div>
      <div className={s.remains_item}>
        <p className={s.remains_item_title}>Количество:</p>
        <p className={s.remains_item_text}>{remainData.Qty} {remainData.UnitId}</p>
      </div>
      <div className={s.remains_item}>
        <p className={s.remains_item_title}>Способ доставки:</p>
        <p className={s.remains_item_text}>{remainData.DlvMode}</p>
      </div>
    </div>
  )
}