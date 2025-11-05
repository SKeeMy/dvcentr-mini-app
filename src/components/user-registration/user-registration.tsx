import React from 'react'
import { useForm } from 'react-hook-form'
import { Container } from '../container/container'
import { Input } from '../ui/input/Input'
import { Checkbox } from '../ui/checkbox/checkbox'
import s from './user-registration.module.scss'
import { PrimaryButton } from '../shared/buttons/primary-button/primary-button'
import { useAuthStore } from '@/store/auth-store'

interface RegistrationForm {
  lastName: string
  firstName: string
  middleName: string
  phone: string
  email: string
  receivePromotions: boolean
  receiveNotifications: boolean
  agreeToTerms: boolean
}

export const UserRegistration = () => {
  const { user } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<RegistrationForm>({
    defaultValues: {
      receivePromotions: false,
      receiveNotifications: false,
      agreeToTerms: false,
      phone: user?.phone || ''
    },
    mode: 'onBlur'
  })

  React.useEffect(() => {
    if (user?.phone) {
      setValue('phone', user.phone)
    }
  }, [user?.phone, setValue])

  const onSubmit = async (data: RegistrationForm) => {
    try {
      console.log('Registration data:', data)
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Регистрация успешно завершена!')
    } catch (error) {
      console.error('Registration error:', error)
      alert('Произошла ошибка при регистрации')
    }
  }

  const agreeToTerms = watch('agreeToTerms')

  return (
    <Container className={s.container}>
      <div className={s.registration}>
        <h3 className={s.title}>Регистрация</h3>

        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <div className={s.formRow}>
            <Input<RegistrationForm>
              label="Фамилия"
              name="lastName"
              register={register}
              error={errors.lastName?.message}
              required={true}
              placeholder="Введите вашу фамилию"
            />
          </div>
          <Input<RegistrationForm>
              label="Имя"
              name="firstName"
              register={register}
              error={errors.firstName?.message}
              required={true}
              placeholder="Введите ваше имя"
            />

          <Input<RegistrationForm>
            label="Отчество"
            name="middleName"
            register={register}
            error={errors.middleName?.message}
            placeholder="Введите ваше отчество"
          />

          <Input<RegistrationForm>
            label="Телефон"
            name="phone"
            type="tel"
            register={register}
            error={errors.phone?.message}
            required={true}
            placeholder="+7 (XXX) XXX-XX-XX"
            disabled={true}
          />

          <Input<RegistrationForm>
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email?.message}
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
            <Checkbox<RegistrationForm>
              label="Получать уведомления об акциях и специальных предложениях"
              name="receivePromotions"
              register={register}
            />
            
            
            <Checkbox<RegistrationForm>
              label="Я согласен на обработку персональных данных"
              name="agreeToTerms"
              register={register}
              error={errors.agreeToTerms?.message}
              required={true}
            />
          </div>

          <PrimaryButton 
            buttonText={isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'} 
            type="submit"
            className={s.submitButton}
            disabled={!agreeToTerms || isSubmitting}
          />
        </form>
      </div>
    </Container>
  )
}