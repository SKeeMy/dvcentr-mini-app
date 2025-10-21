'use client'
import React, { useEffect } from 'react'
import { FC, PropsWithChildren } from 'react'
import { Footer } from '../footer/footer'
import { Header } from '../header/header'
import { init, requestContact, initData, viewport, isTMA, swipeBehavior, disableVerticalSwipes } from '@telegram-apps/sdk';
export const RootLayout: FC<PropsWithChildren> = ({ children }) => {

  useEffect(() => {
    async function initTg() {
      if (await isTMA()) {
        init();
  
        if (viewport.mount.isAvailable()) {
          await viewport.mount();
          viewport.expand();
          await swipeBehavior.disableVertical()
          disableVerticalSwipes()
        }
  
       
      }
    }
    initTg();
  }, []);
  return (
    <>
      {/* <Header /> */}
        <main>{children}</main>
      <Footer />
    </>
  )
}

