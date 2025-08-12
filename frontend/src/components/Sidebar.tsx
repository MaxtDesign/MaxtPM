import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Building2, 
  Users, 
  CreditCard, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Properties', href: '/properties', icon: Building2 },
    { name: 'Tenants', href: '/tenants', icon: Users },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className={`bg-white shadow-medium transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-primary-600">PropEase</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <nav className="mt-4 px-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''} ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              <Icon size={20} className="mr-3" />
              {!isCollapsed && item.name}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
