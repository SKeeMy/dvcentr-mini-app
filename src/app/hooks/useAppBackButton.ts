import { backButton } from '@telegram-apps/sdk' 
import { useEffect } from 'react'

export const useAppBackButton = (handler: () => void) => {
  useEffect(() => {
    backButton.onClick(handler)

    return () => {
      backButton.offClick(handler)
    }
  }, [backButton])

  return {
    isVisible: backButton.isVisible,
    showButton: backButton.show.bind(backButton),
    hideButton: backButton.hide.bind(backButton)
  }
}