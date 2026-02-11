import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { doctorAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Search, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { DoctorForm } from '@/components/DoctorForm';
import { DoctorDetailsDialog } from '@/components/DoctorDetailsDialog';
import { AppointmentForm } from '@/components/AppointmentForm';

const Doctors = () => {
  const { role } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await doctorAPI.getAll();
      setDoctors(data.data.doctors || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowDetails(true);
  };

  const handleBookAppointment = () => {
    setShowDetails(false);
    setShowAppointmentForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await doctorAPI.delete(id);
      toast.success('Doctor deleted');
      fetchDoctors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete doctor');
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
              backgroundImage: 'url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-800/90 to-purple-900/85"></div>
          </div>
          
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Our Expert Doctors</h1>
                <p className="text-white/90 text-lg">Find and book appointments with qualified specialists</p>
              </div>
              {role === 'admin' && (
                <Button onClick={() => { setSelectedDoctor(null); setShowForm(true); }} className="bg-white text-primary hover:bg-white/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Doctor
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading doctors...</div>
        ) : doctors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No doctors found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <Card 
                key={doctor._id} 
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => handleViewDetails(doctor)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-xl">
                        {doctor.user?.firstName?.[0]}{doctor.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                      </h3>
                      <Badge variant="secondary" className="mt-1">{doctor.specialization}</Badge>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{doctor.qualification}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{doctor.experience} yrs</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{doctor.rating || 4.5}</span>
                        </div>
                      </div>
                      <p className="text-sm font-semibold mt-2 text-primary">₹{doctor.consultationFee}</p>
                      {role === 'admin' && (
                        <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedDoctor(doctor); setShowForm(true); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(doctor._id)}>Delete</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DoctorForm open={showForm} onClose={() => { setShowForm(false); setSelectedDoctor(null); }} onSuccess={fetchDoctors} doctor={selectedDoctor} />
      <DoctorDetailsDialog 
        open={showDetails} 
        onClose={() => { setShowDetails(false); setSelectedDoctor(null); }} 
        doctor={selectedDoctor}
        onBookAppointment={handleBookAppointment}
      />
      <AppointmentForm 
        open={showAppointmentForm} 
        onClose={() => {
          setShowAppointmentForm(false);
          setSelectedDoctor(null);
        }} 
        onSuccess={() => { 
          setShowAppointmentForm(false); 
          setSelectedDoctor(null);
          toast.success('Appointment booked successfully!'); 
        }}
        preSelectedDoctor={selectedDoctor}
      />
    </AppLayout>
  );
};

export default Doctors;
