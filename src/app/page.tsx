'use client'
import './styles/global.scss'
import { useEffect, useState } from 'react'

interface UserData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code: string
  is_premium?: boolean
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const initializeWebApp = async () => {
      const WebApp = (await import('@twa-dev/sdk')).default
      
      if (WebApp.initDataUnsafe.user) {
        setUserData(WebApp.initDataUnsafe.user as UserData)
      }
    }

    initializeWebApp()
  }, [])

  if (userData) {
    return (
      <div>
        <h1>User Data</h1>
        <ul>
          <li>ID: {userData.id}</li>
          <li>First Name: {userData.first_name}</li>
          <li>Last Name: {userData.last_name}</li>
          <li>Username: {userData.username}</li>
          <li>Language Code: {userData.language_code}</li>
          <li>Is Premium: {userData.is_premium ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    )
  }

  return <div>Loading...</div>
}