
import { User, PlayerProfile } from '../types';

const DB_KEY = 'loucos_users_db';
const SESSION_KEY = 'loucos_session_user';

// Helper to get simulated DB
const getDB = (): User[] => {
  const db = localStorage.getItem(DB_KEY);
  return db ? JSON.parse(db) : [];
};

// Helper to save simulated DB
const saveDB = (users: User[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
};

export const authService = {
  // Register a new user
  register: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getDB();
        if (users.find(u => u.email === email)) {
          reject('Email already registered');
          return;
        }

        // Check if there is an existing guest profile to attach
        const currentGuestProfile = localStorage.getItem('player_profile');
        let savedProfile = undefined;
        if (currentGuestProfile) {
            savedProfile = JSON.parse(currentGuestProfile);
        }

        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          password, // In a real app, this would be hashed!
          savedProfile,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveDB(users);
        
        // Auto Login
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        resolve(newUser);
      }, 800); // Simulate network delay
    });
  },

  // Login existing user
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getDB();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          reject('Invalid credentials');
          return;
        }

        // Restore user profile to active session
        if (user.savedProfile) {
            localStorage.setItem('player_profile', JSON.stringify(user.savedProfile));
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('player_profile'); // Clear session data
  },

  // Get current session
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  // Save profile to user account (Persist)
  saveUserProfile: (userId: string, profile: PlayerProfile) => {
      const users = getDB();
      const updatedUsers = users.map(u => {
          if (u.id === userId) {
              return { ...u, savedProfile: profile };
          }
          return u;
      });
      saveDB(updatedUsers);
      
      // Update session as well
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
          currentUser.savedProfile = profile;
          localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      }
  }
};
