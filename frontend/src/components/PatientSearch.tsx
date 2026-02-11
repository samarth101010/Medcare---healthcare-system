import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { patientAPI } from '@/services/api';

interface PatientSearchProps {
  onSelectPatient?: (patient: any) => void;
}

export const PatientSearch = ({ onSelectPatient }: PatientSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = patients.filter(patient => {
        const fullName = `${patient.user?.firstName} ${patient.user?.lastName}`.toLowerCase();
        const email = patient.user?.email?.toLowerCase() || '';
        const patientId = patient.patientId?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) || 
               email.includes(search) || 
               patientId.includes(search);
      });
      setFilteredPatients(filtered);
      setShowResults(true);
    } else {
      setFilteredPatients([]);
      setShowResults(false);
    }
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      const { data } = await patientAPI.getAll();
      setPatients(data.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSelectPatient = (patient: any) => {
    setSearchTerm(`${patient.user?.firstName} ${patient.user?.lastName}`);
    setShowResults(false);
    if (onSelectPatient) {
      onSelectPatient(patient);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search patients by name, email, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowResults(true)}
          className="pl-10"
        />
      </div>

      {showResults && filteredPatients.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                onClick={() => handleSelectPatient(patient)}
                className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {patient.user?.firstName} {patient.user?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{patient.user?.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="font-mono text-xs">
                    {patient.patientId}
                  </Badge>
                  {patient.bloodGroup && (
                    <p className="text-xs text-muted-foreground mt-1">{patient.bloodGroup}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && filteredPatients.length === 0 && searchTerm && (
        <Card className="absolute z-50 w-full mt-2">
          <CardContent className="p-4 text-center text-muted-foreground">
            No patients found
          </CardContent>
        </Card>
      )}
    </div>
  );
};
