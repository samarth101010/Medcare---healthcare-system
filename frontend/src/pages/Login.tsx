import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { Heart, Mail, Lock, ArrowRight, User, Shield, Stethoscope, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Doctor-specific fields
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isSignUp) {
        const registrationData: any = { 
          email, 
          password, 
          firstName, 
          lastName, 
          phone, 
          role: selectedRole 
        };
        
        // Add doctor-specific fields if registering as doctor
        if (selectedRole === 'doctor') {
          registrationData.specialization = specialization || 'General Practice';
          registrationData.qualification = qualification || 'MBBS';
          registrationData.experience = experience || '0';
          registrationData.licenseNumber = licenseNumber || `LIC-${Date.now()}`;
          registrationData.consultationFee = consultationFee || '500';
        }
        
        await authAPI.register(registrationData);
        toast.success('Account created! Please login.');
        setIsSignUp(false);
        setPassword('');
        // Reset doctor fields
        setSpecialization('');
        setQualification('');
        setExperience('');
        setLicenseNumber('');
        setConsultationFee('');
        setSubmitting(false);
      } else {
        const { data } = await authAPI.login({ email, password });
        const userRole = data.data.user.role;
        
        // Verify selected role matches actual user role
        if (userRole !== selectedRole) {
          setError(`Invalid credentials for ${selectedRole} portal. Please select the correct role.`);
          setSubmitting(false);
          return;
        }
        
        localStorage.setItem('token', data.data.token);
        
        // Redirect based on role
        const redirectPath = userRole === 'admin' ? '/admin' : userRole === 'doctor' ? '/doctor' : '/dashboard';
        
        setTimeout(() => {
          window.location.replace(redirectPath);
        }, 100);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
      setSubmitting(false);
    }
  };

  // Show admin option only for login, not for registration
  const roleCards = isSignUp ? [
    {
      role: 'doctor' as const,
      icon: Stethoscope,
      title: 'Doctor',
      description: 'Patient & appointment management',
      color: 'border-gray-300 hover:border-gray-400'
    },
    {
      role: 'patient' as const,
      icon: UserCircle,
      title: 'Patient',
      description: 'Book appointments & view records',
      color: 'border-purple-500 hover:border-purple-600'
    }
  ] : [
    {
      role: 'admin' as const,
      icon: Shield,
      title: 'Admin',
      description: 'Full system access',
      color: 'border-gray-300 hover:border-gray-400'
    },
    {
      role: 'doctor' as const,
      icon: Stethoscope,
      title: 'Doctor',
      description: 'Patient & appointment management',
      color: 'border-gray-300 hover:border-gray-400'
    },
    {
      role: 'patient' as const,
      icon: UserCircle,
      title: 'Patient',
      description: 'Book appointments & view records',
      color: 'border-purple-500 hover:border-purple-600'
    }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image from Unsplash */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop)',
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/85 to-blue-900/90"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold">MedCare</h1>
              <p className="text-sm text-white/80">Healthcare Management</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-4xl font-bold leading-tight mb-4">
                Smart Healthcare<br />Management System
              </h2>
              <p className="text-white/90 text-lg max-w-md leading-relaxed">
                Streamline patient care, manage appointments, and access medical records — all in one secure platform.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 max-w-md">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Secure & Private</p>
                  <p className="text-sm text-white/70">Your health data is protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Expert Doctors</p>
                  <p className="text-sm text-white/70">Access to qualified specialists</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Easy Appointments</p>
                  <p className="text-sm text-white/70">Book and manage with ease</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/60">
            © 2026 MedCare Healthcare Solutions. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="w-full max-w-xl"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">MedCare</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Healthcare Management</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isSignUp ? 'Register to access your healthcare portal' : 'Sign in to your account'}
            </p>
          </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection Cards */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Select Your Role
              </label>
              <div className={`grid gap-3 ${isSignUp ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {roleCards.map((card) => {
                  const Icon = card.icon;
                  const isSelected = selectedRole === card.role;
                  return (
                    <button
                      key={card.role}
                      type="button"
                      onClick={() => setSelectedRole(card.role)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mx-auto mb-2 ${
                        isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                      }`} />
                      <h3 className={`font-semibold text-sm mb-1 ${
                        isSelected ? 'text-purple-900 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {card.title}
                      </h3>
                      <p className={`text-xs ${
                        isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {card.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sign Up Fields */}
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        placeholder="John" 
                        required 
                        className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="Doe" 
                      required 
                      className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="+91 1234567890" 
                    required 
                    className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                  />
                </div>

                {/* Doctor-specific fields */}
                {selectedRole === 'doctor' && (
                  <>
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Professional Information</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                            Specialization
                          </label>
                          <input 
                            type="text" 
                            value={specialization} 
                            onChange={(e) => setSpecialization(e.target.value)} 
                            placeholder="e.g., Cardiology" 
                            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                            Qualification
                          </label>
                          <input 
                            type="text" 
                            value={qualification} 
                            onChange={(e) => setQualification(e.target.value)} 
                            placeholder="e.g., MBBS, MD" 
                            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                            Experience (years)
                          </label>
                          <input 
                            type="number" 
                            value={experience} 
                            onChange={(e) => setExperience(e.target.value)} 
                            placeholder="5" 
                            min="0"
                            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                            License Number
                          </label>
                          <input 
                            type="text" 
                            value={licenseNumber} 
                            onChange={(e) => setLicenseNumber(e.target.value)} 
                            placeholder="LIC123456" 
                            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                            Consultation Fee (₹)
                          </label>
                          <input 
                            type="number" 
                            value={consultationFee} 
                            onChange={(e) => setConsultationFee(e.target.value)} 
                            placeholder="500" 
                            min="0"
                            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        You can update these details later from your profile
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@example.com" 
                  required 
                  className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-11 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  minLength={6} 
                  className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-11 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow" 
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={submitting}
              className="h-12 w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }} 
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Register'}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Demo Credentials:</p>
          <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Admin: admin@hospital.com</span>
            <span>Doctor: dr.priya@hospital.com</span>
            <span>Patient: patient@test.com</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Password: password123 (admin123 for admin)</p>
        </div>
      </motion.div>
    </div>
  </div>
  );
};

export default Login;
