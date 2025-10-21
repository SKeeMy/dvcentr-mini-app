import clsx from 'clsx'
import React from 'react'
import { PropsWithChildren } from 'react'
import { FC } from 'react'
import s from './container.module.scss'

export const Container = ({children, className}: {className?: string, children: React.ReactNode}) => {
  return (
    <div className={clsx('container', className)}>{children}</div>
  )
}
  // const [data, setData] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const sendPhoneRequest = async () => {
  //     setLoading(true);
  //     setError(null);
      
  //     try {
  //       const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://dvcentr.ru/api/tg-react-app/';
        
  //       const response = await fetch(proxyUrl, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-Forwarded-Proto': 'https',
  //           'X-Forwarded-Ssl': 'on',
  //           'HTTPS': 'YES',
  //           'X-Requested-With': 'XMLHttpRequest',
  //         },
  //         body: JSON.stringify({
  //           phone: '79241228364'
  //         })
  //       });
  
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  
  //       const result = await response.json();
  //       setData(result);
  //       console.log('test',data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  
  //   sendPhoneRequest();
  // }, []);