import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { RootLayout } from '@/components/layouts/RootLayout'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { t } = useTranslation('home')

  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
          <p className="text-lg text-muted-foreground">{t('description')}</p>
        </div>
      </div>
    </RootLayout>
  )
}
