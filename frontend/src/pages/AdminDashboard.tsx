import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { appointmentAPI, doctorAPI, patientAPI, billingAPI, departmentAPI } from '@/services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Users, Stethoscope, CalendarDays, DollarSign, CheckCircle, XCircle, Clock, Building2, TrendingUp, Activity, AlertCircle, UserPlus, Edit, Trash2 } from 'lucide-react';
import { AppointmentForm } from '@/components/AppointmentForm';
import { DoctorForm } from '@/components/DoctorForm';
import { DepartmentForm } from '@/components/DepartmentForm';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, revenue: 0, departments: 0 });
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [appointmentsRes, doctorsRes, patientsRes, billingsRes, departmentsRes] = await Promise.all([
        appointmentAPI.getAll(),
        doctorAPI.getAll(),
        patientAPI.getAll(),
        billingAPI.getAll(),
        departmentAPI.getAll()
      ]);

      const appointments = appointmentsRes.data.data.appointments || [];
      const doctorsList = doctorsRes.data.data.doctors || [];
      const patientsList = patientsRes.data.data.patients || [];
      const billings = billingsRes.data.data.billings || [];
      const deptsList = departmentsRes.data.data.departments || [];

      setAllAppointments(appointments);
      setPendingAppointments(appointments.filter((a: any) => a.status === 'scheduled'));
      setDoctors(doctorsList);
      setPatients(patientsList);
      setDepartments(deptsList);

      setStats({
        patients: patientsList.length,
        doctors: doctorsList.length,
        appointments: appointments.length,
        revenue: billings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
        departments: deptsList.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAppointment = async (id: string) => {
    try {
      await appointmentAPI.update(id, { status: 'confirmed' });
      toast.success('Appointment approved!');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve appointment');
    }
  };

  const handleRejectAppointment = async (id: string) => {
    try {
      await appointmentAPI.update(id, { status: 'cancelled', cancelReason: 'Rejected by admin' });
      toast.success('Appointment rejected');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject appointment');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await doctorAPI.delete(id);
      toast.success('Doctor deleted');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const handleEditDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowDoctorForm(true);
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setShowDepartmentForm(true);
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentAPI.delete(id);
      toast.success('Department deleted');
      fetchAllData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete department');
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
        <div className="text-center py-12">Loading admin dashboard...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Admin Header with Gradient */}
        <div className="gradient-primary rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Control Panel</h1>
              <p className="text-white/80 text-lg">Complete system management and oversight</p>
            </div>
            <Activity className="h-16 w-16 opacity-20" />
          </div>
        </div>

        {/* Enhanced Stats Cards with Gradients */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.patients}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Active users
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Staff</CardTitle>
              <Stethoscope className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.doctors}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered doctors</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <CalendarDays className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.appointments}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingAppointments.length} pending</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">₹{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-background">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-5 w-5 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">{stats.departments}</div>
              <p className="text-xs text-muted-foreground mt-1">Active departments</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Appointments - Priority Alert Section */}
        {pendingAppointments.length > 0 && (
          <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Pending Approval Required</CardTitle>
                  <CardDescription>{pendingAppointments.length} appointment(s) waiting for your review</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingAppointments.slice(0, 5).map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-4 bg-white dark:bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleRejectAppointment(appointment._id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Advanced Management Tabs with Table View */}
        <Card>
          <Tabs defaultValue="appointments" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appointments" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="doctors" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctors
                </TabsTrigger>
                <TabsTrigger value="patients" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Patients
                </TabsTrigger>
                <TabsTrigger value="departments" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Departments
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="appointments" className="space-y-4 mt-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">Appointment Management</h3>
                    <p className="text-sm text-muted-foreground">View and manage all appointments</p>
                  </div>
                  <Button onClick={() => setShowAppointmentForm(true)} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    New Appointment
                  </Button>
                </div>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAppointments.map((appointment) => (
                        <TableRow key={appointment._id}>
                          <TableCell className="font-mono text-sm">{appointment.appointmentId}</TableCell>
                          <TableCell>{appointment.reason}</TableCell>
                          <TableCell>{format(new Date(appointment.appointmentDate), 'PP')} {appointment.appointmentTime}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {appointment.status === 'scheduled' && (
                              <div className="flex gap-1 justify-end">
                                <Button size="sm" variant="outline" onClick={() => handleApproveAppointment(appointment._id)}>
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleRejectAppointment(appointment._id)}>
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="doctors" className="space-y-4 mt-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">Doctor Management</h3>
                    <p className="text-sm text-muted-foreground">Manage medical staff and specialists</p>
                  </div>
                  <Button onClick={() => { setSelectedDoctor(null); setShowDoctorForm(true); }} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Doctor
                  </Button>
                </div>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.map((doctor) => (
                        <TableRow key={doctor._id}>
                          <TableCell className="font-medium">Dr. {doctor.user?.firstName} {doctor.user?.lastName}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.experience} years</TableCell>
                          <TableCell className="font-semibold">₹{doctor.consultationFee}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="outline" onClick={() => handleEditDoctor(doctor)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteDoctor(doctor._id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="patients" className="space-y-4 mt-0">
                <div>
                  <h3 className="text-xl font-semibold">Patient Records</h3>
                  <p className="text-sm text-muted-foreground">View all registered patients</p>
                </div>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Blood Group</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient._id}>
                          <TableCell className="font-mono text-sm">{patient.patientId}</TableCell>
                          <TableCell className="font-medium">{patient.user?.firstName} {patient.user?.lastName}</TableCell>
                          <TableCell>{patient.user?.email}</TableCell>
                          <TableCell>
                            {patient.bloodGroup ? <Badge variant="outline">{patient.bloodGroup}</Badge> : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="departments" className="space-y-4 mt-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">Department Management</h3>
                    <p className="text-sm text-muted-foreground">Organize hospital departments</p>
                  </div>
                  <Button onClick={() => { setSelectedDepartment(null); setShowDepartmentForm(true); }} className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Department
                  </Button>
                </div>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departments.map((dept) => (
                        <TableRow key={dept._id}>
                          <TableCell className="font-medium">{dept.name}</TableCell>
                          <TableCell>{dept.description}</TableCell>
                          <TableCell>{dept.location || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="outline" onClick={() => handleEditDepartment(dept)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteDepartment(dept._id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      <AppointmentForm open={showAppointmentForm} onClose={() => setShowAppointmentForm(false)} onSuccess={fetchAllData} />
      <DoctorForm 
        open={showDoctorForm} 
        onClose={() => { 
          setShowDoctorForm(false); 
          setSelectedDoctor(null); 
        }} 
        onSuccess={fetchAllData} 
        doctor={selectedDoctor}
      />
      <DepartmentForm 
        open={showDepartmentForm} 
        onClose={() => { 
          setShowDepartmentForm(false); 
          setSelectedDepartment(null); 
        }} 
        onSuccess={fetchAllData} 
        department={selectedDepartment}
      />
    </AppLayout>
  );
};

export default AdminDashboard;
