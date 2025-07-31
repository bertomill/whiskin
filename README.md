# Whiskin - Meal Generator

A Next.js application for generating and managing meal plans with user authentication.

## Features

- 🔐 User authentication with NextAuth.js
- 🍽️ Meal generation and management
- 📊 Meal statistics and tracking
- 🎨 Modern, responsive UI
- 🔒 Secure password hashing
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/bertomill/whiskin.git
   cd whiskin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Database (for local development)
   DATABASE_URL="file:./dev.db"
   
   # NextAuth Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
   
   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

### 1. Database Setup

For production, you need a PostgreSQL database. You can use:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com)
- [PlanetScale](https://planetscale.com)
- [Railway](https://railway.app)

### 2. Environment Variables

Set these environment variables in your Vercel project:

**Required:**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-here"
```

**Optional (for OAuth):**
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### 3. Deploy

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### 4. Database Migration

After deployment, run database migrations:
```bash
npx prisma db push
```

## Environment Variables Explained

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Database connection string | Yes | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Your app's URL | Yes | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Yes | `your-super-secret-key` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No | `GOCSPX-your-secret` |
| `GITHUB_ID` | GitHub OAuth client ID | No | `your-github-client-id` |
| `GITHUB_SECRET` | GitHub OAuth client secret | No | `your-github-client-secret` |

## OAuth Setup (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

## Troubleshooting

### Common Issues

**"Internal server error" on signup/signin**
- Check your `DATABASE_URL` is correct
- Ensure database is accessible
- Verify `NEXTAUTH_SECRET` is set

**"401 Unauthorized" errors**
- Check OAuth credentials if using social login
- Verify `NEXTAUTH_URL` matches your deployment URL

**Database connection errors**
- Ensure your database is running
- Check firewall settings
- Verify connection string format

### Development vs Production

- **Development**: Uses SQLite database (`file:./dev.db`)
- **Production**: Requires PostgreSQL or similar database
- **Environment**: Set `NODE_ENV=production` in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Check [NextAuth.js documentation](https://next-auth.js.org)
4. Open an issue on GitHub
