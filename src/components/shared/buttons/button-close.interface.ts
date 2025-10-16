import { ButtonHTMLAttributes, ReactNode } from "react";

export interface IButtonCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClose: () => void;
  children: ReactNode
  className?: string
}