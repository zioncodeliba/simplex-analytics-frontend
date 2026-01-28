# Simplex Analytics Frontend

A Next.js-based analytics dashboard frontend application.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd simplex-analytics-frontend
```

2. Install dependencies:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

### Running the Production Build

Start the production server:

```bash
npm start
```

Or with yarn:

```bash
yarn start
```

### Other Available Commands

- **Linting**: `npm run lint` - Run ESLint to check code quality
- **Type Check**: `npm run type-check` - Verify TypeScript types
- **Format**: `npm run format` - Format code with Prettier
- **Test**: `npm test` - Run tests

### Docker Support

Build and run using Docker:

```bash
docker build -t simplex-analytics-frontend .
docker run -p 3000:3000 simplex-analytics-frontend
```

Or using docker-compose:

```bash
docker-compose up
```

For staging environment:

```bash
docker-compose -f docker-compose.stag.yml up
```

## Project Structure

- `src/` - Source code directory
  - `app/` - Next.js app router pages
  - `components/` - React components
  - `services/` - API and data services
  - `store/` - State management
  - `styles/` - Global styles
  - `hook/` - Custom React hooks
  - `assets/` - Static assets
- `public/` - Public static files
- `next.config.ts` - Next.js configuration
- `tailwind.config.cjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Environment Variables

Create a `.env.local` file in the root directory with necessary environment variables:

```bash
NEXT_PUBLIC_API_URL=<your-api-url>
```

## Technologies Used

- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query/SWR** - Data fetching
- **ESLint** - Code quality
- **Docker** - Containerization
