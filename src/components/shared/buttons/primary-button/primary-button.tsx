import { FC, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
interface BaseProps {
    buttonText: string
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
  buttonText, 
  href, 
  ...rest
}) => {
  if (href) {
      const { className, style, ...linkProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement>
      return (
          <Link 
              href={href}
              className={clsx('action-button primary', className)}
              style={style}
              {...linkProps}
          >
              {buttonText}
          </Link>
      )
  }

  const { className, style, ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
      <button 
          className={clsx('action-button primary', className)}
          style={style}
          {...buttonProps}
      >
          {buttonText}
      </button>
  )
}