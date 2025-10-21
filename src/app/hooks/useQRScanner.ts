import { useEffect, useState } from 'react'
import { qrScanner, isTMA } from '@telegram-apps/sdk'

export const useQRScanner = () => {
  const [isOpened, setIsOpened] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = qrScanner.isOpened.subscribe(setIsOpened)
    
    return () => {
      unsubscribe()
    }
  }, [])

  const openScanner = async (options?: { 
    text?: string; 
    capture?: (qr: string) => boolean 
  }) => {
    if (!(await isTMA())) {
      console.error('QR Scanner available only in Telegram Mini Apps')
      return null
    }

    if (!qrScanner.isSupported) {
      console.error('QR Scanner is not supported')
      return null
    }

    if (qrScanner.isOpened) {
      console.error('QR Scanner is already opened')
      return null
    }

    setIsLoading(true)

    try {
      if (qrScanner.open.isAvailable()) {
        const result = await qrScanner.open(options)
        console.log('QR Scanner result:', result)
        return result
      } else {
        console.error('QR Scanner open method is not available')
        return null
      }
    } catch (error) {
      console.error('QR Scanner error:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const openScannerWithCapture = async (text: string, captureFn: (qr: string) => boolean) => {
    return openScanner({ text, capture: captureFn })
  }

  const closeScanner = () => {
    if (qrScanner.close.isAvailable() && qrScanner.isOpened) {
      qrScanner.close()
    }
  }

  return {
    openScanner,
    openScannerWithCapture,
    closeScanner,
    isOpened,
    isLoading,
    isAvailable: qrScanner.isSupported
  }
}