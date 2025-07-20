-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "patientId" TEXT,
    "dateOfBirth" DATETIME,
    "phoneNumber" TEXT,
    "address" TEXT,
    "emergencyContact" TEXT,
    "hospitalName" TEXT,
    "hospitalCode" TEXT,
    "licenseNumber" TEXT
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "hospitalId" TEXT,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    "imageUrl" TEXT,
    "prescribedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "prescriptions_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hospital_patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hospitalId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "assignedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "hospital_patients_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hospital_patients_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medication_feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prescriptionId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "effectiveness" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "sideEffects" TEXT NOT NULL,
    "notes" TEXT,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "medication_feedback_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tablet_feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicationFeedbackId" TEXT NOT NULL,
    "tabletNumber" INTEGER NOT NULL,
    "effectiveness" TEXT NOT NULL,
    "sideEffects" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "notes" TEXT,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tablet_feedback_medicationFeedbackId_fkey" FOREIGN KEY ("medicationFeedbackId") REFERENCES "medication_feedback" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_patientId_key" ON "users"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "users_hospitalCode_key" ON "users"("hospitalCode");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_patients_hospitalId_patientId_key" ON "hospital_patients"("hospitalId", "patientId");

-- CreateIndex
CREATE UNIQUE INDEX "tablet_feedback_medicationFeedbackId_tabletNumber_date_key" ON "tablet_feedback"("medicationFeedbackId", "tabletNumber", "date");
