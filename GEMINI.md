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
    *   **Structure:** Create a dedicated service file for each major domain or feature (e.g., `src/services/DashboardService.ts`, `src/services/VehicleService.ts`).
    *   **Content:** Export functions that interact with APIs, databases, or other data sources. These functions should return raw data or data transformed into application-specific types (defined in `src/types`).
    *   **No UI Logic:** Services should be pure and contain no React-specific code or UI logic.

2.  **ViewModels (`src/viewmodels`):**
    *   **Purpose:** Provide data and methods to the Views, abstracting away the complexity of the Models and managing view-specific state.
    *   **Structure:** Implement ViewModels as custom React hooks (e.g., `src/viewmodels/useDashboardViewModel.ts`, `src/viewmodels/useVehicleListViewModel.ts`).
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
    *   **Structure:** A single `src/types/index.ts` file or subdirectories for complex type hierarchies (e.g., `src/types/dashboard/index.ts`).

## Navigation

Navigation in this project is handled by Next.js's file-based routing system, which is centered around the `src/app` directory.

*   Each folder inside `src/app` represents a URL segment.
*   A `page.tsx` file within a folder makes that route publicly accessible and renders the UI for that segment.
*   For example, the file `src/app/dashboard/page.tsx` corresponds to the `/dashboard` URL path.

## File Structure

*   **`src/app/`**: The core of the application's routing and pages. Each subdirectory is a route, as described in the Navigation section.
    *   `bancos` (banks)
    *   `clientes` (customers)
    *   `configuracoes` (settings)
    *   `dashboard`
    *   `despesas` (expenses)
    *   `financiamento` (financing)
    *   `login`
    *   `relatorios` (reports)
    *   `veiculos` (vehicles)
    *   `vendas` (sales)
*   **`src/components/`**: Contains reusable React components that form the Views.
    *   `dashboard`, `layout`, `ui`: Subdirectories for organizing components by feature or type.
*   **`src/services/`**: Contains the Model layer, responsible for data operations.
*   **`src/viewmodels/`**: Contains the ViewModel layer, implementing presentation logic as custom hooks.
*   **`src/types/`**: Centralized TypeScript type definitions.
*   **`public/`**: Stores static assets like images and icons.
*   **Configuration Files:** Standard Next.js and TypeScript project configuration files.

## Dependencies & Scripts

*   **Main Dependencies:** `next`, `react`, `react-dom`, `chart.js`, `react-chartjs-2`
*   **Development Dependencies:** `typescript`, `eslint`, `tailwindcss`
*   **Scripts:**
    *   `npm run dev`: Starts the development server.
    *   `npm run build`: Creates a production build.
    *   `npm run start`: Starts the production server.
    *   `npm run lint`: Lints the codebase for errors.

In summary, the project is a well-structured Next.js application using the MVVM architecture. The file structure and the dependencies suggest a modern and robust technology stack. The next steps would be to start implementing the features in the respective directories, following the defined architecture.
