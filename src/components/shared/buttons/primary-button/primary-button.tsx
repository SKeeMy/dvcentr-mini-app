import { FC, ButtonHTMLAttributes, AnchorHTMLAttributes, Children } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
interface BaseProps {
    children: React.ReactNode
    href?: string  
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never 
}

type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string  
}

type PrimaryButtonProps = ButtonProps | LinkProps

export const PrimaryButton: FC<PrimaryButtonProps> = ({

  href, 
  ...rest
}) => {
  if (href) {
      const { className, style, children, ...linkProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement>
      return (
          <Link 
              href={href}
              className={clsx('action-button primary', className)}
              style={style}
              {...linkProps}
          >
              {children}
          </Link>
      )
  }

  const { className, style, children, ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
      <button 
          className={clsx('action-button primary', className)}
          style={style}
          {...buttonProps}
      >
          {children}
      </button>
  )
}