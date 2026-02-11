import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import { DashboardCharts } from '@/components/DashboardCharts';
import { useAuth } from '@/hooks/useAuth';
import { Users, Stethoscope, CalendarDays, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { doctorAPI, patientAPI, appointmentAPI, billingAPI } from '@/services/api';

const Dashboard = () => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes, billingsRes] = await Promise.all([
          patientAPI.getAll().catch(() => ({ data: { data: { patients: [] } } })),
          doctorAPI.getAll().catch(() => ({ data: { data: { doctors: [] } } })),
          appointmentAPI.getAll().catch(() => ({ data: { data: { appointments: [] } } })),
          billingAPI.getAll().catch(() => ({ data: { data: { billings: [] } } }))
        ]);

        setStats({
          patients: patientsRes.data.data.patients?.length || 0,
          doctors: doctorsRes.data.data.doctors?.length || 0,
          appointments: appointmentsRes.data.data.appointments?.length || 0,
          revenue: billingsRes.data.data.billings?.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0) || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero Section with Background Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80"></div>
          </div>
          
          <div className="relative z-10 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
            <p className="text-white/90 text-lg">Here's what's happening with your healthcare today.</p>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Patients" value={stats.patients} icon={Users} trend="+12%" />
          <StatCard title="Total Doctors" value={stats.doctors} icon={Stethoscope} trend="+5%" />
          <StatCard title="Appointments" value={stats.appointments} icon={CalendarDays} trend="+18%" />
          <StatCard title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={DollarSign} trend="+23%" />
        </div>

        {/* Analytics Charts */}
        <DashboardCharts />

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity to display</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {role === 'admin' && (
                <>
                  <a href="/doctors" className="block p-3 rounded-lg hover:bg-accent transition-colors">
                    <p className="font-medium">Manage Doctors</p>
                    <p className="text-sm text-muted-foreground">Add or update doctor information</p>
                  </a>
                  <a href="/departments" className="block p-3 rounded-lg hover:bg-accent transition-colors">
                    <p className="font-medium">Manage Departments</p>
                    <p className="text-sm text-muted-foreground">Organize hospital departments</p>
                  </a>
                </>
              )}
              <a href="/appointments" className="block p-3 rounded-lg hover:bg-accent transition-colors">
                <p className="font-medium">View Appointments</p>
                <p className="text-sm text-muted-foreground">Check scheduled appointments</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
