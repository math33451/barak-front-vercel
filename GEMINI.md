# Barak Project Summary

## Overview

This is a [Next.js](https://nextjs.org/) project named "barak". The project is built with **React** and aims to establish a robust foundation for a car dealership management system.

**Project Details:**

*   **Name:** barak
*   **Version:** 0.1.0
*   **Description:** Barak will be a system for registering and controlling car dealerships, with sales simulation and projection as its main feature.
*   **Package Manager:** This project uses **npm**. Please do not use other package managers like yarn or pnpm.

## Architecture

This project adopts the **Model-View-ViewModel (MVVM)** architectural pattern. All new features and code modifications should adhere to this structure to ensure consistency and maintainability.

*   **Model:** Represents the data and business logic of the application. This includes data fetching, validation, and any other data manipulation tasks.
*   **View:** The user interface (UI) of the application, composed of React components. The View is responsible for displaying data from the ViewModel and forwarding user interactions to it. In this project, the Views are the `.tsx` files within the `src/app` and `src/components` directories.
*   **ViewModel:** Acts as an intermediary between the Model and the View. It handles the presentation logic, manages the state of the View, and exposes data to the View through observable properties. The ViewModel should not have a direct reference to the View.

### MVVM Implementation Guidelines

To maintain a clear separation of concerns and ensure consistency across the project, follow these guidelines:

1.  **Models (`src/services`):**
    *   **Purpose:** Handle all data-related operations (fetching, sending, transforming raw data).
    *   **Structure:** Create a dedicated service file for each major domain or feature (e.g., `src/services/DashboardService.ts`, `src/services/VehiclePageService.ts`, `src/services/AuthService.ts`, etc.).
    *   **Content:** Export functions that interact with APIs, databases, or other data sources. These functions should return raw data or data transformed into application-specific types (defined in `src/types`).
    *   **No UI Logic:** Services should be pure and contain no React-specific code or UI logic.

2.  **ViewModels (`src/viewmodels`):**
    *   **Purpose:** Provide data and methods to the Views, abstracting away the complexity of the Models and managing view-specific state.
    *   **Structure:** Implement ViewModels as custom React hooks (e.g., `src/viewmodels/useDashboardViewModel.ts`, `src/viewmodels/useVehiclePageViewModel.ts`, `src/viewmodels/useLoginViewModel.ts`, etc.).
    *   **Content:**
        *   Import and utilize functions from the `src/services` (Models).
        *   Manage local state using `useState`, `useReducer`, etc.
        *   Expose data and event handlers (e.g., `handleSubmit`, `handleFilterChange`) to the View.
        *   Perform data transformations specific to the View's needs.
    *   **No Direct UI:** ViewModels should not render UI elements directly.

3.  **Views (`src/app` & `src/components`):**
    *   **Purpose:** Render the user interface and capture user interactions.
    *   **Structure:**
        *   **Pages (`src/app`):** Top-level Views that typically consume a ViewModel hook to get data and logic for the entire page.
        *   **Components (`src/components`):** Reusable UI elements. They can be "dumb" (presentational, receiving all data via props) or "smart" (container, consuming a ViewModel if they manage complex state or logic independently).
    *   **Content:**
        *   Call ViewModel hooks (e.g., `const { data, handlers } = useSomeViewModel();`).
        *   Pass data and handlers down to child components.
        *   Render HTML/JSX based on the data received.
    *   **Minimal Logic:** Views should contain minimal business or presentation logic, delegating it to ViewModels.

4.  **Types (`src/types`):**
    *   **Purpose:** Centralize all TypeScript interface and type definitions used across Models, ViewModels, and Views.
    *   **Structure:** A single `src/types/index.ts` file is used for all common types. For very complex type hierarchies, subdirectories could be considered.

## Navigation

Navigation in this project is handled by Next.js's file-based routing system, which is centered around the `src/app` directory.

*   Each folder inside `src/app` represents a URL segment.
*   A `page.tsx` file within a folder makes that route publicly accessible and renders the UI for that segment.
*   For example, the file `src/app/dashboard/page.tsx` corresponds to the `/dashboard` URL path.

## File Structure

*   **`src/`**: The main application source directory.
    *   **`app/`**: Contains the application's pages and layouts, defining the routing structure.
        *   `bancos/page.tsx`
        *   `clientes/page.tsx`
        *   `configuracoes/page.tsx`
        *   `dashboard/layout.tsx`
        *   `dashboard/page.tsx`
        *   `despesas/page.tsx`
        *   `financiamento/page.tsx`
        *   `login/page.tsx`
        *   `relatorios/page.tsx`
        *   `veiculos/page.tsx`
        *   `vendas/page.tsx`
        *   `favicon.ico`
        *   `globals.css`
        *   `layout.tsx`
        *   `page.tsx` (Home page)
    *   **`components/`**: Houses reusable React components.
        *   **`dashboard/`**: Components specific to the dashboard.
            *   `PerformanceChart.tsx`
            *   `RecentVehiclesTable.tsx`
            *   `SalesChart.tsx`
            *   `StatCard.tsx`
            *   `VehicleStockChart.tsx`
        *   **`layout/`**: Layout-related components.
            *   `DashboardLayout.tsx`
            *   `Header.tsx`
            *   `Sidebar.tsx`
        *   **`ui/`**: Generic UI components.
            *   `AppointmentsTable.tsx`
            *   `BrandDistributionChart.tsx`
            *   `Card.tsx`
            *   `ChartContainer.tsx`
            *   `DataTable.tsx`
            *   `StatusBadge.tsx`
    *   **`contexts/`**: React Context API providers.
        *   `AuthContext.tsx`
    *   **`services/`**: The Model layer, containing data fetching and business logic.
        *   `AuthService.ts`
        *   `BankService.ts`
        *   `ClientService.ts`
        *   `DashboardService.ts`
        *   `ExpenseService.ts`
        *   `FinancingService.ts`
        *   `ReportService.ts`
        *   `SalePageService.ts`
        *   `SettingsService.ts`
        *   `VehiclePageService.ts`
    *   **`viewmodels/`**: The ViewModel layer, implementing presentation logic as custom React hooks.
        *   `useBankViewModel.ts`
        *   `useClientViewModel.ts`
        *   `useDashboardViewModel.ts`
        *   `useExpenseViewModel.ts`
        *   `useFinancingViewModel.ts`
        *   `useLoginViewModel.ts`
        *   `useReportViewModel.ts`
        *   `useSalePageViewModel.ts`
        *   `useSettingsViewModel.ts`
        *   `useVehiclePageViewModel.ts`
    *   **`types/`**: Centralized TypeScript type definitions.
        *   `index.ts`
*   **`public/`**: Stores static assets like images and icons.
*   **Configuration Files:** Standard Next.js and TypeScript project configuration files.
    *   `eslint.config.mjs`
    *   `next.config.ts`
    *   `package-lock.json`
    *   `package.json`
    *   `postcss.config.mjs`
    *   `README.md`
    *   `tsconfig.json`

## Dependencies & Scripts

*   **Main Dependencies:**
    *   `chart.js`: Charting library.
    *   `lucide-react`: Icon library.
    *   `next`: The React framework for production.
    *   `react`: The JavaScript library for building user interfaces.
    *   `react-chartjs-2`: React wrapper for Chart.js.
    *   `react-dom`: The package for working with the DOM in React.
*   **Development Dependencies:**
    *   `@eslint/eslintrc`: ESLint configuration utilities.
    *   `@tailwindcss/postcss`: PostCSS plugin for Tailwind CSS.
    *   `@types/node`: TypeScript type definitions for Node.js.
    *   `@types/react`: TypeScript type definitions for React.
    *   `@types/react-dom`: TypeScript type definitions for React DOM.
    *   `eslint`: For code linting.
    *   `eslint-config-next`: ESLint configuration for Next.js.
    *   `tailwindcss`: For CSS styling.
    *   `typescript`: The TypeScript language.
*   **Scripts:**
    *   `npm run dev`: Starts the development server with Turbopack.
    *   `npm run build`: Creates a production build of the application.
    *   `npm run start`: Starts the production server.
    *   `npm run lint`: Lints the codebase for errors.

In summary, the project is a well-structured Next.js application using the MVVM architecture. The file structure and the dependencies suggest a modern and robust technology stack. The next steps would be to start implementing the features in the respective directories, following the defined architecture.