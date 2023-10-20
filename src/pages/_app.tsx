import '@/styles/globals.css'

import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Toaster from '@/components/ui/toaster'
import type { AppProps } from 'next/app'

const client = new QueryClient()
const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={client}>
      <main
        className={inter.className + ' relative flex min-h-screen flex-col'}
      >
        <Component {...pageProps} />
      </main>
      <Toaster />
    </QueryClientProvider>
  )
}
