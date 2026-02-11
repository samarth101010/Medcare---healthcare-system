import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { recordAPI } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Plus, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MedicalRecordForm } from '@/components/MedicalRecordForm';
import { RecordDetailsDialog } from '@/components/RecordDetailsDialog';

const Records = () => {
  const { role } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await recordAPI.getAll();
      setRecords(data.data.records || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await recordAPI.delete(id);
      toast.success('Record deleted');
      fetchRecords();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete record');
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
              backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-purple-800/90 to-pink-900/85"></div>
          </div>
          
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Medical Records</h1>
                <p className="text-white/90 text-lg">View and manage medical records with images & reports</p>
              </div>
              {(role === 'doctor' || role === 'admin') && (
                <Button onClick={() => setShowForm(true)} className="bg-white text-primary hover:bg-white/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading records...</div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No medical records found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <Card 
                key={record._id} 
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                onClick={() => handleViewDetails(record)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{record.title}</h3>
                        <Badge variant="secondary">{record.recordType}</Badge>
                        {record.isConfidential && <Badge variant="destructive">Confidential</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{record.description}</p>
                      {record.diagnosis && (
                        <p className="text-sm">
                          <span className="font-medium text-primary">Diagnosis:</span> {record.diagnosis}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📅 {format(new Date(record.createdAt), 'PPP')}</span>
                        <span>🆔 {record.recordId}</span>
                      </div>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(record)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {(role === 'admin') && (
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(record._id)}>Delete</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MedicalRecordForm open={showForm} onClose={() => setShowForm(false)} onSuccess={fetchRecords} />
      <RecordDetailsDialog 
        open={showDetails} 
        onClose={() => { setShowDetails(false); setSelectedRecord(null); }} 
        record={selectedRecord}
      />
    </AppLayout>
  );
};

export default Records;
