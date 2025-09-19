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