import React from 'react'
import s from './profile.module.scss'
import { Profile as Icon } from '@/components/shared/icons/profile'
import Link from 'next/link'
export const Profile = () => {
  return (
    <Link className={s.profile} href={'/profile'}>
        <Icon />
    </Link>
  )
}
