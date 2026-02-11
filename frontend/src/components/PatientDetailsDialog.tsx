import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Calendar, Droplet, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface PatientDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  patient: any;
}

export const PatientDetailsDialog = ({ open, onClose, patient }: PatientDetailsDialogProps) => {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Header */}
          <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {patient.user?.firstName?.[0]}{patient.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {patient.user?.firstName} {patient.user?.lastName}
              </h2>
              <p className="text-muted-foreground font-mono">{patient.patientId}</p>
              <div className="flex gap-2 mt-3">
                {patient.bloodGroup && (
                  <Badge variant="outline" className="gap-1">
                    <Droplet className="h-3 w-3" />
                    {patient.bloodGroup}
                  </Badge>
                )}
                {patient.user?.gender && (
                  <Badge variant="outline" className="gap-1">
                    <User className="h-3 w-3" />
                    {patient.user.gender}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{patient.user?.email || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{patient.user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{patient.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {patient.dateOfBirth 
                      ? format(new Date(patient.dateOfBirth), 'PPP')
                      : 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{patient.bloodGroup || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{patient.user?.gender || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{patient.emergencyContact || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          {(patient.allergies || patient.chronicConditions || patient.currentMedications) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Medical Information</h3>
                <div className="space-y-4">
                  {patient.allergies && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((allergy: string, index: number) => (
                          <Badge key={index} variant="destructive">{allergy}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {patient.chronicConditions && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Chronic Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.chronicConditions.map((condition: string, index: number) => (
                          <Badge key={index} variant="outline">{condition}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {patient.currentMedications && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Medications</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.currentMedications.map((medication: string, index: number) => (
                          <Badge key={index} className="bg-blue-500">{medication}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Registration Date */}
          <div className="text-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 inline mr-1" />
            Registered on {format(new Date(patient.createdAt || Date.now()), 'PPP')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
