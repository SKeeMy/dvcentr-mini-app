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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sendPhoneRequest = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const proxyUrl = 'https://dvcentr.ru/api/tg-react-app/';
        
        const response = await fetch(proxyUrl, {
          method: 'POST',
          // mode: "no-cors",
          headers: {
            'Content-Type': 'application/json',
            'X-Forwarded-Proto': 'https',
            'X-Forwarded-Ssl': 'on',
            'HTTPS': 'YES',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            phone: '79241228364'
          })
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        setData(result);
        console.log('test',data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    sendPhoneRequest();
  }, []);

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