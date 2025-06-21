/*
  # Create user profiles and CV data tables

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `location` (text)
      - `professional_summary` (text)
      - `onboarding_completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_experiences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `company` (text)
      - `location` (text)
      - `start_date` (text)
      - `end_date` (text)
      - `is_current` (boolean)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `user_education`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `degree` (text)
      - `institution` (text)
      - `location` (text)
      - `graduation_year` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `user_skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `level` (text)
      - `created_at` (timestamp)
    
    - `generated_cvs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `job_description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  location text,
  professional_summary text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- User Experiences Table
CREATE TABLE IF NOT EXISTS user_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  start_date text NOT NULL,
  end_date text,
  is_current boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own experiences"
  ON user_experiences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- User Education Table
CREATE TABLE IF NOT EXISTS user_education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  degree text NOT NULL,
  institution text NOT NULL,
  location text,
  graduation_year text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own education"
  ON user_education
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- User Skills Table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  level text DEFAULT 'Intermediate',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own skills"
  ON user_skills
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Generated CVs Table
CREATE TABLE IF NOT EXISTS generated_cvs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  job_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own CVs"
  ON generated_cvs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experiences_user_id ON user_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_education_user_id ON user_education(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_cvs_user_id ON generated_cvs(user_id);