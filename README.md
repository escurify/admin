# Escurify Admin Dashboard

A React-based admin dashboard for managing the Escurify platform.

## Features

- **Authentication**: Secure login with role-based access control
- **KYC Management**: Review and approve seller KYC applications
- **User Management**: Search users, view details, block/unblock accounts
- **Transaction Management**: Search transactions, handle disputes

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** with Zod for form handling
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5174`

### Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/                 # API layer (axios, endpoints)
├── auth/                # Authentication (context, guards, permissions)
├── components/
│   ├── layout/          # Layout components (Dashboard, Sidebar, Topbar)
│   └── ui/              # Reusable UI components
├── features/
│   ├── kyc/             # KYC management feature
│   ├── users/           # User management feature
│   └── transactions/    # Transaction management feature
├── pages/               # Top-level pages
├── styles/              # Global styles
└── types/               # TypeScript types
```

## Admin Roles

| Role       | Permissions                                    |
|------------|------------------------------------------------|
| SUPERADMIN | Full access to all features                    |
| ADMIN      | Full access except user deletion               |
| SUPPORT    | View users and transactions only               |
| VIEWER     | View-only access to all sections               |

## Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## API Proxy

The development server proxies `/api` requests to `http://localhost:3000` (the backend).

## License

Private - Escurify
