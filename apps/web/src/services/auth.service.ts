export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
  role: 'farmer' | 'roaster' | 'trader' | 'exporter' | 'expert';
}

export const authService = {
  async login(credentials: LoginCredentials) {
    // TODO: Replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (!credentials.email || !credentials.password) {
          reject(new Error('Email and password are required'));
          return;
        }

        // Mock user database
        const mockUsers: { [key: string]: { password: string; user: any } } = {
          'farmer@coffeehubnepal.com': {
            password: 'farmer123',
            user: {
              id: 1,
              name: 'Ram Thapa',
              email: 'farmer@coffeehubnepal.com',
              phone: '+977 9800000000',
              location: 'Kaski, Nepal',
              role: 'farmer',
              verified: true,
              memberSince: '2022'
            }
          },
          'roaster@coffeehubnepal.com': {
            password: 'roaster123',
            user: {
              id: 2,
              name: 'Sita Adhikari',
              email: 'roaster@coffeehubnepal.com',
              phone: '+977 9800000001',
              location: 'Kathmandu, Nepal',
              role: 'roaster',
              verified: true,
              memberSince: '2023'
            }
          }
        };

        const userData = mockUsers[credentials.email.toLowerCase()];
        
        if (userData && userData.password === credentials.password) {
          const token = `mock-jwt-token-${Date.now()}`;
          resolve({
            token,
            user: userData.user
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },

  async register(data: RegisterData) {
    // TODO: Replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (!data.email || !data.password || !data.name) {
          reject(new Error('All fields are required'));
          return;
        }

        // Check if user already exists (mock)
        const existingUsers = ['farmer@coffeehubnepal.com', 'roaster@coffeehubnepal.com'];
        if (existingUsers.includes(data.email.toLowerCase())) {
          reject(new Error('Email already registered'));
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          role: data.role,
          verified: false,
          memberSince: new Date().getFullYear().toString()
        };

        const token = `mock-jwt-token-${Date.now()}`;
        resolve({
          token,
          user: newUser
        });
      }, 1500);
    });
  },

  async logout() {
    // TODO: Replace with actual API call
    localStorage.removeItem('token');
  },

  getCurrentUser() {
    // TODO: Replace with actual API call
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // In a real app, decode JWT or fetch user from API
    // For now, return user from localStorage if available
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    
    return null;
  }
};

