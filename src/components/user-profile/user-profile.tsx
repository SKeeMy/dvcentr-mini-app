import { useAuthStore } from '@/store/auth-store'
import { useFooterStore } from '@/store/footer-strore'
import React from 'react'
import { Container } from '../container/container'
import s from './user-profile.module.scss'




export const UserProfile = () => {
  const { apiUserData, userLoading } = useAuthStore()
  const { openFooter } = useFooterStore()
  if (userLoading) {
    return (
      <div className={s.wrapper_skeleton}>

        <div className={s.user_profile_card_box_loading}></div>
        <div className={s.user_profile_card_box_loading}></div>

      </div>
    )


  }

  if (!apiUserData) {
    return <div className={s.user_profile_card}>
      <Container>
        <div className={s.user_profile_card_box}> <h3>Персональные данные отсутствуют</h3><button onClick={() => openFooter('registration')} className='action-button primary'>Зарегистрироваться</button></div>
      </Container>
    </div>
  }
  return (
    <div className={s.user_profile_card}>
      <Container>
        <h3>Персональные данные</h3>
        <div className={s.user_profile_card_box}>
          {apiUserData?.name && <div className={s.user_profile_card_row}>
            <span className={s.user_profile_card_row_label}>Имя</span>
            <span className={s.user_profile_card_row_value}>{apiUserData?.name}</span>
          </div>}
          {apiUserData?.second_name && <div className={s.user_profile_card_row}>
            <span className={s.user_profile_card_row_label}>Фамилия</span>
            <span className={s.user_profile_card_row_value}>{apiUserData?.second_name}</span>
          </div>}
          {apiUserData?.last_name && <div className={s.user_profile_card_row}>
            <span className={s.user_profile_card_row_label}>Отчество</span>
            <span className={s.user_profile_card_row_value}>{apiUserData?.last_name}</span>
          </div>}
        </div>
        <div className={s.user_profile_card_box}>
          {apiUserData?.personal_phone && <div className={s.user_profile_card_row}>
            <span className={s.user_profile_card_row_label}>Телефон</span>
            <span className={s.user_profile_card_row_value}>+{apiUserData?.personal_phone}</span>
          </div>}
          {apiUserData?.email && <div className={s.user_profile_card_row}>
            <span className={s.user_profile_card_row_label}>Электронная почта</span>
            <span className={s.user_profile_card_row_value}>{apiUserData?.email}</span>
            {apiUserData?.email_approved == "1" && <span style={{ color: 'green' }} className={s.user_profile_card_row_label}>Подтвержден</span>}
          </div>}

        </div>
      </Container>
    </div>
  )
}
