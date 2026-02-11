import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { prescriptionAPI, patientAPI, doctorAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Printer, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Prescriptions = () => {
  const { role } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [formData, setFormData] = useState({
    patient: '',
    diagnosis: '',
    notes: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchPrescriptions();
    if (role === 'doctor' || role === 'admin') {
      fetchPatients();
    }
  }, [role]);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await prescriptionAPI.getAll();
      setPrescriptions(data.data.prescriptions || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
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

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await prescriptionAPI.create({
        ...formData,
        medications: medications.filter(m => m.name && m.dosage)
      });
      toast.success('Prescription created successfully');
      setShowForm(false);
      resetForm();
      fetchPrescriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    }
  };

  const resetForm = () => {
    setFormData({ patient: '', diagnosis: '', notes: '', validUntil: '' });
    setMedications([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handlePrint = (prescription: any) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Prescription - ${prescription.prescriptionId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .section { margin: 20px 0; }
              .label { font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f4f4f4; }
              .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>MedCare Healthcare System</h1>
              <p>Digital Prescription</p>
            </div>
            <div class="section">
              <p><span class="label">Prescription ID:</span> ${prescription.prescriptionId}</p>
              <p><span class="label">Date:</span> ${format(new Date(prescription.createdAt), 'PPP')}</p>
              <p><span class="label">Patient:</span> ${prescription.patient?.user?.firstName} ${prescription.patient?.user?.lastName}</p>
              <p><span class="label">Doctor:</span> Dr. ${prescription.doctor?.user?.firstName} ${prescription.doctor?.user?.lastName}</p>
            </div>
            <div class="section">
              <p><span class="label">Diagnosis:</span> ${prescription.diagnosis}</p>
            </div>
            <div class="section">
              <h3>Medications:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  ${prescription.medications.map((med: any) => `
                    <tr>
                      <td>${med.name}</td>
                      <td>${med.dosage}</td>
                      <td>${med.frequency}</td>
                      <td>${med.duration}</td>
                      <td>${med.instructions || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ${prescription.notes ? `<div class="section"><p><span class="label">Notes:</span> ${prescription.notes}</p></div>` : ''}
            <div class="footer">
              <p><span class="label">Valid Until:</span> ${prescription.validUntil ? format(new Date(prescription.validUntil), 'PPP') : 'Not specified'}</p>
              <p style="margin-top: 40px;">_______________________</p>
              <p>Doctor's Signature</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      active: 'bg-green-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Prescriptions</h1>
            <p className="text-muted-foreground mt-2">Manage digital prescriptions</p>
          </div>
          {(role === 'doctor' || role === 'admin') && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading prescriptions...</div>
        ) : prescriptions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No prescriptions found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold font-mono">{prescription.prescriptionId}</h3>
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Patient: {prescription.patient?.user?.firstName} {prescription.patient?.user?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Doctor: Dr. {prescription.doctor?.user?.firstName} {prescription.doctor?.user?.lastName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Diagnosis:</span> {prescription.diagnosis}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(prescription.createdAt), 'PPP')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { setSelectedPrescription(prescription); setShowDetails(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePrint(prescription)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Prescription Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Prescription</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <Label>Valid Until</Label>
                <Input 
                  type="date" 
                  value={formData.validUntil} 
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <Label>Diagnosis *</Label>
              <Input 
                value={formData.diagnosis} 
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} 
                required 
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Medications *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddMedication}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Medication
                </Button>
              </div>
              {medications.map((med, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 mb-2 p-3 border rounded">
                  <Input 
                    placeholder="Medicine name" 
                    value={med.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder="Dosage" 
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder="Frequency" 
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder="Duration" 
                    value={med.duration}
                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                    required
                  />
                  <div className="flex gap-1">
                    <Input 
                      placeholder="Instructions" 
                      value={med.instructions}
                      onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                    />
                    {medications.length > 1 && (
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveMedication(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Label>Additional Notes</Label>
              <Textarea 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Create Prescription</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Prescription Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prescription ID</p>
                  <p className="font-mono font-medium">{selectedPrescription.prescriptionId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedPrescription.status)}>
                    {selectedPrescription.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">
                    {selectedPrescription.patient?.user?.firstName} {selectedPrescription.patient?.user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">
                    Dr. {selectedPrescription.doctor?.user?.firstName} {selectedPrescription.doctor?.user?.lastName}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Diagnosis</p>
                <p className="font-medium">{selectedPrescription.diagnosis}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Medications</p>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2 text-sm">Medicine</th>
                        <th className="text-left p-2 text-sm">Dosage</th>
                        <th className="text-left p-2 text-sm">Frequency</th>
                        <th className="text-left p-2 text-sm">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPrescription.medications.map((med: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{med.name}</td>
                          <td className="p-2">{med.dosage}</td>
                          <td className="p-2">{med.frequency}</td>
                          <td className="p-2">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedPrescription.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p>{selectedPrescription.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handlePrint(selectedPrescription)} className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Prescription
                </Button>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Prescriptions;
