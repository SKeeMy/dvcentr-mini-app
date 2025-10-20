'use client'
import React from 'react'
import { FC, PropsWithChildren } from 'react'
import { Footer } from '../footer/footer'
import { Header } from '../header/header'
export const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      {/* <Header /> */}
        <main>{children}</main>
      <Footer />
    </>
  )
}

