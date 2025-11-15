# Figma - Invoicing & AI Reminders SaaS

A modern invoicing and AI-powered reminder system with a Lithuanian user interface. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Project Overview

This application provides a complete invoicing solution with AI-powered automation for payment reminders. It features a clean, modern UI designed to match specific Figma design specifications.

### Key Features

- **Authentication System** - Login, signup, forgot password, and reset password flows
- **Dashboard** - KPI cards showing revenue, unpaid invoices, and AI message statistics
- **Invoice Management** - List, detail, filter, and search invoices with status tracking
- **CSV Upload** - Import invoices, clients, and products from CSV/Excel files
- **AI Automation** - Configure automated reminder sequences with customizable timing and messaging
- **Settings** - Manage personal information, company details, and password
- **Responsive Design** - Fully responsive for desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand (for authentication)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel (configured)

## 📁 Project Structure

```
figma/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base components (Button, Input, Card, etc.)
│   │   ├── layout/         # Layout components (Sidebar, TopBar, AppLayout)
│   │   ├── charts/         # Chart components
│   │   └── shared/         # Shared feature components
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard page
│   │   ├── invoices/       # Invoice management
│   │   ├── csv-upload/     # CSV file upload
│   │   ├── ai-automation/  # AI automation configuration
│   │   └── settings/       # User settings
│   ├── store/              # Zustand stores
│   ├── lib/                # Utilities and configuration
│   │   ├── design-tokens.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── mockData.ts
│   ├── hooks/              # Custom React hooks
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── docs/                   # Documentation
├── public/                 # Static assets
└── Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arunasjusas/figma.git
cd figma
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

The application follows a strict design system with predefined tokens:

### Colors

- **Primary Blue**: `#0A61C4` (buttons, highlights)
- **Status Colors**:
  - Paid (Sumokėtos): `#10B981` (green)
  - Unpaid (Neapmokėtos): `#EF4444` (red)
  - Pending (Terminas nepasibaigęs): `#0A61C4` (blue)
- **Chart Colors**:
  - Green: `#12E100`
  - Purple: `#664DFF`
  - Blue: `#2B66FF`

### Typography

- **Font Family**: Inter
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

See `docs/DESIGN_SYSTEM.md` for complete design specifications.

## 📱 Features Overview

### Authentication
- Login with email/password
- Social authentication (Google, Facebook)
- Password reset flow
- Protected routes

### Dashboard ("Peržiūra")
- Revenue KPI card
- Unpaid invoices summary
- AI messages statistics
- Recent actions table
- 12-month invoice statistics chart

### Invoices ("Sąskaitos")
- List view with filters (amount range, search by number/client)
- Detailed invoice view
- Status tracking (paid/unpaid/pending)
- AI message preview and sending
- PDF download capability
- Attachment management

### CSV Upload ("CSV Įkėlimas")
- Drag-and-drop file upload
- Multi-file support
- File type selection (invoices, clients, products)
- Import progress tracking
- Success/error feedback

### AI Automation ("AI Automatizacijos")
- **Sequences**: Configure multi-step reminder sequences
- **Time**: Set sending schedules and constraints
- **Analytics**: View message performance metrics and history

### Settings ("Nustatymai")
- Personal information management
- Company information
- Password change

## 🔐 Authentication

The app uses mock authentication for development. In production, integrate with your backend API:

1. Update `src/store/authStore.ts` with real API calls
2. Implement token management
3. Add refresh token logic
4. Configure secure storage

## 📊 Mock Data

The application includes comprehensive mock data in `src/lib/mockData.ts`:
- Sample invoices
- Recent actions
- Chart data
- AI messages
- Sequence steps

Replace with real API calls in production.

## 🌐 Deployment

### Vercel Deployment

The project is configured for Vercel deployment:

1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Vercel will auto-detect Vite configuration
4. Deploy!

The `vercel.json` file ensures proper routing for the SPA.

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configured with React rules
- No `any` types allowed
- Named exports preferred (except for page components)

## 📝 Documentation

- `docs/DESIGN_SYSTEM.md` - Complete design system reference
- `docs/COMPONENTS.md` - Component API documentation
- `docs/FEATURES.md` - Feature descriptions and user flows

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure TypeScript compiles without errors
4. Test responsive behavior
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- Arunas Jusas - [GitHub](https://github.com/arunasjusas)

## 🙏 Acknowledgments

- Design system based on Figma specifications
- UI components inspired by modern SaaS applications
- Lithuanian localization for all user-facing text

