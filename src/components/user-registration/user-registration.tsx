import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Container } from '../container/container'
import { Input } from '../ui/input/Input'
import { Checkbox } from '../ui/checkbox/checkbox'
import s from './user-registration.module.scss'
import { PrimaryButton } from '../shared/buttons/primary-button/primary-button'
import { useAuthStore } from '@/store/auth-store'
import clsx from 'clsx'
import { useFooterStore } from '@/store/footer-strore'
import { Spinner } from '../ui/spinner/spinner'
import { userInfo } from 'os'

interface RegistrationForm {
  dadata_patronymic: string
  dadata_name: string
  dadata_surname: string
  USER_PHONE_NUMBER: string
  USER_EMAIL: string
  receivePromotions: boolean
  receiveNotifications: boolean
  agreeToTerms: boolean
}

export const UserRegistration = () => {
  const { user, fetchUserData } = useAuthStore();
  const { openFooter } = useFooterStore()
  const [isSubmiting, setSubmiting] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm<RegistrationForm>({
    defaultValues: {
      // receivePromotions: false,
      // receiveNotifications: false,
      // agreeToTerms: false,
      USER_PHONE_NUMBER: user?.phone || ''
    },
    mode: 'onBlur',

  })

  React.useEffect(() => {
    if (user?.phone) {
      setValue("USER_PHONE_NUMBER", user.phone)
    }
  }, [user?.phone, setValue])

  const onSubmit = async (data: RegistrationForm) => {
    setSubmiting(true)
    try {

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch('/api/tg-react-app/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Proto': 'https',
          'X-Forwarded-Ssl': 'on',
          'HTTPS': 'YES',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? '3C7D5B2F9A1E4D6C8B2A5F7E3D1C9B2A'}`
        },
        body: JSON.stringify({ ...data }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.MESSAGE === 'LINK_PHYS_SUCCESS' || result.MESSAGE === 'FISIC_SUCCESS') {
        alert('Аккаунт зарегистрирован!')
        fetchUserData(data.USER_PHONE_NUMBER)
        openFooter('profile')
        reset()
      }
      setSubmiting(false)
    } catch (error) {
      reset()
      console.error('Registration error:', error)
      if (error.name === 'AbortError') {
        alert('Запрос занял слишком много времени. Пожалуйста, попробуйте еще раз.')
      } else {
        alert('Произошла ошибка при регистрации')
      }
      setSubmiting(false)
    }
  }

  const agreeToTerms = watch('agreeToTerms')
  return (
    <Container className={s.container}>
      <div className={s.registration}>
        <h3 className={s.title}>Регистрация</h3>
        {isSubmiting && <Spinner className={s.loader} />}
        <form onSubmit={handleSubmit(onSubmit)} className={clsx(s.form, isSubmiting && s.disabled)}>
          <div className={s.formRow}>
            <Input<RegistrationForm>
              label="Фамилия"
              name="dadata_surname"
              register={register}
              error={errors.dadata_surname?.message}
              required={true}
              placeholder="Введите вашу фамилию"
            />
          </div>
          <Input<RegistrationForm>
            label="Имя"
            name="dadata_name"
            register={register}
            error={errors.dadata_name?.message}
            required={true}
            placeholder="Введите ваше имя"
          />

          <Input<RegistrationForm>
            label="Отчество"
            name="dadata_patronymic"
            register={register}
            error={errors.dadata_patronymic?.message}
            placeholder="Введите ваше отчество"
          />

          {(user?.phone === undefined || user?.phone === '' || user.phone === null) && <Input<RegistrationForm>
            label="Телефон"
            name="USER_PHONE_NUMBER"
            type="tel"
            register={register}
            error={errors.USER_PHONE_NUMBER?.message}
            required={true}
            placeholder="+7 (XXX) XXX-XX-XX"
            // disabled={true}
          />}

          <Input<RegistrationForm>
            label="Email"
            name="USER_EMAIL"
            type="email"
            register={register}
            error={errors.USER_EMAIL?.message}
            required={true}
            placeholder="example@mail.ru"
            validation={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Введите корректный email адрес"
              }
            }}
          />

          <div className={s.checkboxGroup}>
            {/* <Checkbox<RegistrationForm>
              label="Получать уведомления об акциях и специальных предложениях"
              name="receivePromotions"
              register={register}
            />


             */}
             <Checkbox<RegistrationForm>
              label={`Я подтверждаю свою дееспособность, а также даю согласие на <a target="_blank" href="https://dvcentr.ru/privacypolicy/">обработку моих персональных данных</a>`}
              name="agreeToTerms"
              register={register}
              error={errors.agreeToTerms?.message}
              required={true}
            />
          </div>

          <PrimaryButton
            type="submit"
            className={s.submitButton}
          >{isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}</PrimaryButton>
        </form>
      </div>
    </Container>
  )
}