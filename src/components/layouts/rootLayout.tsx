import React from 'react'
import { FC, PropsWithChildren } from 'react'
export const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header></header>
        <main>{children}</main>
      <footer></footer>
    </>
  )
}

