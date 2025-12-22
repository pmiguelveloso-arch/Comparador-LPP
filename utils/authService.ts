
import { User, PlayerProfile } from '../types';
import { supabase } from '../lib/database';

const SESSION_KEY = 'loucos_session_user';

export const authService = {
  register: async (name: string, email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) throw error.message;

    const user = data.user as User;
    
    // Se existir um perfil temporário (guest), sincronizamos com a nova conta
    const guestProfile = localStorage.getItem('player_profile');
    if (guestProfile) {
      const profile = JSON.parse(guestProfile);
      await authService.saveUserProfile(user.id, profile);
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error.message;

    const user = data.user as User;
    
    // Ao fazer login, tentamos recuperar o perfil da "tabela" profiles
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile) {
      localStorage.setItem('player_profile', JSON.stringify(profile));
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  // Added fix: Implementation of social login (OAuth) to satisfy AuthContext requirements
  loginWithProvider: async (provider: 'google' | 'facebook'): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) throw error.message;

    const user = data.user as User;
    
    // Attempt to retrieve profile for the logged in user
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile) {
      localStorage.setItem('player_profile', JSON.stringify(profile));
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('player_profile');
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  saveUserProfile: async (userId: string, profile: PlayerProfile) => {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      ...profile,
      updated_at: new Date().toISOString()
    });

    if (error) console.error("Erro ao sincronizar perfil remoto:", error);
    
    // Atualizar também a sessão local para persistência imediata
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.savedProfile = profile;
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    }
  }
};
