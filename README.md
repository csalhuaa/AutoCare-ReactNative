# AutoCare Mobile 🚗🔧

> Universal cross-platform vehicle maintenance and expense tracking application built with **React Native**, **Expo SDK 58**, and **TypeScript**.

[![React Native](https://img.shields.io/badge/React_Native-0.88.0-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-58.0.14-000020?logo=expo&logoColor=white)](https://docs.expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11.5.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Overview

**AutoCare** solves the problem of delayed or neglected vehicle maintenance through automated odometer tracking, deterministic alert evaluation, and real-time financial expense analysis. Developed for **Laboratorio 04 - Plataformas Emergentes (UNSA)**, this project expands the monoplatform Android experience into a unified cross-platform architecture that runs seamlessly on Android, iOS, and Web from a single codebase.

---

## 🌟 Key Features

- **Vehicle Profile & Odometer Management**: Track vehicle model, brand, year, license plate, and current mileage with instant dashboard reflection.
- **Service Records (CRUD)**: Log preventative and corrective maintenance entries with workshop name, cost, service date, notes, and target future thresholds.
- **Deterministic Criticality Engine**: Real-time evaluation of service urgency based on remaining kilometers (`<= 1,000 km`) and days (`<= 30 days`).
  - 🔴 **Overdue (`OVERDUE`)**: Urgent warning banner and red badge.
  - 🟡 **Upcoming (`UPCOMING`)**: Preventative warning with exact remaining days/km.
  - 🟢 **Operational (`OK`)**: Maintained within safe thresholds.
- **Financial Analytics & Investment Metrics**:
  - `totalSpent`: Total accumulated maintenance cost.
  - `averageCost`: Average investment per maintenance service.
  - `highestCostService`: Pinpoints the most expensive service for budget forecasting.
- **Smart History with Semantic Filters**: High-performance virtualized list (`FlatList`) with full-text search and status filter chips.
- **Safe Destructive Actions**: Native modal dialog (`ConfirmModal`) preventing accidental record deletion.
- **Offline-First Persistence**: Local asynchronous JSON storage using `@react-native-async-storage/async-storage`.

---

## 🏗️ Clean Modular Architecture

The codebase follows layered architectural principles:

```
src/
├── domain/                      # Pure Business Logic & Domain Models
│   ├── models/                  # Vehicle.ts, Maintenance.ts, MaintenanceStatus.ts
│   └── services/                # MaintenanceStatusCalculator.ts, ExpenseAnalyticsCalculator.ts
├── data/                        # Persistence & Seeding Layer
│   ├── mockData.ts              # Seed data
│   └── storageService.ts        # AsyncStorage repository
├── theme/                       # Design System & Styling Tokens
│   ├── colors.ts                # Semantic palette
│   ├── spacing.ts               # Layout metrics & radius
│   └── typography.ts            # TextStyle scales
└── presentation/                # UI Components & Application Screens
    ├── components/              # Header, Card, Button, Badge, FilterChip,
    │                            # InputField, ConfirmModal, ExpenseSummaryCard
    └── screens/                 # HomeScreen, VehicleScreen, MaintenanceScreen, HistoryScreen
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/csalhuaa/AutoCare-ReactNative.git
   cd AutoCare-ReactNative
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Type-check:
   ```bash
   pnpm tsc --noEmit
   ```

### Running the App

- **Start Metro Bundler**:
  ```bash
  pnpm start
  ```
- **Run on Android**:
  ```bash
  pnpm android
  ```
- **Run on iOS**:
  ```bash
  pnpm ios
  ```
- **Run on Web Browser**:
  ```bash
  pnpm web
  ```

---

## 👥 Authors

- **Cristian Raul Saya Vargas** - Universidad Nacional de San Agustín de Arequipa
- **Cristian Roberto Salhua Apfata** - Universidad Nacional de San Agustín de Arequipa

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
