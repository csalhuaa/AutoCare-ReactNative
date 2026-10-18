# AutoCare Mobile 🚗🔧

> Aplicación móvil y web multiplataforma universal para la gestión y control de mantenimiento vehicular y análisis de gastos, construida con **React Native**, **Expo SDK 58** y **TypeScript**.

[![React Native](https://img.shields.io/badge/React_Native-0.88.0-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-58.0.14-000020?logo=expo&logoColor=white)](https://docs.expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11.5.0-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Descripción General

**AutoCare** resuelve la problemática del descontrol y la falta de seguimiento oportuno en el mantenimiento preventivo y correctivo de vehículos particulares mediante el seguimiento automatizado del odómetro, la evaluación determinista de alertas y el análisis financiero en tiempo real.

Desarrollado en el marco del **Laboratorio 04 - Plataformas Emergentes (UNSA)**, este proyecto evoluciona la experiencia monoplataforma previa en Android hacia una arquitectura multiplataforma universal capaz de ejecutarse con idéntica experiencia de usuario en Android, iOS y navegadores Web a partir de una única base de código compartida.

---

## 🌟 Características Principales

- **Ficha Vehicular y Control del Odómetro**: Registro y actualización de marca, modelo, año, placa y kilometraje actual con sincronización inmediata en el panel principal.
- **Gestión de Servicios (CRUD)**: Registro de órdenes de mantenimiento preventivo y correctivo con taller, costo, fecha, notas y metas futuras de kilometraje y tiempo.
- **Motor Determinista de Criticidad y Alertas**: Evaluación en tiempo real del estado de cada servicio según kilómetros restantes (`<= 1,000 km`) y días de vigencia (`<= 30 días`):
  - 🔴 **Vencido (`OVERDUE`)**: Alerta prioritaria en el banner superior e insignia roja.
  - 🟡 **Próximo (`UPCOMING`)**: Advertencia preventiva con conteo exacto de días o kilómetros faltantes.
  - 🟢 **Al día (`OK`)**: Mantenimiento vigente y operativo.
- **Métricas Financieras y Control de Inversión**:
  - `totalSpent`: Inversión total acumulada en mantenimiento vehicular.
  - `averageCost`: Gasto promedio por servicio ejecutado.
  - `highestCostService`: Identificación del mantenimiento con mayor impacto presupuestario.
- **Historial Inteligente con Filtros Semánticos**: Lista virtualizada de alto rendimiento (`FlatList`) con barra de búsqueda reactiva por texto y chips de filtrado por estado.
- **Acciones Destructivas Seguras**: Diálogo modal nativo superpuesto (`ConfirmModal`) con confirmación explícita para evitar pérdidas accidentales de información.
- **Persistencia Local Offline-First**: Almacenamiento asíncrono en formato JSON utilizando `@react-native-async-storage/async-storage` sin requerir conexión a Internet.

---

## 🏗️ Arquitectura Modular del Software

La estructura del proyecto implementa principios de arquitectura limpia y desacoplamiento en capas dentro del directorio `src/`:

```
src/
├── domain/                      # Capa de Dominio (Reglas de Negocio Puras)
│   ├── models/                  # Vehicle.ts, Maintenance.ts, MaintenanceStatus.ts
│   └── services/                # MaintenanceStatusCalculator.ts, ExpenseAnalyticsCalculator.ts
├── data/                        # Capa de Datos y Persistencia Local
│   ├── mockData.ts              # Semilla inicial de datos de prueba
│   └── storageService.ts        # Repositorio AsyncStorage (CRUD asíncrono)
├── theme/                       # Sistema de Diseño y Tokens Visuales
│   ├── colors.ts                # Paleta semántica (Primario, Estados, Superficies)
│   ├── spacing.ts               # Métricas de diseño, padding y border radius
│   └── typography.ts            # Escalas tipográficas de TextStyle
└── presentation/                # Capa de Presentación e Interfaces de Usuario
    ├── components/              # Header, Card, Button, Badge, FilterChip,
    │                            # InputField, ConfirmModal, ExpenseSummaryCard
    └── screens/                 # HomeScreen, VehicleScreen, MaintenanceScreen, HistoryScreen
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos

- [Node.js](https://nodejs.org/) (v20 o superior recomendado)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Instalación de Dependencias

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/csalhuaa/AutoCare-ReactNative.git
   cd AutoCare-ReactNative
   ```

2. Instalar los paquetes con pnpm:
   ```bash
   pnpm install
   ```

3. Verificar la integridad de tipos:
   ```bash
   pnpm tsc --noEmit
   ```

### Ejecución de la Aplicación

- **Iniciar el empaquetador Metro**:
  ```bash
  pnpm start
  ```
- **Ejecutar en emulador/dispositivo Android**:
  ```bash
  pnpm android
  ```
- **Ejecutar en simulador/dispositivo iOS**:
  ```bash
  pnpm ios
  ```
- **Ejecutar en navegador Web**:
  ```bash
  pnpm web
  ```

---

## 👥 Integrantes

- **Cristian Raul Saya Vargas** - Universidad Nacional de San Agustín de Arequipa
- **Cristian Roberto Salhua Apfata** - Universidad Nacional de San Agustín de Arequipa

---

## 📄 Licencia

Este proyecto se encuentra bajo la Licencia MIT. Para mayores detalles, consultar el archivo [LICENSE](LICENSE).
