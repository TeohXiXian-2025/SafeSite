import './globals.css'
import { SafetyProvider } from './context/SafetyContext'

export const metadata = {
  title: 'SafeSite AI - Construction Safety Ecosystem',
  description: 'Powered by YTL AI Cloud',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SafetyProvider>
          {children}
        </SafetyProvider>
      </body>
    </html>
  )
}