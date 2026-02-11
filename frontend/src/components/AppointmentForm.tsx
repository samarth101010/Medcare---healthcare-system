import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { appointmentAPI, doctorAPI, patientAPI } from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  appointment?: any;
  preSelectedDoctor?: any; // Add this prop
}

export const AppointmentForm = ({ open, onClose, onSuccess, appointment, preSelectedDoctor }: AppointmentFormProps) => {
  const { role, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [myPatientId, setMyPatientId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    patient: appointment?.patient?._id || '',
    doctor: appointment?.doctor?._id || preSelectedDoctor?._id || '',
    appointmentDate: appointment?.appointmentDate?.split('T')[0] || '',
    appointmentTime: appointment?.appointmentTime || '',
    reason: appointment?.reason || '',
    type: appointment?.type || 'consultation',
    symptoms: appointment?.symptoms?.join(', ') || ''
  });

  useEffect(() => {
    if (open) {
      // Set preselected doctor if provided
      if (preSelectedDoctor) {
        setFormData(prev => ({ ...prev, doctor: preSelectedDoctor._id }));
      }
      
      // Only fetch doctors if no doctor is preselected
      if (!preSelectedDoctor) {
        fetchDoctors();
      }
      
      if (role === 'admin' || role === 'doctor') {
        fetchPatients();
      } else if (role === 'patient') {
        fetchMyPatientId();
      }
    }
  }, [open, role, preSelectedDoctor]);

  const fetchDoctors = async () => {
    try {
      const { data } = await doctorAPI.getAll();
      setDoctors(data.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data } = await patientAPI.getAll();
      setPatients(data.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchMyPatientId = async () => {
    try {
      const { data } = await patientAPI.getMyProfile();
      const patientId = data.data.patient._id;
      setMyPatientId(patientId);
      setFormData(prev => ({ ...prev, patient: patientId }));
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      toast.error('Failed to load your profile. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (appointment) {
        await appointmentAPI.update(appointment._id, payload);
        toast.success('Appointment updated successfully');
      } else {
        await appointmentAPI.create(payload);
        toast.success('Appointment created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
          {preSelectedDoctor && (
            <div className="mt-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Booking appointment with:</p>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                  {preSelectedDoctor.user?.firstName?.charAt(0)}{preSelectedDoctor.user?.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">Dr. {preSelectedDoctor.user?.firstName} {preSelectedDoctor.user?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{preSelectedDoctor.specialization}</p>
                  <p className="text-sm font-semibold text-primary">₹{preSelectedDoctor.consultationFee}</p>
                </div>
              </div>
            </div>
          )}
          {role === 'patient' && !appointment && !preSelectedDoctor && (
            <p className="text-sm text-muted-foreground mt-2">
              Booking appointment for yourself
            </p>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {(role === 'admin' || role === 'doctor') && (
            <div>
              <Label>Patient *</Label>
              <Select value={formData.patient} onValueChange={(value) => setFormData({...formData, patient: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient._id} value={patient._id}>
                      {patient.user?.firstName} {patient.user?.lastName} ({patient.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Only show doctor selection if no doctor is preselected */}
          {!preSelectedDoctor && (
            <div>
              <Label>Doctor *</Label>
              <Select value={formData.doctor} onValueChange={(value) => setFormData({...formData, doctor: value})} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      Dr. {doctor.user?.firstName} {doctor.user?.lastName} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label>Time *</Label>
              <Input
                type="time"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label>Appointment Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="routine-checkup">Routine Checkup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reason for Visit *</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              placeholder="Describe the reason for this appointment"
              required
            />
          </div>

          <div>
            <Label>Symptoms (comma-separated)</Label>
            <Input
              value={formData.symptoms}
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              placeholder="e.g., fever, headache, cough"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : appointment ? 'Update' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
