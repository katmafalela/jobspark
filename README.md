# JobSpark - Your AI Career Co-Pilot

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

JobSpark is an intelligent career platform that helps South African professionals accelerate their job search with AI-powered tools for CV building, interview practice, and direct connections to top employers.

## Features

- 🤖 AI-powered CV generation
- 💬 Interview coaching with real-time feedback
- 🏢 Direct employer connections
- 📊 Career readiness scoring
- 🎯 Personalized job matching

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Environment Setup

1. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your environment variables in `.env.local`:
   - **Supabase**: Create a project at [supabase.com](https://supabase.com)
   - **OpenAI**: Get API key from [platform.openai.com](https://platform.openai.com)
   - **Google OAuth**: Set up OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)

### Installation & Development

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

This project uses several environment variables for configuration. See `.env.example` for a complete list.

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)
- `NEXTAUTH_SECRET` - Secret for NextAuth.js session encryption
- `OPENAI_API_KEY` - OpenAI API key for AI features

### Optional Variables

- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - For Google OAuth login
- `SMTP_*` - Email service configuration
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics tracking

**Important**: Never commit your `.env.local` file to version control. It contains sensitive information and is already included in `.gitignore`.

## Project Structure

```
src/
├── app/                 # Next.js 13+ app directory
│   ├── auth/           # Authentication pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── sections/       # Page sections (Hero, Features, etc.)
│   └── ui/             # UI components
└── lib/                # Utility functions and configurations
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **Authentication**: NextAuth.js
- **AI**: OpenAI API
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - production-ready motion library
- [Supabase](https://supabase.com/docs) - open source Firebase alternative

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

This app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

**Remember**: Set your environment variables in your deployment platform's dashboard.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for South African professionals 🇿🇦