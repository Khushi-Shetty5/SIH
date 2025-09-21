import logger from '../../../utils/logger';

// Mock patient data service
logger.info('SERVICE', 'PatientService initialized with mock data');

export const patients = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    phone: '+1-555-0123',
    address: '123 Rural Road, Village A',
    emergencyContact: 'Jane Smith (+1-555-0124)',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    medicalHistory: [
      {
        date: '2023-08-01',
        condition: 'Hypertension',
        treatment: 'Lisinopril 10mg daily',
        doctor: 'Dr. Sarah Johnson'
      },
      {
        date: '2023-07-15',
        condition: 'Diabetes Type 2',
        treatment: 'Metformin 500mg twice daily',
        doctor: 'Dr. Michael Brown'
      }
    ],
    currentMedications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }
    ]
  },
  {
    id: '2',
    name: 'Maria Garcia',
    age: 32,
    gender: 'Female',
    phone: '+1-555-0125',
    address: '456 Farm Lane, Village B',
    emergencyContact: 'Carlos Garcia (+1-555-0126)',
    bloodType: 'A+',
    allergies: ['Latex'],
    medicalHistory: [
      {
        date: '2023-08-10',
        condition: 'Pregnancy - 32 weeks',
        treatment: 'Prenatal vitamins',
        doctor: 'Dr. Emily Davis'
      }
    ],
    currentMedications: [
      { name: 'Prenatal Vitamins', dosage: '1 tablet', frequency: 'Once daily' },
      { name: 'Folic Acid', dosage: '400mcg', frequency: 'Once daily' }
    ]
  },
  {
    id: '3',
    name: 'Robert Wilson',
    age: 67,
    gender: 'Male',
    phone: '+1-555-0127',
    address: '789 Country Side, Village C',
    emergencyContact: 'Linda Wilson (+1-555-0128)',
    bloodType: 'B+',
    allergies: ['Aspirin'],
    medicalHistory: [
      {
        date: '2023-07-20',
        condition: 'Heart Attack',
        treatment: 'Stent placement, Aspirin 81mg',
        doctor: 'Dr. James Miller'
      },
      {
        date: '2023-06-10',
        condition: 'High Cholesterol',
        treatment: 'Atorvastatin 20mg daily',
        doctor: 'Dr. James Miller'
      }
    ],
    currentMedications: [
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' },
      { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily' }
    ]
  }
];

export const emergencyRequests = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    issue: 'Severe chest pain and shortness of breath',
    severity: 'high',
    timestamp: '2023-08-15T10:30:00Z',
    status: 'pending',
    assignedDoctor: null,
    notes: 'Patient reports sudden onset of chest pain while working in field'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Maria Garcia',
    issue: 'Severe abdominal pain and bleeding',
    severity: 'high',
    timestamp: '2023-08-15T11:15:00Z',
    status: 'pending',
    assignedDoctor: null,
    notes: 'Pregnant patient experiencing complications'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Robert Wilson',
    issue: 'Mild headache and dizziness',
    severity: 'medium',
    timestamp: '2023-08-15T12:00:00Z',
    status: 'pending',
    assignedDoctor: null,
    notes: 'Patient feels unwell after taking morning medications'
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Alice Johnson',
    issue: 'Fever and cough',
    severity: 'low',
    timestamp: '2023-08-15T13:30:00Z',
    status: 'pending',
    assignedDoctor: null,
    notes: 'Patient has been feeling unwell for 2 days'
  }
];

export const getPatientById = (id) => {
  logger.debug('SERVICE', 'Getting patient by ID', { patientId: id });
  
  const patient = patients.find(patient => patient.id === id);
  
  if (!patient) {
    logger.warn('SERVICE', 'Patient not found', { patientId: id });
    return null;
  }
  
  logger.info('SERVICE', 'Patient found successfully', { 
    patientId: id, 
    patientName: patient.name 
  });
  
  return patient;
};

export const getEmergencyRequests = () => {
  logger.debug('SERVICE', 'Getting emergency requests');
  
  const sortedRequests = emergencyRequests.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
  
  logger.info('SERVICE', 'Emergency requests retrieved', { 
    count: sortedRequests.length,
    highPriority: sortedRequests.filter(r => r.severity === 'high').length,
    mediumPriority: sortedRequests.filter(r => r.severity === 'medium').length,
    lowPriority: sortedRequests.filter(r => r.severity === 'low').length
  });
  
  return sortedRequests;
};

export const getEmergencyById = (id) => {
  logger.debug('SERVICE', 'Getting emergency by ID', { emergencyId: id });
  
  const emergency = emergencyRequests.find(emergency => emergency.id === id);
  
  if (!emergency) {
    logger.warn('SERVICE', 'Emergency not found', { emergencyId: id });
    return null;
  }
  
  logger.info('SERVICE', 'Emergency found successfully', { 
    emergencyId: id, 
    patientName: emergency.patientName,
    severity: emergency.severity
  });
  
  return emergency;
};

export const assignDoctorToEmergency = (emergencyId, doctorId) => {
  logger.info('SERVICE', 'Assigning doctor to emergency', { emergencyId, doctorId });
  
  const emergency = emergencyRequests.find(e => e.id === emergencyId);
  
  if (!emergency) {
    logger.error('SERVICE', 'Emergency not found for assignment', { emergencyId });
    return false;
  }
  
  if (!doctorId) {
    logger.error('SERVICE', 'Doctor ID is required for assignment', { emergencyId });
    return false;
  }
  
  try {
    emergency.assignedDoctor = doctorId;
    emergency.status = 'assigned';
    
    logger.info('SERVICE', 'Doctor assigned successfully', { 
      emergencyId, 
      doctorId, 
      patientName: emergency.patientName 
    });
    
    return true;
  } catch (error) {
    logger.error('SERVICE', 'Failed to assign doctor to emergency', { 
      emergencyId, 
      doctorId, 
      error: error.message 
    });
    return false;
  }
};
