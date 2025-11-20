'use client'
import React, { useEffect } from 'react'
import { FC, PropsWithChildren } from 'react'
import { Footer } from '../footer/footer'
import { Header } from '../header/header'
import clsx from "clsx";
import { golosTextFont, steppeFont } from "@/fonts/steppe/index";
import { init, requestContact, initData, viewport, isTMA, swipeBehavior, disableVerticalSwipes, backButton, miniApp, themeParams, isVerticalSwipesEnabled } from '@telegram-apps/sdk';
import { usePathname } from 'next/navigation'
import { AppProvider } from './providers/app-provider'
import Transition from './transtion'
import { AnimatePresence } from 'framer-motion'
import { Ordering } from '../ordering/ordering'
import NextTopLoader from 'nextjs-toploader'
export const RootLayout: FC<PropsWithChildren> = ({ children }) => {

  useEffect(() => {
    async function initTg() {
      if (await isTMA()) {
        init();

        if (!backButton.isSupported() || !miniApp.isSupported()) {
          throw new Error('ERR_NOT_SUPPORTED')
        }

        backButton.mount()

        await miniApp.mount();
        miniApp.bindCssVars();

        await themeParams.mount();
        themeParams.bindCssVars();
        if (viewport.mount.isAvailable()) {
          await viewport.mount();
          viewport.expand();
        }

        if (viewport.requestFullscreen.isAvailable()) {
          await viewport.requestFullscreen();
        }
        try {
          await viewport.mount();
          viewport.expand();
          viewport.bindCssVars();
        } catch (e) {
          console.error('Something went wrong mounting the viewport', e)
        }

        if (swipeBehavior.isSupported) {

          if (swipeBehavior.mount.isAvailable()) {
            await swipeBehavior.mount();
          }


          if (swipeBehavior.disableVertical.isAvailable()) {
            swipeBehavior.disableVertical();
          }

        }

        initData.restore();
      } else {
        console.log('Not in Telegram Mini Apps environment');
      }
    }

    initTg();
  }, []);


const pathname = usePathname()
  const onExitComplete = () => {
    window.scrollTo({ top: 0 })
  }
  return (
    <body className={clsx(golosTextFont.variable, steppeFont.variable, 'body_content')}>
      <NextTopLoader color='#f89633' />
      {/* <AppProvider> */}
        <Ordering />
        <Header header_type='catalog' />
        {/* <AnimatePresence initial={false} onExitComplete={onExitComplete} mode="wait"> */}
        <main><Transition>{children}</Transition></main>
        {/* </AnimatePresence> */}

        <Footer />
      {/* </AppProvider> */}
    </body>
  )
}

