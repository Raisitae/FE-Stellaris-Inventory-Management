import { Link } from '@tanstack/react-router'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps){
  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/register" className="[&.active]:font-bold">
          Register
        </Link>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
        <Link to="/products" className="[&.active]:font-bold">
          Products
        </Link>
        <Link to="/products/add" className="[&.active]:font-bold">
          Add Product
        </Link>
        <Link to="/products/$id" params={{ id: '1' }} className="[&.active]:font-bold">
          Product 1
        </Link>
        <Link to="/reports" className="[&.active]:font-bold">
          Reports
        </Link>
        <Link to="/sales" className="[&.active]:font-bold">
          Sales
        </Link>
        <Link to="/backup" className="[&.active]:font-bold">
          Backup
        </Link>
      </div>
      <hr />
      {children}
    </>
  )
} 