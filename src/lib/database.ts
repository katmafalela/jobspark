import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  professional_summary: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserExperience {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  created_at: string;
}

export interface UserEducation {
  id: string;
  user_id: string;
  degree: string;
  institution: string;
  location: string | null;
  graduation_year: string;
  description: string | null;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  name: string;
  level: string;
  created_at: string;
}

export interface GeneratedCV {
  id: string;
  user_id: string;
  title: string;
  content: string;
  job_description: string | null;
  created_at: string;
}

// User Profile Functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profile])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Experience Functions
export async function getUserExperiences(userId: string): Promise<UserExperience[]> {
  const { data, error } = await supabase
    .from('user_experiences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createUserExperience(experience: Omit<UserExperience, 'id' | 'created_at'>): Promise<UserExperience> {
  const { data, error } = await supabase
    .from('user_experiences')
    .insert([experience])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserExperience(id: string, updates: Partial<UserExperience>): Promise<UserExperience> {
  const { data, error } = await supabase
    .from('user_experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUserExperience(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_experiences')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Education Functions
export async function getUserEducation(userId: string): Promise<UserEducation[]> {
  const { data, error } = await supabase
    .from('user_education')
    .select('*')
    .eq('user_id', userId)
    .order('graduation_year', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createUserEducation(education: Omit<UserEducation, 'id' | 'created_at'>): Promise<UserEducation> {
  const { data, error } = await supabase
    .from('user_education')
    .insert([education])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserEducation(id: string, updates: Partial<UserEducation>): Promise<UserEducation> {
  const { data, error } = await supabase
    .from('user_education')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUserEducation(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_education')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Skills Functions
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  const { data, error } = await supabase
    .from('user_skills')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createUserSkill(skill: Omit<UserSkill, 'id' | 'created_at'>): Promise<UserSkill> {
  const { data, error } = await supabase
    .from('user_skills')
    .insert([skill])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill> {
  const { data, error } = await supabase
    .from('user_skills')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUserSkill(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Generated CVs Functions
export async function getUserCVs(userId: string): Promise<GeneratedCV[]> {
  const { data, error } = await supabase
    .from('generated_cvs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createGeneratedCV(cv: Omit<GeneratedCV, 'id' | 'created_at'>): Promise<GeneratedCV> {
  const { data, error } = await supabase
    .from('generated_cvs')
    .insert([cv])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGeneratedCV(id: string): Promise<void> {
  const { error } = await supabase
    .from('generated_cvs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}