'use client'
import React from 'react'
import s from './box.module.scss'
import clsx from 'clsx'
import { Container } from '@/components/container/container'
export const Box = ({ children, className }: { className?: string, children: React.ReactNode }) => {
  return (
    <Container className={s.container}>
      <div className={clsx(s.box, className)}>{children}</div>
    </Container>
  )
}
