import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, Award, Briefcase, MapPin, Clock, Star } from 'lucide-react';

interface DoctorDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  doctor: any;
  onBookAppointment?: () => void;
}

export const DoctorDetailsDialog = ({ open, onClose, doctor, onBookAppointment }: DoctorDetailsDialogProps) => {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Doctor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold">
              {doctor.user?.firstName?.charAt(0)}{doctor.user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                Dr. {doctor.user?.firstName} {doctor.user?.lastName}
              </h2>
              <p className="text-lg text-primary font-semibold">{doctor.specialization}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {doctor.rating || 4.5} ({doctor.totalRatings || 0} reviews)
                </Badge>
                <Badge variant={doctor.isAvailable ? "default" : "secondary"}>
                  {doctor.isAvailable ? 'Available' : 'Not Available'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-semibold">{doctor.experience} years</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Consultation Fee</p>
                <p className="font-semibold">₹{doctor.consultationFee}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">License</p>
                <p className="font-semibold text-xs">{doctor.licenseNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-semibold text-xs">{doctor.department?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Qualification */}
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Qualification
            </h3>
            <p className="text-muted-foreground">{doctor.qualification}</p>
          </div>

          {/* Bio */}
          {doctor.bio && (
            <div>
              <h3 className="font-semibold text-lg mb-2">About</h3>
              <p className="text-muted-foreground leading-relaxed">{doctor.bio}</p>
            </div>
          )}

          {/* Availability */}
          {doctor.availability && doctor.availability.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {doctor.availability.map((slot: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{slot.day}</span>
                    <span className="text-sm text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{' '}
                <span className="font-medium">{doctor.user?.email}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Phone:</span>{' '}
                <span className="font-medium">{doctor.user?.phone}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onBookAppointment} className="flex-1 gap-2">
              <Calendar className="h-4 w-4" />
              Book Appointment
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
