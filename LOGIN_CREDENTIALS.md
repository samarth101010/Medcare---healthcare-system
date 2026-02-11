# 🔐 MedCare Healthcare Management System - Login Credentials

## Quick Access Credentials

All accounts use the same password for easy testing: **password123**
(Admin password is different: **admin123**)

---

## 👨‍💼 ADMIN PORTAL

**Access URL:** http://localhost:5173 → Select "Admin" role

| Email | Password | Name |
|-------|----------|------|
| admin@hospital.com | admin123 | Admin User |

**Admin Capabilities:**
- Full system access and control
- Manage all doctors, patients, and departments
- Approve/reject appointments
- View all billing records
- System-wide analytics and reports
- Create/edit/delete any resource

---

## 👨‍⚕️ DOCTOR PORTAL

**Access URL:** http://localhost:5173 → Select "Doctor" role

| Email | Password | Name | Specialization | Fee |
|-------|----------|------|----------------|-----|
| dr.priya@hospital.com | password123 | Dr. Priya Sharma | Cardiology | ₹1500 |
| dr.rajesh@hospital.com | password123 | Dr. Rajesh Kumar | Neurology | ₹1200 |
| dr.anjali@hospital.com | password123 | Dr. Anjali Patel | Pediatrics | ₹1000 |
| dr.vikram@hospital.com | password123 | Dr. Vikram Singh | Orthopedics | ₹1800 |
| dr.kavita@hospital.com | password123 | Dr. Kavita Reddy | Dermatology | ₹1100 |
| dr.arun@hospital.com | password123 | Dr. Arun Mehta | Emergency Medicine | ₹2000 |
| dr.sneha@hospital.com | password123 | Dr. Sneha Iyer | Radiology | ₹1300 |
| dr.amit@hospital.com | password123 | Dr. Amit Desai | Pathology | ₹900 |

**Doctor Capabilities:**
- View personal dashboard with today's appointments
- Manage patient appointments
- Create and view medical records
- Write prescriptions
- View patient details and history
- Update professional profile

---

## 👤 PATIENT PORTAL

**Access URL:** http://localhost:5173 → Select "Patient" role

| Email | Password | Name | Blood Group | DOB |
|-------|----------|------|-------------|-----|
| patient@test.com | password123 | Rahul Verma | O+ | 1990-05-15 |
| neha.gupta@email.com | password123 | Neha Gupta | A+ | 1985-08-22 |
| arjun.nair@email.com | password123 | Arjun Nair | B+ | 1992-03-10 |
| pooja.shah@email.com | password123 | Pooja Shah | AB+ | 1988-11-30 |
| karan.malhotra@email.com | password123 | Karan Malhotra | O- | 1995-07-18 |

**Patient Capabilities:**
- Personal health dashboard
- Browse and book appointments with doctors
- View detailed doctor profiles
- Access medical records and history
- View and pay invoices
- Manage personal profile
- View prescriptions

---

## 🆕 REGISTRATION

### For Patients:
1. Go to http://localhost:5173
2. Click "Register"
3. Select "Patient" role
4. Fill in basic information (name, email, phone, password)
5. Submit and login

### For Doctors:
1. Go to http://localhost:5173
2. Click "Register"
3. Select "Doctor" role
4. Fill in basic information (name, email, phone, password)
5. Optionally fill professional details:
   - Specialization
   - Qualification
   - Experience
   - License Number
   - Consultation Fee
6. Submit and login

**Note:** If professional details are skipped, default values will be used:
- Specialization: General Practice
- Qualification: MBBS
- Experience: 0 years
- License: Auto-generated
- Fee: ₹500

### For Admins:
❌ Admin accounts cannot be created through registration for security purposes.
Admin credentials are managed by system administrators only.

---

## 🏥 DEPARTMENTS

The system includes 8 departments:

1. **Cardiology** - Building A, Floor 3
2. **Neurology** - Building B, Floor 2
3. **Pediatrics** - Building C, Floor 1
4. **Orthopedics** - Building A, Floor 2
5. **Dermatology** - Building B, Floor 1
6. **Emergency** - Building A, Ground Floor
7. **Radiology** - Building C, Floor 2
8. **Laboratory** - Building B, Ground Floor

---

## 🚀 GETTING STARTED

### First Time Setup:

1. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running
   ```

2. **Seed Database:**
   ```bash
   cd backend
   node seedDatabase.js
   ```

3. **Start Backend:**
   ```bash
   cd backend
   node server.js
   # Runs on http://localhost:5000
   ```

4. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Runs on http://localhost:5173 or 5174
   ```

5. **Access Application:**
   - Open http://localhost:5173
   - Select your role (Admin/Doctor/Patient)
   - Enter credentials from above
   - Click "Sign In"

---

## 🔒 SECURITY NOTES

1. **Admin Access:** Admin portal is only accessible with pre-configured admin credentials
2. **Role Verification:** System verifies that selected role matches user's actual role during login
3. **Password Requirements:** Minimum 6 characters
4. **Token-Based Auth:** JWT tokens with 7-day expiration
5. **Protected Routes:** All API endpoints are protected with authentication middleware

---

## 📝 TESTING SCENARIOS

### Test as Patient:
- Login as: patient@test.com / password123
- Browse doctors
- Book an appointment
- View medical records
- Check billing

### Test as Doctor:
- Login as: dr.priya@hospital.com / password123
- View today's appointments
- Create medical records
- Write prescriptions
- Manage patients

### Test as Admin:
- Login as: admin@hospital.com / admin123
- Approve pending appointments
- Add new doctors
- Manage departments
- View system analytics
- Access all features

---

## 💡 TIPS

- Use the demo credentials shown at the bottom of the login page for quick access
- All passwords are "password123" except admin which is "admin123"
- You can create new accounts through registration (Patient/Doctor only)
- Admin can create doctor accounts with full details from the admin panel
- Switch between portals by logging out and selecting a different role
- All consultation fees are in Indian Rupees (₹)
- Phone numbers use Indian format (+91)

---

**Last Updated:** February 11, 2026
**System Version:** 2.0.0
**Support:** For issues, check the COMPLETE_GUIDE.md file
