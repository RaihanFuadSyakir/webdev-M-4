import '@/app/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function UnloggedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-black`}>
        <div className='min-h-screen min-w-screen bg-slate-100'>
        {children}
        </div>
        </body>
    </html>
  )
}