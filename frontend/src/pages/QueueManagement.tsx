import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { queueAPI, patientAPI, doctorAPI } from '@/services/api';
import { Plus, Phone, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const QueueManagement = () => {
  const [queues, setQueues] = useState<any[]>([]);
  const [activeQueues, setActiveQueues] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    reason: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [queuesRes, activeRes, patientsRes, doctorsRes] = await Promise.all([
        queueAPI.getAll(),
        queueAPI.getActive(),
        patientAPI.getAll(),
        doctorAPI.getAll()
      ]);

      setQueues(queuesRes.data.data.queues || []);
      setActiveQueues(activeRes.data.data.queues || []);
      setPatients(patientsRes.data.data.patients || []);
      setDoctors(doctorsRes.data.data.doctors || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch queue data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await queueAPI.create(formData);
      toast.success('Patient added to queue');
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to queue');
    }
  };

  const handleCallNext = async (doctorId: string) => {
    try {
      const { data } = await queueAPI.callNext(doctorId);
      toast.success(`Called: ${data.data.queue.patient?.user?.firstName} ${data.data.queue.patient?.user?.lastName}`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No patients in queue');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await queueAPI.complete(id);
      toast.success('Consultation completed');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this queue entry?')) return;
    try {
      await queueAPI.update(id, { status: 'cancelled' });
      toast.success('Queue entry cancelled');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  const resetForm = () => {
    setFormData({ patient: '', doctor: '', reason: '', priority: 'normal' });
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      normal: 'bg-blue-500',
      urgent: 'bg-yellow-500',
      emergency: 'bg-red-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      waiting: 'bg-yellow-500',
      'in-progress': 'bg-blue-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const waitingCount = activeQueues.filter(q => q.status === 'waiting').length;
  const inProgressCount = activeQueues.filter(q => q.status === 'in-progress').length;
  const avgWaitTime = activeQueues.length > 0 
    ? Math.round(activeQueues.reduce((sum, q) => sum + (q.estimatedWaitTime || 0), 0) / activeQueues.length)
    : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Queue Management</h1>
            <p className="text-muted-foreground mt-2">Manage walk-in patients and waiting queue</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add to Queue
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Waiting</p>
                  <p className="text-3xl font-bold text-yellow-600">{waitingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-green-600">{avgWaitTime} min</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Today</p>
                  <p className="text-3xl font-bold text-purple-600">{queues.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Queue by Doctor */}
        <div className="grid gap-6 md:grid-cols-2">
          {doctors.map((doctor) => {
            const doctorQueue = activeQueues.filter(q => q.doctor?._id === doctor._id);
            const waiting = doctorQueue.filter(q => q.status === 'waiting');
            const current = doctorQueue.find(q => q.status === 'in-progress');

            return (
              <Card key={doctor._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Dr. {doctor.user?.firstName} {doctor.user?.lastName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                    <Badge variant="outline">{waiting.length} waiting</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Patient */}
                  {current && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-500">In Progress</Badge>
                        <span className="font-mono text-sm">{current.queueNumber}</span>
                      </div>
                      <p className="font-medium">
                        {current.patient?.user?.firstName} {current.patient?.user?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{current.reason}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => handleComplete(current._id)} className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Waiting Queue */}
                  {waiting.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Waiting Queue:</p>
                      {waiting.slice(0, 3).map((queue) => (
                        <div key={queue._id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{queue.queueNumber}</span>
                              <Badge className={getPriorityColor(queue.priority)} variant="outline">
                                {queue.priority}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium">
                              {queue.patient?.user?.firstName} {queue.patient?.user?.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Wait: ~{queue.estimatedWaitTime} min
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleCancel(queue._id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {waiting.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center">
                          +{waiting.length - 3} more in queue
                        </p>
                      )}
                    </div>
                  ) : (
                    !current && (
                      <p className="text-center text-muted-foreground py-4">No patients in queue</p>
                    )
                  )}

                  {/* Call Next Button */}
                  {!current && waiting.length > 0 && (
                    <Button 
                      onClick={() => handleCallNext(doctor._id)} 
                      className="w-full"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Next Patient
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* All Queue Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Queue History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {queues.slice(0, 10).map((queue) => (
                <div key={queue._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-medium">{queue.queueNumber}</span>
                    <div>
                      <p className="font-medium">
                        {queue.patient?.user?.firstName} {queue.patient?.user?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dr. {queue.doctor?.user?.firstName} {queue.doctor?.user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(queue.priority)}>{queue.priority}</Badge>
                    <Badge className={getStatusColor(queue.status)}>{queue.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(queue.checkInTime), 'HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add to Queue Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Patient to Queue</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddToQueue} className="space-y-4">
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
              <Label>Doctor *</Label>
              <Select value={formData.doctor} onValueChange={(value) => setFormData({...formData, doctor: value})}>
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

            <div>
              <Label>Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Reason *</Label>
              <Textarea 
                value={formData.reason} 
                onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                required 
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Add to Queue</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default QueueManagement;
