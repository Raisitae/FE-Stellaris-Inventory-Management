import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { RootLayout } from '@/components/layouts/RootLayout'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { t } = useTranslation('index')
  return (
    <RootLayout>
      <div className="p-2">
        <h3>{t('welcome')}</h3>
      </div>
    </RootLayout>
  )
}
