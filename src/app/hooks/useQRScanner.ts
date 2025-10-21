import { useEffect, useState } from 'react'
import { qrScanner, isTMA } from '@telegram-apps/sdk'

export const useQRScanner = () => {
  const [qrScanner, setQrScanner] = useState<ReturnType<typeof initQRScanner> | null>(null)
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    const initializeScanner = async () => {
      if (await isTMA()) {
        const scanner = initQRScanner()
        setQrScanner(scanner)

        // Слушаем изменения состояния
        scanner.on('change:isOpened', (value) => {
          setIsOpened(value)
        })
      }
    }

    initializeScanner()

    return () => {
      if (qrScanner) {
        qrScanner.close()
      }
    }
  }, [])

  const openScanner = async (options?: string | { text?: string; capture?: (data: string) => boolean }) => {
    if (!qrScanner) {
      console.error('QR Scanner not initialized')
      return null
    }

    try {
      const result = await qrScanner.open(options)
      console.log('QR scanned:', result)
      return result
    } catch (error) {
      console.error('QR Scanner error:', error)
      return null
    }
  }

  const closeScanner = () => {
    if (qrScanner) {
      qrScanner.close()
    }
  }

  return {
    openScanner,
    closeScanner,
    isOpened,
    isAvailable: !!qrScanner
  }
}