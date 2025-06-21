/*
  # Add profile image support

  1. Changes
    - Add `profile_image_url` column to `user_profiles` table
    - This will store the URL of the uploaded profile image

  2. Security
    - No changes to RLS policies needed as this is just adding a column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'profile_image_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profile_image_url text;
  END IF;
END $$;