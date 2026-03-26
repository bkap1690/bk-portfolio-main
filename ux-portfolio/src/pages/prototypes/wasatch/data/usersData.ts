// Types for User Data
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  accountType: 'individual' | 'institutional';
  organization?: string;
  role?: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  createdDate: string;
  lastLogin?: string;
  twoFactorEnabled: boolean;
}

export interface UsersPageData {
  users: User[];
}

const STORAGE_KEY = 'wasatch_users_data';

// Initial mock users
const initialUsers: User[] = [
  {
    id: 'user-001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@genetech.com',
    username: 'sjohnson',
    accountType: 'institutional',
    organization: 'GeneTech Solutions',
    role: 'Principal Investigator',
    phone: '(555) 123-4567',
    status: 'active',
    createdDate: '2024-01-15',
    lastLogin: '2024-01-29',
    twoFactorEnabled: true,
  },
  {
    id: 'user-002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@biocore.com',
    username: 'mchen',
    accountType: 'institutional',
    organization: 'BioCore Pharmaceuticals',
    role: 'Lab Manager',
    phone: '(555) 234-5678',
    status: 'active',
    createdDate: '2024-01-10',
    lastLogin: '2024-01-28',
    twoFactorEnabled: true,
  },
  {
    id: 'user-003',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.r@medilabs.org',
    username: 'erodriguez',
    accountType: 'institutional',
    organization: 'MediLabs Research',
    role: 'Researcher',
    phone: '(555) 345-6789',
    status: 'active',
    createdDate: '2024-01-05',
    lastLogin: '2024-01-27',
    twoFactorEnabled: false,
  },
  {
    id: 'user-004',
    firstName: 'David',
    lastName: 'Park',
    email: 'david.park@independent.com',
    username: 'dpark',
    accountType: 'individual',
    phone: '(555) 456-7890',
    status: 'active',
    createdDate: '2023-12-20',
    lastLogin: '2024-01-25',
    twoFactorEnabled: false,
  },
  {
    id: 'user-005',
    firstName: 'Jennifer',
    lastName: 'Williams',
    email: 'jwilliams@advancebio.com',
    username: 'jwilliams',
    accountType: 'institutional',
    organization: 'AdvanceBio Corp',
    role: 'Administrator',
    phone: '(555) 567-8901',
    status: 'pending',
    createdDate: '2024-01-28',
    twoFactorEnabled: true,
  },
];

// Load users from localStorage or use initial data
function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded users from localStorage:', parsed.length, 'users');
      // Validate that it's an array
      if (!Array.isArray(parsed)) {
        console.error('Invalid users data in localStorage, resetting to initial data');
        saveUsers(initialUsers);
        return initialUsers;
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load users from localStorage:', error);
    // Reset to initial data if there's an error
    saveUsers(initialUsers);
  }
  return initialUsers;
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to localStorage:', error);
  }
}

// Get all users
export function getAllUsers(): User[] {
  return loadUsers();
}

// Get user by ID
export function getUserById(id: string): User | undefined {
  const users = loadUsers();
  return users.find((user) => user.id === id);
}

// Add a new user
export function addUser(userData: Omit<User, 'id' | 'createdDate' | 'status'>): User {
  try {
    const users = loadUsers();

    // Validate required fields
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.username) {
      console.error('Missing required user fields:', userData);
      throw new Error('Missing required user fields');
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    console.log('Adding new user:', newUser);
    users.push(newUser);
    saveUsers(users);
    console.log('User saved successfully. Total users:', users.length);

    return newUser;
  } catch (error) {
    console.error('Error in addUser:', error);
    throw error;
  }
}

// Update user
export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = loadUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  users[index] = { ...users[index], ...updates };
  saveUsers(users);

  return users[index];
}

// Update last login
export function updateLastLogin(id: string): void {
  const users = loadUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    users[index].lastLogin = new Date().toISOString().split('T')[0];
    saveUsers(users);
  }
}

// Delete user (set to inactive)
export function deactivateUser(id: string): boolean {
  const users = loadUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return false;
  }

  users[index].status = 'inactive';
  saveUsers(users);

  return true;
}

// Initialize users data (call this once to set up initial data)
export function initializeUsersData(): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    saveUsers(initialUsers);
  }
}

// Export users data for direct access
export const usersData: UsersPageData = {
  users: loadUsers(),
};
