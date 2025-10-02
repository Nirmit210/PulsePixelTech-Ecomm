'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Eye,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0
    },
    recentOrders: [],
    topProducts: [],
    salesChart: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Simulate API call - replace with actual API
      const mockData = {
        overview: {
          totalRevenue: 125000,
          totalOrders: 1250,
          totalUsers: 850,
          totalProducts: 120
        },
        recentOrders: [
          { id: 1, customer: 'John Doe', amount: 299, status: 'completed', date: '2024-01-15' },
          { id: 2, customer: 'Jane Smith', amount: 199, status: 'pending', date: '2024-01-15' },
          { id: 3, customer: 'Bob Johnson', amount: 399, status: 'completed', date: '2024-01-14' },
        ],
        topProducts: [
          { name: 'Gaming Laptop', sales: 45, revenue: 67500 },
          { name: 'Wireless Headphones', sales: 120, revenue: 24000 },
          { name: 'Smartphone', sales: 80, revenue: 40000 },
        ],
        salesChart: [
          { date: '2024-01-08', sales: 1200 },
          { date: '2024-01-09', sales: 1800 },
          { date: '2024-01-10', sales: 1500 },
          { date: '2024-01-11', sales: 2200 },
          { date: '2024-01-12', sales: 1900 },
          { date: '2024-01-13', sales: 2500 },
          { date: '2024-01-14', sales: 2100 },
        ]
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your business performance</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${analytics.overview.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            change={12.5}
            changeType="positive"
          />
          <StatCard
            title="Total Orders"
            value={analytics.overview.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            change={8.2}
            changeType="positive"
          />
          <StatCard
            title="Total Users"
            value={analytics.overview.totalUsers.toLocaleString()}
            icon={Users}
            change={15.3}
            changeType="positive"
          />
          <StatCard
            title="Total Products"
            value={analytics.overview.totalProducts.toLocaleString()}
            icon={Package}
            change={5.1}
            changeType="positive"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.salesChart.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 rounded-t w-full"
                    style={{
                      height: `${(item.sales / Math.max(...analytics.salesChart.map(d => d.sales))) * 200}px`
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}