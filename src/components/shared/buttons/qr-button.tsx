'use client'
import { useQRScanner } from "@telegram-apps/sdk/dist/dts/scopes/components/qr-scanner/qr-scanner"

export const QRScannerButton = () => {
  const { 
    openScanner, 
    openScannerWithCapture, 
    closeScanner, 
    isOpened, 
    isLoading, 
    isAvailable 
  } = useQRScanner()

  const handleSimpleScan = async () => {
    const result = await openScanner({ 
      text: 'Наведите на QR-код' 
    })
    
    if (result) {
      console.log('Отсканирован QR:', result)
      alert(`QR код: ${result}`)
    } else {
      console.log('Сканер закрыт')
    }
  }

  const handleTelegramScan = async () => {
    const result = await openScannerWithCapture(
      'Наведите на Telegram QR',
      (qr) => qr.startsWith('https://t.me')
    )
    
    if (result) {
      console.log('Telegram ссылка:', result)
      alert(`Telegram: ${result}`)
    }
  }

  // Сканирование с кастомной логикой
  const handleCustomScan = async () => {
    const result = await openScanner({
      text: 'Сканируйте код товара',
      capture: (qr) => {
        // Проверяем что QR содержит ID товара
        return qr.startsWith('product:') || /^\d+$/.test(qr)
      }
    })
    
    if (result) {
      console.log('Код товара:', result)
      // Обрабатываем код товара
    }
  }

  if (!isAvailable) {
    return (
      <button className="action-button" disabled>
        QR-сканнер не доступен
      </button>
    )
  }

  return (
    <div className="qr-scanner-container">
      {/* Простой сканер */}
      <button 
        onClick={handleSimpleScan}
        className="action-button primary"
        disabled={isLoading || isOpened}
      >
        {isLoading ? 'Загрузка...' : 
         isOpened ? 'Сканируем...' : 'QR-сканнер'}
      </button>

      {/* Сканер для Telegram */}
      <button 
        onClick={handleTelegramScan}
        className="action-button secondary"
        disabled={isLoading || isOpened}
      >
        Telegram QR
      </button>

      {/* Кнопка закрытия */}
      {isOpened && (
        <button 
          onClick={closeScanner}
          className="action-button outline"
        >
          Закрыть сканер
        </button>
      )}
    </div>
  )
}