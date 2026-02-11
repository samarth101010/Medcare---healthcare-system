import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { doctorAPI, departmentAPI } from '@/services/api';
import { toast } from 'sonner';

interface DoctorFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctor?: any;
}

export const DoctorForm = ({ open, onClose, onSuccess, doctor }: DoctorFormProps) => {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    licenseNumber: '',
    department: '',
    consultationFee: '',
    bio: ''
  });

  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  useEffect(() => {
    if (doctor) {
      setFormData({
        email: doctor.user?.email || '',
        password: '',
        firstName: doctor.user?.firstName || '',
        lastName: doctor.user?.lastName || '',
        phone: doctor.user?.phone || '',
        specialization: doctor.specialization || '',
        qualification: doctor.qualification || '',
        experience: doctor.experience || '',
        licenseNumber: doctor.licenseNumber || '',
        department: doctor.department?._id || '',
        consultationFee: doctor.consultationFee || '',
        bio: doctor.bio || ''
      });
    } else {
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        specialization: '',
        qualification: '',
        experience: '',
        licenseNumber: '',
        department: '',
        consultationFee: '',
        bio: ''
      });
    }
  }, [doctor, open]);

  const fetchDepartments = async () => {
    try {
      const { data } = await departmentAPI.getAll();
      setDepartments(data.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (doctor) {
        await doctorAPI.update(doctor._id, formData);
        toast.success('Doctor updated successfully');
      } else {
        await doctorAPI.create(formData);
        toast.success('Doctor added successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{doctor ? 'Edit Doctor' : 'Add New Doctor'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name *</Label>
              <Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required disabled={!!doctor} />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
            </div>
          </div>

          {!doctor && (
            <div>
              <Label>Password *</Label>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={6} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Specialization *</Label>
              <Input value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required />
            </div>
            <div>
              <Label>Qualification *</Label>
              <Input value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Experience (years) *</Label>
              <Input type="number" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required min="0" />
            </div>
            <div>
              <Label>License Number *</Label>
              <Input value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} required />
            </div>
            <div>
              <Label>Consultation Fee *</Label>
              <Input type="number" value={formData.consultationFee} onChange={(e) => setFormData({...formData, consultationFee: e.target.value})} required min="0" />
            </div>
          </div>

          <div>
            <Label>Department</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Brief description about the doctor" />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : doctor ? 'Update' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
