import React from 'react'
import { FC } from 'react'
import { Container } from '../container/container'
import s from './section.module.scss'
import clsx from 'clsx'
export const Section = ({children, name, className}: {children: React.ReactNode, name: string | null, className?: string}) => {
  return (
    <section className={clsx(s.section, className)}>
      {name && <div className={s.section_name}>{name}</div>}
        <Container>
          {children}
        </Container>
    </section>
  )
}
