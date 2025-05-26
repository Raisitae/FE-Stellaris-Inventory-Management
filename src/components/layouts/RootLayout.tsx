import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  const { t } = useTranslation('common')

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
        <div className="container mx-auto px-4">
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link 
                to="/" 
                className="text-xl font-bold text-foreground hover:text-primary transition-colors"
              >
                Stellaris
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  asChild 
                  className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 transition-all duration-200 hover:scale-105"
                >
                  <Link to="/products">{t('products')}</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 transition-all duration-200 hover:scale-105"
                >
                  <Link to="/sales">{t('sales')}</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 transition-all duration-200 hover:scale-105"
                >
                  <Link to="/backup">{t('backup')}</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                asChild 
                className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 transition-all duration-200 hover:scale-105"
              >
                <Link to="/login">{t('login')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  )
} 