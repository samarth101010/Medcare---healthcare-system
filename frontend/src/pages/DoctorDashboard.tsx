import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { appointmentAPI, patientAPI, recordAPI } from '@/services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Users, CalendarDays, FileText, Clock, CheckCircle, XCircle, Activity, Stethoscope } from 'lucide-react';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, todayAppointments: 0, records: 0 });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const [appointmentsRes, patientsRes, recordsRes] = await Promise.all([
        appointmentAPI.getAll(),
        patientAPI.getAll(),
        recordAPI.getAll()
      ]);

      const appointments = appointmentsRes.data.data.appointments || [];
      const patients = patientsRes.data.data.patients || [];
      const records = recordsRes.data.data.records || [];

      const today = new Date().toDateString();
      const todayAppts = appointments.filter((a: any) => 
        new Date(a.appointmentDate).toDateString() === today
      );
      const pending = appointments.filter((a: any) => a.status === 'scheduled');

      setTodayAppointments(todayAppts);
      setPendingAppointments(pending);
      setRecentPatients(patients.slice(0, 5));

      setStats({
        patients: patients.length,
        appointments: appointments.length,
        todayAppointments: todayAppts.length,
        records: records.length
      });
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAppointment = async (id: string) => {
    try {
      await appointmentAPI.update(id, { status: 'confirmed' });
      toast.success('Appointment confirmed!');
      fetchDoctorData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to confirm appointment');
    }
  };

  const handleRejectAppointment = async (id: string) => {
    try {
      await appointmentAPI.update(id, { status: 'cancelled', cancelReason: 'Cancelled by doctor' });
      toast.success('Appointment cancelled');
      fetchDoctorData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      scheduled: 'bg-yellow-500',
      confirmed: 'bg-green-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-12">Loading doctor dashboard...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Doctor Header */}
        <div className="gradient-primary rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Doctor Portal</h1>
              <p className="text-white/80 text-lg">Manage your patients and appointments</p>
            </div>
            <Stethoscope className="h-16 w-16 opacity-20" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Patients</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.patients}</div>
              <p className="text-xs text-muted-foreground mt-1">Total patients</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
              <Clock className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground mt-1">Appointments today</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <CalendarDays className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.appointments}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingAppointments.length} pending</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.records}</div>
              <p className="text-xs text-muted-foreground mt-1">Total records</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Appointments */}
        {pendingAppointments.length > 0 && (
          <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Pending Appointments</CardTitle>
                  <p className="text-sm text-muted-foreground">{pendingAppointments.length} appointment(s) need your confirmation</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-4 bg-white dark:bg-background border rounded-lg shadow-sm">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">{appointment.appointmentId}</Badge>
                        <Badge className="bg-yellow-500">{appointment.status}</Badge>
                      </div>
                      <p className="font-medium">{appointment.reason}</p>
                      <p className="text-sm text-muted-foreground">
                        📅 {format(new Date(appointment.appointmentDate), 'PPP')} at {appointment.appointmentTime}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" onClick={() => handleApproveAppointment(appointment._id)} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRejectAppointment(appointment._id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No appointments scheduled for today</p>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayAppointments.map((appointment) => (
                      <TableRow key={appointment._id}>
                        <TableCell className="font-medium">{appointment.appointmentTime}</TableCell>
                        <TableCell>{appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}</TableCell>
                        <TableCell>{appointment.reason}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPatients.map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell className="font-mono text-sm">{patient.patientId}</TableCell>
                      <TableCell className="font-medium">{patient.user?.firstName} {patient.user?.lastName}</TableCell>
                      <TableCell>
                        {patient.bloodGroup ? <Badge variant="outline">{patient.bloodGroup}</Badge> : '-'}
                      </TableCell>
                      <TableCell className="text-sm">{patient.user?.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DoctorDashboard;
