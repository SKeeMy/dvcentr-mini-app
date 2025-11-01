'use client'
import React from 'react'
import s from './spinner.module.scss'
import clsx from 'clsx'

export const Spinner = ({ className }: { className?: string }) => {
  return <div className={className}><span className={clsx(s.loader)} /></div>
}
