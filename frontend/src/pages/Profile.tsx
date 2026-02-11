import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { authAPI, patientAPI, doctorAPI } from '@/services/api';
import { toast } from 'sonner';
import { User, Mail, Phone, Calendar, MapPin, Heart, Stethoscope, Save, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const { user, role } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, [role, user]);

  const fetchProfileData = async () => {
    try {
      if (role === 'patient') {
        const { data } = await patientAPI.getMyProfile();
        const myProfile = data.data.patient;
        if (myProfile) {
          setProfileData(myProfile);
          setFormData({
            firstName: myProfile.user?.firstName || '',
            lastName: myProfile.user?.lastName || '',
            email: myProfile.user?.email || '',
            phone: myProfile.user?.phone || '',
            dateOfBirth: myProfile.dateOfBirth ? new Date(myProfile.dateOfBirth).toISOString().split('T')[0] : '',
            address: myProfile.address || '',
            bloodGroup: myProfile.bloodGroup || '',
            emergencyContact: myProfile.emergencyContact || '',
            specialization: '',
            qualification: '',
            experience: '',
            consultationFee: ''
          });
        }
      } else if (role === 'doctor') {
        const { data } = await doctorAPI.getMyProfile();
        const myProfile = data.data.doctor;
        if (myProfile) {
          setProfileData(myProfile);
          setFormData({
            firstName: myProfile.user?.firstName || '',
            lastName: myProfile.user?.lastName || '',
            email: myProfile.user?.email || '',
            phone: myProfile.user?.phone || '',
            dateOfBirth: '',
            address: '',
            bloodGroup: '',
            emergencyContact: '',
            specialization: myProfile.specialization || '',
            qualification: myProfile.qualification || '',
            experience: myProfile.experience?.toString() || '',
            consultationFee: myProfile.consultationFee?.toString() || ''
          });
        }
      } else if (role === 'admin') {
        // Admin - just use user data from auth
        setFormData({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          phone: user?.phone || '',
          dateOfBirth: '',
          address: '',
          bloodGroup: '',
          emergencyContact: '',
          specialization: '',
          qualification: '',
          experience: '',
          consultationFee: ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Please contact administrator.');
      } else {
        toast.error('Failed to load profile data');
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (role === 'patient' && profileData) {
        await patientAPI.update(profileData._id, {
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          bloodGroup: formData.bloodGroup,
          emergencyContact: formData.emergencyContact
        });
      } else if (role === 'doctor' && profileData) {
        await doctorAPI.update(profileData._id, {
          specialization: formData.specialization,
          qualification: formData.qualification,
          experience: parseInt(formData.experience),
          consultationFee: parseFloat(formData.consultationFee)
        });
      }

      toast.success('Profile updated successfully!');
      setEditing(false);
      fetchProfileData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">View and manage your account information</p>
          </div>
          <div className="flex gap-2">
            {!editing ? (
              <Button onClick={() => setEditing(true)} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => { setEditing(false); fetchProfileData(); }}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Editing Status Indicator */}
        {editing && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ✏️ <strong>Edit Mode Active</strong> - You can now modify your information below
            </p>
          </div>
        )}

        {/* Profile Card */}
        <Card>
          <CardHeader className="gradient-primary text-white">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                {role === 'doctor' ? (
                  <Stethoscope className="h-10 w-10 text-white" />
                ) : (
                  <User className="h-10 w-10 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl text-white">
                  {role === 'doctor' ? 'Dr. ' : ''}{formData.firstName} {formData.lastName}
                </CardTitle>
                <div className="mt-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {role?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Patient-specific fields */}
              {role === 'patient' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Medical Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Input
                        id="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={(e) => handleChange('bloodGroup', e.target.value)}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="e.g., A+, O-, B+"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="Enter your address"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleChange('emergencyContact', e.target.value)}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                  {profileData && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Patient ID: <span className="font-mono">{profileData.patientId}</span></p>
                    </div>
                  )}
                </div>
              )}

              {/* Doctor-specific fields */}
              {role === 'doctor' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Professional Information
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleChange('specialization', e.target.value)}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="e.g., Cardiology"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualification">Qualification</Label>
                      <Input
                        id="qualification"
                        value={formData.qualification}
                        onChange={(e) => handleChange('qualification', e.target.value)}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="e.g., MBBS, MD"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="Years of experience"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                      <Input
                        id="consultationFee"
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => handleChange('consultationFee', e.target.value)}
                        disabled={!editing}
                        className={!editing ? 'bg-muted' : ''}
                        placeholder="Fee amount"
                      />
                    </div>
                  </div>
                  {profileData && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Doctor ID: <span className="font-mono">{profileData.doctorId}</span></p>
                    </div>
                  )}
                </div>
              )}

              {/* Admin info */}
              {role === 'admin' && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    As an administrator, you have full access to manage the healthcare system. 
                    Contact system administrator to update your profile information.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
