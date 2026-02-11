import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { recordAPI, patientAPI } from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, FileImage, FileText as FileIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MedicalRecordFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MedicalRecordForm = ({ open, onClose, onSuccess }: MedicalRecordFormProps) => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    patient: '',
    recordType: 'diagnosis',
    title: '',
    description: '',
    diagnosis: '',
    treatment: ''
  });

  useEffect(() => {
    if (open && (role === 'admin' || role === 'doctor')) {
      fetchPatients();
    }
  }, [open, role]);

  const fetchPatients = async () => {
    try {
      const { data } = await patientAPI.getAll();
      setPatients(data.data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error(`${file.name}: Only images and PDF files are allowed`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name}: File size must be less than 10MB`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('patient', formData.patient);
      submitData.append('recordType', formData.recordType);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('diagnosis', formData.diagnosis);
      submitData.append('treatment', formData.treatment);
      
      // Append files
      selectedFiles.forEach((file) => {
        submitData.append('files', file);
      });

      await recordAPI.create(submitData);
      toast.success('Medical record created successfully');
      setSelectedFiles([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Medical Record</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Patient *</Label>
            <Select value={formData.patient} onValueChange={(value) => setFormData({...formData, patient: value})} required>
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

          <div>
            <Label>Record Type *</Label>
            <Select value={formData.recordType} onValueChange={(value) => setFormData({...formData, recordType: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="lab-report">Lab Report</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div>
            <Label>Diagnosis</Label>
            <Textarea value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} />
          </div>

          <div>
            <Label>Treatment</Label>
            <Textarea value={formData.treatment} onChange={(e) => setFormData({...formData, treatment: e.target.value})} />
          </div>

          {/* File Upload Section */}
          <div className="space-y-3">
            <Label>Medical Images / Reports</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload medical images or reports</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports: JPG, PNG, PDF (Max 10MB per file)
                </p>
              </label>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">{selectedFiles.length} file(s) selected:</p>
                {selectedFiles.map((file, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Create Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
