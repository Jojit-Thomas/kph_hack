'use client';
import { DollarSign, Eye, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, change, changeType, icon }: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${getChangeColor()} mt-1`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface AdminMetricsProps {
  loading?: boolean;
  metrics?: {
    totalProducts: number;
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    revenueChange: string;
    ordersChange: string;
    storeViews: number;
    conversionRate: number;
  };
}

const AdminMetrics = ({ loading = false, metrics }: AdminMetricsProps) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const defaultMetrics = {
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    revenueChange: '+0% from last month',
    ordersChange: '+0% from last month',
    storeViews: 0,
    conversionRate: 0,
  };

  const data = metrics || defaultMetrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <MetricCard
        title="Total Products"
        value={data.totalProducts}
        icon={<Package className="h-4 w-4" />}
      />
      <MetricCard
        title="Total Revenue"
        value={`$${data.totalRevenue.toLocaleString()}`}
        change={data.revenueChange}
        changeType={data.revenueChange.includes('+') ? 'positive' : 'negative'}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricCard
        title="Total Orders"
        value={data.totalOrders}
        change={data.ordersChange}
        changeType={data.ordersChange.includes('+') ? 'positive' : 'negative'}
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      <MetricCard
        title="Customers"
        value={data.totalCustomers}
        icon={<Users className="h-4 w-4" />}
      />
      <MetricCard
        title="Store Views"
        value={data.storeViews}
        icon={<Eye className="h-4 w-4" />}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${data.conversionRate}%`}
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </div>
  );
};

export default AdminMetrics;