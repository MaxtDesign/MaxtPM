import { Building2, Users, CreditCard, TrendingUp } from 'lucide-react'

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Properties',
      value: '12',
      icon: Building2,
      change: '+2',
      changeType: 'positive' as const,
    },
    {
      name: 'Active Tenants',
      value: '8',
      icon: Users,
      change: '+1',
      changeType: 'positive' as const,
    },
    {
      name: 'Monthly Revenue',
      value: '$24,500',
      icon: CreditCard,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Occupancy Rate',
      value: '92%',
      icon: TrendingUp,
      change: '+3%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your property management business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">from last month</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-success-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-success-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Rent payment received</p>
                <p className="text-sm text-gray-600">John Doe paid $1,200 for 123 Main St</p>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New property added</p>
                <p className="text-sm text-gray-600">456 Oak Ave has been added to your portfolio</p>
              </div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-warning-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-warning-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New tenant application</p>
                <p className="text-sm text-gray-600">Jane Smith applied for 789 Pine St</p>
              </div>
              <div className="text-sm text-gray-500">2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
