'use client'
import React, { useEffect } from 'react'
import { FC, PropsWithChildren } from 'react'
import { Footer } from '../footer/footer'
import { Header } from '../header/header'
import { init, requestContact, initData, viewport, isTMA, swipeBehavior, disableVerticalSwipes, backButton, miniApp, themeParams } from '@telegram-apps/sdk';
export const RootLayout: FC<PropsWithChildren> = ({ children }) => {

  useEffect(() => {
    async function initTg() {
      if (await isTMA()) {
        init();

        if (!backButton.isSupported() || !miniApp.isSupported()) {
          throw new Error('ERR_NOT_SUPPORTED')
        }

        backButton.mount()

        miniApp.mount();
        miniApp.bindCssVars();

        themeParams.mount();
        themeParams.bindCssVars();
        void viewport
          .mount()
          .catch(e => {
            console.error('Something went wrong mounting the viewport', e)
          })
          .then(() => {
            viewport.bindCssVars()
          })
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

