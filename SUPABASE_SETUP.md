# Supabase Setup Guide for Whiskin

This guide will help you set up Supabase as your database for the Whiskin meal generator app.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: `whiskin`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Database Connection String

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** connection string
4. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 3. Set Vercel Environment Variables

In your Vercel dashboard:

1. Go to your whiskin project
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXTAUTH_URL="https://whiskin.vercel.app"
NEXTAUTH_SECRET="VlVNHPdW3mdPanoORhCXh5kpcDt0a2xz3sBkcCgzr2I="
```

### 4. Deploy Database Schema

After setting the environment variables, Vercel will automatically run the database migration during the build process.

## 🔧 Manual Database Setup (if needed)

If you need to manually set up the database:

1. **Install Prisma CLI globally**:
   ```bash
   npm install -g prisma
   ```

2. **Set your production DATABASE_URL**:
   ```bash
   export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

3. **Push the schema to Supabase**:
   ```bash
   npx prisma db push
   ```

4. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

## 📊 Supabase Dashboard Features

Once set up, you can use Supabase's dashboard to:

- **View your data**: Go to **Table Editor** to see your users, accounts, sessions
- **Run SQL queries**: Use the **SQL Editor** for custom queries
- **Monitor performance**: Check **Database** → **Logs** for query performance
- **Manage backups**: Automatic backups are included in the free tier

## 🔒 Security Settings

### Row Level Security (RLS)

Supabase enables RLS by default. For NextAuth.js, you may need to disable RLS on auth tables:

```sql
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" DISABLE ROW LEVEL SECURITY;
```

### Connection Pooling

For production, consider using Supabase's connection pooling:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

## 🚨 Troubleshooting

### Common Issues

**"Connection refused" errors**
- Check your DATABASE_URL format
- Ensure your IP is not blocked (Supabase allows all IPs by default)

**"Table does not exist" errors**
- Run `npx prisma db push` to create tables
- Check that your schema.prisma is using `provider = "postgresql"`

**Authentication errors**
- Verify NEXTAUTH_SECRET is set correctly
- Check NEXTAUTH_URL matches your deployment URL

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## 💰 Pricing

Supabase offers a generous free tier:
- **Database**: 500MB
- **Bandwidth**: 2GB
- **Auth**: 50,000 monthly active users
- **Storage**: 1GB
- **Edge Functions**: 500,000 invocations

Perfect for getting started with Whiskin! 