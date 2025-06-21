# Database Migration Instructions

The application is failing because the required database tables don't exist in your Supabase project. You need to apply the migration manually.

## Steps to Fix:

1. **Open Supabase Studio**
   - Go to your Supabase project dashboard
   - Navigate to the "SQL Editor" section

2. **Execute the Migration**
   - Copy the entire contents of `supabase/migrations/20250621132131_turquoise_violet.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

3. **Verify Tables Created**
   - Go to the "Table Editor" section
   - You should now see the following tables:
     - `user_profiles`
     - `user_experiences`
     - `user_education`
     - `user_skills`
     - `generated_cvs`

## Alternative Method (if you have Supabase CLI):

If you have the Supabase CLI installed and configured:

```bash
supabase db push
```

## What This Migration Creates:

- **user_profiles**: Stores user profile information and onboarding status
- **user_experiences**: Stores work experience data
- **user_education**: Stores education history
- **user_skills**: Stores user skills and proficiency levels
- **generated_cvs**: Stores AI-generated CVs

All tables include proper Row Level Security (RLS) policies to ensure users can only access their own data.

## After Migration:

Once the migration is applied, refresh your application and the errors should be resolved. The dashboard and onboarding pages will be able to interact with the database properly.