import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardChartsProps {
  appointmentData?: any[];
  revenueData?: any[];
  statusData?: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const DashboardCharts = ({ appointmentData, revenueData, statusData }: DashboardChartsProps) => {
  // Default data if not provided
  const defaultAppointmentData = appointmentData || [
    { month: 'Jan', appointments: 45 },
    { month: 'Feb', appointments: 52 },
    { month: 'Mar', appointments: 48 },
    { month: 'Apr', appointments: 61 },
    { month: 'May', appointments: 55 },
    { month: 'Jun', appointments: 67 }
  ];

  const defaultRevenueData = revenueData || [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 }
  ];

  const defaultStatusData = statusData || [
    { name: 'Confirmed', value: 45 },
    { name: 'Scheduled', value: 30 },
    { name: 'Completed', value: 120 },
    { name: 'Cancelled', value: 15 }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Appointment Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={defaultAppointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Analytics (₹)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={defaultRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Appointment Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={defaultStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {defaultStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <span className="text-sm font-medium">Total Appointments</span>
              <span className="text-2xl font-bold text-blue-600">
                {defaultStatusData.reduce((sum, item) => sum + item.value, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <span className="text-sm font-medium">Total Revenue</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{defaultRevenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <span className="text-sm font-medium">Avg. per Month</span>
              <span className="text-2xl font-bold text-purple-600">
                {Math.round(defaultAppointmentData.reduce((sum, item) => sum + item.appointments, 0) / defaultAppointmentData.length)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-2xl font-bold text-orange-600">
                {Math.round((defaultStatusData.find(s => s.name === 'Completed')?.value || 0) / defaultStatusData.reduce((sum, item) => sum + item.value, 0) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
