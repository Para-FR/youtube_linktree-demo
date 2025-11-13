# LinkTree Clone

A full-stack Linktree clone built with Next.js 16, MongoDB Atlas, and shadcn/ui.

## Features

- User authentication (register/login)
- Create and manage multiple links
- Public profile pages with custom URLs
- Link click analytics
- Theme customization
- Toggle links active/inactive
- Responsive design

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `MONGODB_URI`: Your MongoDB connection string
- `AUTH_SECRET`: Random secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for development)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (create a user with password)
4. Set up network access (add your IP or allow from anywhere for development)
5. Get your connection string and add it to `.env.local`

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── links/        # Link CRUD operations
│   │   ├── profile/      # User profile management
│   │   └── register/     # User registration
│   ├── dashboard/        # Dashboard page (authenticated)
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── [username]/       # Public profile pages
│   └── layout.tsx        # Root layout
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── mongodb.ts        # MongoDB connection
│   └── utils.ts          # Utility functions
├── models/
│   ├── User.ts           # User model
│   └── Link.ts           # Link model
└── .env.local            # Environment variables
```

## Usage

### Register a New Account

1. Go to `/register`
2. Fill in your details (username must be unique and URL-friendly)
3. Submit the form

### Login

1. Go to `/login`
2. Enter your credentials
3. You'll be redirected to the dashboard

### Manage Your Links

1. In the dashboard, add new links with title and URL
2. Toggle links on/off using the switch
3. Delete links using the trash icon
4. View click analytics for each link

### Customize Your Profile

1. Go to Settings tab in the dashboard
2. Update your display name and bio
3. Save changes

### Share Your Profile

Your public profile is available at `/{username}`

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/auth/signin` - Login
- `GET /api/links` - Get user's links
- `POST /api/links` - Create a new link
- `PUT /api/links/:id` - Update a link
- `DELETE /api/links/:id` - Delete a link
- `POST /api/links/:id/click` - Track link click
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Make sure to set your environment variables in the Vercel dashboard.

## Future Enhancements

- [ ] Drag and drop link reordering
- [ ] Advanced theme customization with color picker
- [ ] Social media icons
- [ ] Link scheduling
- [ ] Advanced analytics dashboard
- [ ] Custom domains
- [ ] Image uploads for avatar
- [ ] Email verification
- [ ] Password reset

## License

MIT
