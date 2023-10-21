import '@/styles/globals.css'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import {
  QueryClient,
  HydrationBoundary,
  QueryClientProvider
} from '@tanstack/react-query'

import Toaster from '@/components/ui/toaster'
import AuthChecker from '@/components/shared/auth-checker'

import { cn } from '@/utils'
import type { AppProps } from 'next/app'
import Footer from '@/components/layout/footer'
import Navbar from '@/components/layout/navbar'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

import 'dayjs/locale/es'

const inter = Inter({ subsets: ['latin'] })

dayjs.locale('es')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.tz.setDefault('America/Lima')

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <AuthChecker />
        <main
          className={cn(inter.className, 'relative flex min-h-screen flex-col')}
        >
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </main>
        <Toaster />
      </HydrationBoundary>
    </QueryClientProvider>
  )
}
