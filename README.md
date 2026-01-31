# Transjakarta - Fleet Management System (Prototyping)

This project is a React-based web application for a Fleet Management System, developed as part of a technical test for a Frontend Engineer position at Transjakarta. The application provides real-time monitoring of vehicle locations and statuses using the MBTA API.

## 🚀 Live Demo

You can view the development version of this app in AI Studio: [Transjakarta Fleet Management](https://ai.studio/apps/drive/1FZby5nKQZgsCsu7n2LcaAWhRqC7L9xaJ)

## ✨ Features

- **Real-time Vehicle Tracking**: Fetches and displays live vehicle data from the MBTA API.
- **Advanced Filtering**:
  - Filter by **Route** with multiple selection support.
  - Filter by **Trip Headsign** (Destination) with multiple selection support.
  - **Performance Optimized**: Both filters implement **infinite scroll** using a custom Intersection Observer hook to handle large datasets efficiently, meeting the technical requirement for virtualized lists/infinite scrolling.
  - Built-in search functionality within dropdowns for quick navigation.
- **Pagination**:
  - Customizable items per page (10, 25, 50).
  - Data range display (e.g., "1–10 of 250").
  - Automated calculation of total pages and easy navigation.
- **Responsive Vehicle Cards**:
  - Shows vehicle label, status, and precise coordinates.
  - Integration with **Reverse Geocoding** to show human-readable addresses.
  - Relative time formatting for the last update.
  - Interactive retry mechanism for geocoding failures.
- **Detailed Vehicle View**:
  - Opens in a modern, mobile-friendly bottom-sheet styled modal.
  - **Map Visualization**: Interactive map using Leaflet, showing the exact location of the vehicle.
  - Real-time metadata including occupancy status, speed, bearing, and detailed route/trip data.
  - Direct links to Google Maps for external navigation.

## 🛠 Tech Stack

- **Core**: React 18 (Vite)
- **Language**: **TypeScript** (Strongly typed for better reliability and maintenance)
- **State & Data Fetching**: **TanStack Query (React Query)** for caching, background refetching, and efficient server-state management.
- **Styling**: Tailwind CSS (Premium UI with dark mode components)
- **Icons**: Lucide React
- **Maps**: React-Leaflet / Leaflet
- **HTTP Client**: Regular fetch

## 🏗 Architecture Overview

The project follows a modular and clean architecture:

- **`/components`**: UI components organized by feature (common, vehicle, filters, pagination).
- **`/hooks`**: Custom hooks for business logic (e.g., `useVehicles`, `usePagination`, `useInfiniteScroll`, `useReverseGeocoding`).
- **`/services`**: API abstraction layer and utility helpers (formatters, error handlers).
- **`/types`**: Centralized TypeScript definitions for API responses and application state.

### Design Decisions

- **React Query**: Used to decouple server state from UI, providing automatic caching and background updates.
- **Custom Hooks**: Encapsulated complex logic into reusable hooks to maintain clean component code.
- **Infinite Scrolling**: Implemented on filter lists to ensure smooth performance even with hundreds of route/trip options.
- **Aesthetic Excellence**: Focused on a "premium" feel with glassmorphism effects, smooth transitions, and a clean color palette inspired by Transjakarta's identity.

## 🏃 How to Run Locally

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Steps

1. **Clone the repository**:

   ```bash
   git clone [repository-url]
   cd transjak-test/run-prototyping
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   bun install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open the browser**:
   Navigate to `http://localhost:5173` to view the application.

## ✅ Technical Specifications Met

- [x] Fetch vehicle data via REST API.
- [x] Display vehicles as cards with pagination.
- [x] Filter vehicles by Route and Trip (Multi-select).
- [x] Infinite scroll for long filter lists.
- [x] View vehicle details in a popup/sheet.
- [x] **Bonus**: TypeScript implementation.
- [x] **Bonus**: Vehicle location on a map.
- [x] Loading indicators and user-friendly error messages.

---

Developed for Transjakarta Frontend Engineer Technical Test.
