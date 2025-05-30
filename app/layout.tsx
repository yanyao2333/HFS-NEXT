import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import Providers from './provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-CN'>
      <head>
        <link
          rel='icon'
          href='/favicon.ico'
          sizes='any'
        />
        {/*for OG protocol*/}
        <meta
          property='description'
          content='Next generation frontend for haofenshu.com'
        />
        <meta
          property='og:title'
          content='HFS NEXT - 下一代好分数'
        />
        <meta
          property='og:description'
          content='Next generation frontend for haofenshu.com'
        />
        <meta
          property='twitter:card'
          content='summary_large_image'
        />
        <title>HFS NEXT - 下一代好分数</title>
      </head>
      <body>
        <Providers>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
