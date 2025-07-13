# HealthVault - Medical Prescription Management System

A comprehensive web application for managing medical prescriptions, connecting patients and hospitals through a unified platform. Built with Next.js, TypeScript, and Prisma.

## 🏥 Features

### For Patients
- **Secure Registration**: Create account with unique patient ID
- **Prescription Management**: View and manage all prescriptions
- **Image Upload**: Upload prescription images for digital storage
- **Real-time Updates**: Instant synchronization with hospital data
- **Prescription History**: Complete medical history tracking
- **Expiry Tracking**: Monitor prescription expiration dates

### For Hospitals
- **Patient Management**: Assign and manage patients
- **Prescription Creation**: Create and manage prescriptions for patients
- **Real-time Dashboard**: View patient statistics and recent activity
- **Data Synchronization**: Instant updates across patient dashboards
- **Comprehensive Records**: Complete patient and prescription management

### Security & Privacy
- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: Bcrypt password hashing
- **Role-based Access**: Separate patient and hospital permissions
- **Data Validation**: Comprehensive input validation
- **HIPAA Compliant**: Designed with healthcare privacy standards

## 🚀 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: JWT with bcrypt password hashing
- **UI Components**: Lucide React icons, Framer Motion animations
- **Styling**: Tailwind CSS with responsive design

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NEXTAUTH_SECRET="your-nextauth-secret-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
healthvault/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── patients/           # Patient management
│   │   │   └── prescriptions/      # Prescription management
│   │   ├── auth/                   # Authentication pages
│   │   ├── patient/                # Patient dashboard
│   │   ├── hospital/               # Hospital dashboard
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing page
│   ├── lib/                        # Utility functions
│   │   ├── auth.ts                 # Authentication utilities
│   │   └── db.ts                   # Database client
│   └── generated/                  # Prisma generated client
├── prisma/
│   └── schema.prisma               # Database schema
├── public/                         # Static assets
└── package.json
```

## 🗄️ Database Schema

### Users Table
- Supports both patients and hospitals
- Patient-specific fields: patientId, dateOfBirth, phoneNumber, address, emergencyContact
- Hospital-specific fields: hospitalName, hospitalCode, licenseNumber

### Prescriptions Table
- Links patients and hospitals
- Includes medication details, dosage, frequency, duration
- Supports image uploads and expiry tracking
- Real-time synchronization between dashboards

### HospitalPatients Table
- Manages patient-hospital relationships
- Tracks assignment dates and active status

## 🔐 Authentication Flow

1. **Registration**: Users register as either patients or hospitals
2. **Login**: JWT-based authentication with role verification
3. **Authorization**: Role-based access control for different dashboards
4. **Session Management**: Token storage in localStorage with automatic redirects

## 📱 Usage Guide

### For Patients

1. **Register**: Create account with unique patient ID
2. **Login**: Access patient dashboard
3. **View Prescriptions**: See all prescriptions with details
4. **Upload Images**: Add prescription images for digital storage
5. **Track Expiry**: Monitor prescription expiration dates

### For Hospitals

1. **Register**: Create hospital account with license information
2. **Login**: Access hospital dashboard
3. **Assign Patients**: Connect patients to your hospital
4. **Create Prescriptions**: Add prescriptions for assigned patients
5. **Manage Records**: View patient statistics and prescription history

## 🔄 Real-time Synchronization

- Changes made in hospital dashboard immediately reflect in patient dashboard
- Patient uploads and updates are visible to assigned hospitals
- Automatic data synchronization across all connected devices

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional healthcare-focused design
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Accessibility**: WCAG compliant design patterns
- **Loading States**: Proper loading indicators and error handling

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Railway**: Easy deployment with PostgreSQL
- **Netlify**: Static hosting with serverless functions
- **AWS**: Full-stack deployment with RDS

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Database Commands
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open database GUI
npx prisma migrate   # Create and apply migrations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **AI Integration**: Prescription analysis and recommendations
- **Telemedicine**: Video consultation features
- **Pharmacy Integration**: Direct prescription fulfillment
- **Analytics Dashboard**: Advanced reporting and insights
- **Multi-language Support**: Internationalization
- **Advanced Security**: Two-factor authentication, audit logs

---

**HealthVault** - Secure, Connected, Comprehensive Medical Prescription Management
