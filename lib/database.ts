
import { User, PlayerProfile } from '../types';

// Este ficheiro simula o comportamento do cliente @supabase/supabase-js
// Quando estiveres pronto, substitui este mock pela instalação real: 
// npm install @supabase/supabase-js

const MOCK_DELAY = 1000;

export const supabase = {
  auth: {
    // Simula o registo no Supabase Auth
    signUp: async ({ email, password, options }: any) => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      const users = JSON.parse(localStorage.getItem('loucos_users_db') || '[]');
      if (users.find((u: any) => u.email === email)) {
        return { data: null, error: { message: 'Este email já está registado na nossa base de dados.' } };
      }

      const newUser = {
        id: crypto.randomUUID(),
        email,
        name: options.data.name,
        createdAt: new Date().toISOString()
      };

      users.push({ ...newUser, password }); // Password guardada apenas para o mock
      localStorage.setItem('loucos_users_db', JSON.stringify(users));

      return { data: { user: newUser, session: { access_token: 'mock-token' } }, error: null };
    },

    // Simula o login no Supabase Auth
    signInWithPassword: async ({ email, password }: any) => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      const users = JSON.parse(localStorage.getItem('loucos_users_db') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        return { data: null, error: { message: 'Credenciais inválidas. Verifica o email e a password.' } };
      }

      const { password: _, ...userWithoutPass } = user;
      return { data: { user: userWithoutPass, session: { access_token: 'mock-token' } }, error: null };
    },

    // Added fix: Implementation of social login mock for OAuth providers
    signInWithOAuth: async ({ provider }: { provider: string }) => {
      await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
      
      const newUser = {
        id: crypto.randomUUID(),
        email: `${provider}-user@example.com`,
        name: `${provider} User`,
        createdAt: new Date().toISOString()
      };

      // In mock, OAuth is always successful and returns a new session
      return { data: { user: newUser, session: { access_token: 'mock-token' } }, error: null };
    },

    // Simula o logout
    signOut: async () => {
      localStorage.removeItem('loucos_session_user');
      return { error: null };
    },

    // Simula a obtenção da sessão atual
    getSession: async () => {
      const session = localStorage.getItem('loucos_session_user');
      return { data: { session: session ? JSON.parse(session) : null }, error: null };
    }
  },

  // Simula operações em tabelas (PostgreSQL no Supabase)
  from: (table: string) => ({
    select: (query: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'profiles') {
            const profiles = JSON.parse(localStorage.getItem('loucos_profiles_db') || '{}');
            return { data: profiles[value] || null, error: null };
          }
          return { data: null, error: null };
        }
      })
    }),
    upsert: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (table === 'profiles') {
        const profiles = JSON.parse(localStorage.getItem('loucos_profiles_db') || '{}');
        profiles[data.id] = data;
        localStorage.setItem('loucos_profiles_db', JSON.stringify(profiles));
      }
      return { error: null };
    }
  })
};
