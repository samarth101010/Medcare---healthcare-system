import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { appointmentAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AppointmentForm } from '@/components/AppointmentForm';

const Appointments = () => {
  const { role } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await appointmentAPI.getAll();
      setAppointments(data.data.appointments || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      scheduled: 'bg-blue-500',
      confirmed: 'bg-green-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      await appointmentAPI.delete(id);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await appointmentAPI.update(id, { status: 'confirmed' });
      toast.success('Appointment approved!');
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve appointment');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this appointment?')) return;
    
    try {
      await appointmentAPI.update(id, { status: 'cancelled', cancelReason: 'Rejected by admin' });
      toast.success('Appointment rejected');
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject appointment');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=2070&auto=format&fit=crop)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-teal-800/90 to-cyan-900/85"></div>
          </div>
          
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Appointments</h1>
                <p className="text-white/90 text-lg">Manage your healthcare appointments</p>
              </div>
              <Button onClick={() => { setSelectedAppointment(null); setShowForm(true); }} className="bg-white text-primary hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No appointments found</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Book Your First Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{appointment.appointmentId}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                      <p className="text-sm">
                        {format(new Date(appointment.appointmentDate), 'PPP')} at {appointment.appointmentTime}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {role === 'admin' && appointment.status === 'scheduled' ? (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(appointment._id)} 
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleReject(appointment._id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(appointment)}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(appointment._id)}>Cancel</Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AppointmentForm
        open={showForm}
        onClose={() => { setShowForm(false); setSelectedAppointment(null); }}
        onSuccess={fetchAppointments}
        appointment={selectedAppointment}
      />
    </AppLayout>
  );
};

export default Appointments;
