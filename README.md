# RoadSurfer Booking Dashboard

A Vue 3 TypeScript application for managing RoadSurfer vehicle bookings with calendar view, station search, and booking management features.

🚀 **[Live Demo on GitHub Pages](https://wriozumi.github.io/rdserfer/)**

## Features

- **Calendar View**: Weekly calendar with booking visualization
- **Station Search**: Autocomplete search for RoadSurfer stations
- **Booking Management**: View, reschedule, and track booking details
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Accessibility**: Full ARIA support and keyboard navigation
- **Testing**: Comprehensive unit and integration tests with data-testid selectors

## Tech Stack

- Vue 3 with Composition API & `<script setup>`
- TypeScript for type safety
- Vite for fast development and building
- Tailwind CSS for styling
- Vitest for unit testing
- GitHub Pages for deployment

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Type checking
npm run type-check

# Format code
npm run format

# Build for production
npm run build

# Deploy to GitHub Pages (manual)
npm run deploy
```

## Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Push to `main` branch triggers GitHub Actions workflow
2. **Manual Deployment**: Run `npm run deploy` to deploy manually using gh-pages
3. **GitHub Pages Settings**: Enable Pages in repository settings, source: GitHub Actions

### GitHub Actions Workflow

The project includes a complete CI/CD pipeline:

- ✅ Dependency installation
- ✅ Test execution
- ✅ Automatic deployment to GitHub Pages

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── calendar/       # Calendar-specific components
│   ├── booking/        # Booking-related components
│   └── common/         # Shared components
├── composables/        # Vue composition functions
├── views/              # Page-level components
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── styles/             # Global styles and animations
```

## Testing

- **Unit Tests**: Component and utility testing with Vitest
- **Test Strategy**: Data-testid selectors for robust, maintainable tests
- **Coverage**: Comprehensive test coverage of core functionality
