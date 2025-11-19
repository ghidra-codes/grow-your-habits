# Grow Your Habits - Folder Structure

This is a reference example for the project structure. It shows where files live and why, to keep the project organized, maintainable, and scalable.

# NOTE: This is an example and may not exactly reflect the final project structure

grow-your-habits/
├─ public/ # Static assets served directly
│ ├─ favicon.ico
│ ├─ images/ # Large backgrounds, logos
│ └─ lottie/ # Lottie JSON files that don’t need importing
│
├─ src/
│ ├─ app/ # Global app infrastructure
│ │ ├─ App.tsx # App root
│ │ ├─ routes.tsx # React Router route definitions
│ │ ├─ Layout.tsx # Shared layout wrapper
│ │ └─ index.css / scss # Minimal resets if needed
│ │
│ ├─ ui/ # Reusable, generic UI components
│ │ ├─ Button/
│ │ │ └─ Button.tsx
│ │ ├─ Modal/
│ │ └─ Loader/
│ │
│ ├─ features/ # Self-contained feature logic
│ │ ├─ auth/
│ │ │ ├─ LoginForm.tsx
│ │ │ ├─ RegisterForm.tsx
│ │ │ ├─ hooks/useAuth.ts # useAuth and helpers
│ │ │ └─ supabase.ts # API calls for auth
│ │ │
│ │ ├─ habits/
│ │ │ ├─ HabitCard.tsx
│ │ │ ├─ HabitList.tsx
│ │ │ ├─ HabitForm.tsx
│ │ │ ├─ hooks/useHabits.ts
│ │ │ └─ supabase.ts
│ │ │
│ │ ├─ plant/
│ │ │ ├─ PlantAnimation.tsx
│ │ │ └─ hooks/usePlantGrowth.ts
│ │ │
│ │ ├─ insights/
│ │ │ ├─ InsightsList.tsx
│ │ │ └─ hooks/useInsights.ts
│ │ │
│ │ ├─ statistics/
│ │ │ ├─ StatsOverview.tsx
│ │ │ └─ hooks/useStats.ts
│ │ │
│ │ └─ achievements/
│ │ ├─ AchievementBadge.tsx
│ │ └─ hooks/useAchievements.ts
│ │
│ ├─ store/ # Zustand global stores
│ │ ├─ index.ts # Combine stores if needed
│ │ └─ uiStore.ts # Optional global UI state
│ │
│ ├─ hooks/ # Shared hooks used across multiple features
│ │ ├─ useDebounce.ts
│ │ └─ useLocalStorage.ts
│ │
│ ├─ utils/ # Shared utilities / helpers
│ │ ├─ helpers/ # Small utility functions
│ │ ├─ supabaseClient.ts
│ │ ├─ dateUtils.ts
│ │ └─ animationUtils.ts
│ │
│ ├─ assets/ # Importable images, icons, Lottie files
│ │ ├─ icons/
│ │ ├─ images/
│ │ └─ lottie/
│ │
│ ├─ scss/ # Global styles
│ │ ├─ abstracts/ # Variables, mixins, colors, typography
│ │ │ ├─ \_variables.scss
│ │ │ ├─ \_mixins.scss
│ │ │ ├─ \_colors.scss
│ │ │ └─ \_typography.scss
│ │ │
│ │ ├─ layout/ # Layout-specific styles (header, footer, grid)
│ │ ├─ ui/ # Reusable UI component styles (\_button.scss, \_modal.scss)
│ │ ├─ features/ # Feature-specific styles (plant.scss, habits.scss)
│ │ ├─ helpers/ # Utility/helper classes (spacing, flex, animations)
│ │ └─ main.scss # Imports everything in order
│ │
│ ├─ types/ # Shared TypeScript types/interfaces
│ │ ├─ habit.ts
│ │ ├─ user.ts
│ │ └─ plant.ts
│ │
│ └─ main.tsx # React entry point
│
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
