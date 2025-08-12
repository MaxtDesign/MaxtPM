import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page not found</h2>
          <p className="text-gray-600 mt-2">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <Link
          to="/"
          className="btn-primary inline-flex items-center"
        >
          <Home className="mr-2 h-4 w-4" />
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
