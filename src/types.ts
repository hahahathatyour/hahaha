export type UserRole = 'admin' | 'guru' | 'staf';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: any;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  className: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  date: string; // YYYY-MM-DD
  timestamp: any;
  type: 'check-in' | 'check-out';
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late' | 'sick' | 'permission';
  teacherId: string;
  timestamp: any;
}
