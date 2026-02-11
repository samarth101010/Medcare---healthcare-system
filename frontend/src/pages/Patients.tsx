import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { patientAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PatientDetailsDialog } from '@/components/PatientDetailsDialog';

const Patients = () => {
  const { role } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (role === 'admin' || role === 'doctor') {
      fetchPatients();
    }
  }, [role]);

  const fetchPatients = async () => {
    try {
      const { data } = await patientAPI.getAll();
      setPatients(data.data.patients || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  if (role === 'patient') {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">You don't have permission to view this page</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground mt-2">Manage patient records</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading patients...</div>
        ) : patients.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No patients found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
              <Card 
                key={patient._id} 
                className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                onClick={() => handlePatientClick(patient)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {patient.user?.firstName?.[0]}{patient.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {patient.user?.firstName} {patient.user?.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{patient.patientId}</p>
                      {patient.bloodGroup && (
                        <Badge variant="outline" className="mt-2">{patient.bloodGroup}</Badge>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">{patient.user?.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <PatientDetailsDialog 
        open={showDetails} 
        onClose={() => setShowDetails(false)} 
        patient={selectedPatient}
      />
    </AppLayout>
  );
};

export default Patients;
