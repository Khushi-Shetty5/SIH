import logger from '../../../utils/logger';

// Mock doctor data service
logger.info('SERVICE', 'DoctorService initialized with mock data');

export const doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    department: 'General Medicine',
    specialization: 'Internal Medicine',
    phone: '+1-555-0201',
    email: 'sarah.johnson@hospital.com',
    availability: 'available',
    experience: '15 years',
    qualifications: ['MD', 'Internal Medicine Board Certified'],
    currentPatients: 2,
    maxPatients: 8
  },
  {
    id: '2',
    name: 'Dr. Michael Brown',
    department: 'Cardiology',
    specialization: 'Cardiovascular Surgery',
    phone: '+1-555-0202',
    email: 'michael.brown@hospital.com',
    availability: 'busy',
    experience: '20 years',
    qualifications: ['MD', 'Cardiovascular Surgery Board Certified'],
    currentPatients: 6,
    maxPatients: 6
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    department: 'Obstetrics & Gynecology',
    specialization: 'Pregnancy Care',
    phone: '+1-555-0203',
    email: 'emily.davis@hospital.com',
    availability: 'available',
    experience: '12 years',
    qualifications: ['MD', 'OB/GYN Board Certified'],
    currentPatients: 3,
    maxPatients: 8
  },
  {
    id: '4',
    name: 'Dr. James Miller',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    phone: '+1-555-0204',
    email: 'james.miller@hospital.com',
    availability: 'unavailable',
    experience: '18 years',
    qualifications: ['MD', 'Interventional Cardiology Board Certified'],
    currentPatients: 0,
    maxPatients: 6
  },
  {
    id: '5',
    name: 'Dr. Lisa Anderson',
    department: 'Emergency Medicine',
    specialization: 'Emergency Care',
    phone: '+1-555-0205',
    email: 'lisa.anderson@hospital.com',
    availability: 'available',
    experience: '10 years',
    qualifications: ['MD', 'Emergency Medicine Board Certified'],
    currentPatients: 1,
    maxPatients: 10
  },
  {
    id: '6',
    name: 'Dr. David Wilson',
    department: 'General Medicine',
    specialization: 'Family Medicine',
    phone: '+1-555-0206',
    email: 'david.wilson@hospital.com',
    availability: 'busy',
    experience: '14 years',
    qualifications: ['MD', 'Family Medicine Board Certified'],
    currentPatients: 7,
    maxPatients: 8
  }
];

export const departments = [
  { id: '1', name: 'General Medicine', color: '#2E86AB' },
  { id: '2', name: 'Cardiology', color: '#E63946' },
  { id: '3', name: 'Obstetrics & Gynecology', color: '#F4A261' },
  { id: '4', name: 'Emergency Medicine', color: '#27AE60' },
  { id: '5', name: 'Pediatrics', color: '#9B59B6' },
  { id: '6', name: 'Surgery', color: '#E67E22' }
];

export const getDoctorsByDepartment = (department) => {
  logger.debug('SERVICE', 'Getting doctors by department', { department });
  
  const filteredDoctors = !department ? doctors : doctors.filter(doctor => doctor.department === department);
  
  logger.info('SERVICE', 'Doctors retrieved by department', { 
    department: department || 'all',
    count: filteredDoctors.length,
    available: filteredDoctors.filter(d => d.availability === 'available').length
  });
  
  return filteredDoctors;
};

export const getAvailableDoctors = () => {
  return doctors.filter(doctor => doctor.availability === 'available');
};

export const getDoctorById = (id) => {
  return doctors.find(doctor => doctor.id === id);
};

export const updateDoctorAvailability = (doctorId, availability) => {
  logger.info('SERVICE', 'Updating doctor availability', { doctorId, availability });
  
  const doctor = doctors.find(d => d.id === doctorId);
  
  if (!doctor) {
    logger.error('SERVICE', 'Doctor not found for availability update', { doctorId });
    return false;
  }
  
  if (!['available', 'busy', 'unavailable'].includes(availability)) {
    logger.error('SERVICE', 'Invalid availability status', { doctorId, availability });
    return false;
  }
  
  try {
    const oldAvailability = doctor.availability;
    doctor.availability = availability;
    
    logger.info('SERVICE', 'Doctor availability updated successfully', { 
      doctorId, 
      doctorName: doctor.name,
      oldAvailability,
      newAvailability: availability
    });
    
    return true;
  } catch (error) {
    logger.error('SERVICE', 'Failed to update doctor availability', { 
      doctorId, 
      availability, 
      error: error.message 
    });
    return false;
  }
};

export const getDoctorStats = () => {
  const total = doctors.length;
  const available = doctors.filter(d => d.availability === 'available').length;
  const busy = doctors.filter(d => d.availability === 'busy').length;
  const unavailable = doctors.filter(d => d.availability === 'unavailable').length;
  
  return {
    total,
    available,
    busy,
    unavailable,
    availabilityRate: Math.round((available / total) * 100)
  };
};
