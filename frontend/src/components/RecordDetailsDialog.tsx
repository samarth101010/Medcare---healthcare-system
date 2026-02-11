import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, User, Stethoscope, Calendar, Activity, Pill, TestTube } from 'lucide-react';
import { format } from 'date-fns';

interface RecordDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  record: any;
}

export const RecordDetailsDialog = ({ open, onClose, record }: RecordDetailsDialogProps) => {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Medical Record Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Record ID</p>
              <p className="font-mono font-semibold">{record.recordId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Record Type</p>
              <Badge variant="outline">{record.recordType}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-semibold">{format(new Date(record.createdAt), 'PP')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant={record.isConfidential ? "destructive" : "default"}>
                {record.isConfidential ? 'Confidential' : 'Standard'}
              </Badge>
            </div>
          </div>

          {/* Patient & Doctor Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {record.patient?.user?.firstName} {record.patient?.user?.lastName}</p>
                <p><span className="text-muted-foreground">Patient ID:</span> {record.patient?.patientId}</p>
                <p><span className="text-muted-foreground">Blood Group:</span> {record.patient?.bloodGroup || 'N/A'}</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Doctor Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> Dr. {record.doctor?.user?.firstName} {record.doctor?.user?.lastName}</p>
                <p><span className="text-muted-foreground">Specialization:</span> {record.doctor?.specialization}</p>
                <p><span className="text-muted-foreground">License:</span> {record.doctor?.licenseNumber}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Title & Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">{record.title}</h3>
            {record.description && (
              <p className="text-muted-foreground">{record.description}</p>
            )}
          </div>

          {/* Diagnosis */}
          {record.diagnosis && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Diagnosis
              </h3>
              <p>{record.diagnosis}</p>
            </div>
          )}

          {/* Treatment */}
          {record.treatment && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Pill className="h-5 w-5 text-green-600" />
                Treatment Plan
              </h3>
              <p>{record.treatment}</p>
            </div>
          )}

          {/* Lab Results */}
          {record.labResults && record.labResults.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Laboratory Results
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold">Test Name</th>
                      <th className="text-left p-3 text-sm font-semibold">Result</th>
                      <th className="text-left p-3 text-sm font-semibold">Normal Range</th>
                      <th className="text-left p-3 text-sm font-semibold">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.labResults.map((result: any, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="p-3 text-sm">{result.testName}</td>
                        <td className="p-3 text-sm font-semibold">{result.result}</td>
                        <td className="p-3 text-sm text-muted-foreground">{result.normalRange}</td>
                        <td className="p-3 text-sm text-muted-foreground">{result.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vitals */}
          {record.vitals && (
            <div>
              <h3 className="font-semibold mb-3">Vital Signs</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {record.vitals.bloodPressure && (
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    <p className="font-semibold">{record.vitals.bloodPressure}</p>
                    <p className="text-xs text-muted-foreground">mmHg</p>
                  </div>
                )}
                {record.vitals.heartRate && (
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="font-semibold">{record.vitals.heartRate}</p>
                    <p className="text-xs text-muted-foreground">bpm</p>
                  </div>
                )}
                {record.vitals.temperature && (
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="font-semibold">{record.vitals.temperature}</p>
                    <p className="text-xs text-muted-foreground">°F</p>
                  </div>
                )}
                {record.vitals.weight && (
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-semibold">{record.vitals.weight}</p>
                    <p className="text-xs text-muted-foreground">lbs</p>
                  </div>
                )}
                {record.vitals.height && (
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Height</p>
                    <p className="font-semibold">{record.vitals.height}</p>
                    <p className="text-xs text-muted-foreground">inches</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={() => window.print()} variant="outline">
              Print Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
