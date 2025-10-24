'use client'
import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { accessGranted, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !accessGranted) {
      router.push('/')
    }
  }, [accessGranted, isLoading, router])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="telegram-loader">
          <div className="telegram-loader__spinner"></div>
          <p className="telegram-loader__text">Проверка доступа...</p>
        </div>
      </div>
    )
  }

  if (!accessGranted) {
    return null
  }

  return <>{children}</>
}