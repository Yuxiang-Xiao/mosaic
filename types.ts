export interface CheckIn {
  date: string; // 'YYYY-MM-DD'
  note: string;
}

export interface Thing {
  id: string;
  name: string;
  checkIns: CheckIn[]; // Array of CheckIn objects
  createdAt: string; // ISO string
  archived?: boolean;
}