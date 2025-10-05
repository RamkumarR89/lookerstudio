# Report Studio - Folder Structure Design

## Overview
This document outlines the folder structure for our Angular 20 report builder application, similar to Looker Studio. The structure follows Angular best practices with feature-based architecture for scalability and maintainability.

## Proposed Folder Structure

```
reportstudio/
├── src/
│   ├── app/
│   │   ├── core/                          # Core module (singleton services, guards, interceptors)
│   │   │   ├── services/                  # Application-wide services
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── theme.service.ts
│   │   │   ├── guards/                    # Route guards
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── unsaved-changes.guard.ts
│   │   │   ├── interceptors/              # HTTP interceptors
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── loading.interceptor.ts
│   │   │   ├── models/                    # Core data models
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── report.model.ts
│   │   │   │   └── data-source.model.ts
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                        # Shared components, directives, pipes
│   │   │   ├── components/                # Reusable UI components
│   │   │   │   ├── chart/                 # Chart components
│   │   │   │   │   ├── bar-chart/
│   │   │   │   │   ├── line-chart/
│   │   │   │   │   ├── pie-chart/
│   │   │   │   │   └── table-chart/
│   │   │   │   ├── data-grid/             # Data table component
│   │   │   │   ├── date-picker/
│   │   │   │   ├── dropdown/
│   │   │   │   ├── modal/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── toolbar/
│   │   │   │   └── loading-spinner/
│   │   │   ├── directives/                # Custom directives
│   │   │   │   ├── drag-drop.directive.ts
│   │   │   │   └── resize.directive.ts
│   │   │   ├── pipes/                     # Custom pipes
│   │   │   │   ├── date-format.pipe.ts
│   │   │   │   └── number-format.pipe.ts
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/                      # Feature modules (lazy loaded)
│   │   │   ├── dashboard/                 # Dashboard feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── dashboard-grid/
│   │   │   │   │   ├── dashboard-header/
│   │   │   │   │   └── report-card/
│   │   │   │   ├── services/
│   │   │   │   │   └── dashboard.service.ts
│   │   │   │   ├── dashboard-routing.module.ts
│   │   │   │   └── dashboard.module.ts
│   │   │   │
│   │   │   ├── report-builder/            # Report builder feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── canvas/            # Report canvas area
│   │   │   │   │   ├── property-panel/    # Properties panel
│   │   │   │   │   ├── toolbar/           # Builder toolbar
│   │   │   │   │   ├── element-library/   # Drag-drop elements
│   │   │   │   │   └── preview/           # Report preview
│   │   │   │   ├── services/
│   │   │   │   │   ├── report-builder.service.ts
│   │   │   │   │   └── canvas.service.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── report-element.model.ts
│   │   │   │   │   └── canvas.model.ts
│   │   │   │   ├── report-builder-routing.module.ts
│   │   │   │   └── report-builder.module.ts
│   │   │   │
│   │   │   ├── data-sources/              # Data source management
│   │   │   │   ├── components/
│   │   │   │   │   ├── data-source-list/
│   │   │   │   │   ├── connection-wizard/
│   │   │   │   │   └── field-mapper/
│   │   │   │   ├── services/
│   │   │   │   │   └── data-source.service.ts
│   │   │   │   ├── data-sources-routing.module.ts
│   │   │   │   └── data-sources.module.ts
│   │   │   │
│   │   │   ├── reports/                   # Report management
│   │   │   │   ├── components/
│   │   │   │   │   ├── report-list/
│   │   │   │   │   ├── report-viewer/
│   │   │   │   │   └── report-settings/
│   │   │   │   ├── services/
│   │   │   │   │   └── report.service.ts
│   │   │   │   ├── reports-routing.module.ts
│   │   │   │   └── reports.module.ts
│   │   │   │
│   │   │   └── auth/                      # Authentication feature
│   │   │       ├── components/
│   │   │       │   ├── login/
│   │   │       │   ├── register/
│   │   │       │   └── profile/
│   │   │       ├── services/
│   │   │       │   └── auth.service.ts
│   │   │       ├── auth-routing.module.ts
│   │   │       └── auth.module.ts
│   │   │
│   │   ├── layout/                        # Layout components
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.scss
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   ├── sidebar.component.html
│   │   │   │   └── sidebar.component.scss
│   │   │   ├── footer/
│   │   │   └── main-layout/
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts
│   │
│   ├── assets/                            # Static assets
│   │   ├── images/
│   │   │   ├── logos/
│   │   │   ├── icons/
│   │   │   └── backgrounds/
│   │   ├── fonts/
│   │   ├── data/                          # Sample data files
│   │   └── i18n/                          # Internationalization
│   │       ├── en.json
│   │       └── es.json
│   │
│   ├── environments/                      # Environment configurations
│   │   ├── environment.ts
│   │   ├── environment.prod.ts
│   │   └── environment.staging.ts
│   │
│   ├── styles/                            # Global styles
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _themes.scss
│   │   └── styles.scss
│   │
│   ├── index.html
│   └── main.ts
│
├── e2e/                                   # End-to-end tests
├── docs/                                  # Documentation
│   ├── architecture.md
│   ├── api.md
│   └── user-guide.md
├── .angular/
├── .vscode/                               # VS Code configuration
│   ├── settings.json
│   └── extensions.json
├── package.json
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── karma.conf.js
├── .eslintrc.json
├── .gitignore
└── README.md
```

## Key Features of This Structure

### 1. Core Module
- Single instance services (singletons)
- Authentication guards and interceptors
- Global error handling
- Application-wide utilities

### 2. Shared Module
- Reusable components across features
- Common directives and pipes
- UI component library

### 3. Feature Modules
- **Dashboard**: Main landing page with report overview
- **Report Builder**: Drag-and-drop report creation interface
- **Data Sources**: Database connection and data source management
- **Reports**: Report viewing and management
- **Auth**: Authentication and user management

### 4. Layout Components
- Application shell components
- Navigation components
- Responsive design components

## Benefits of This Structure

1. **Scalability**: Easy to add new features as modules
2. **Maintainability**: Clear separation of concerns
3. **Performance**: Lazy loading for feature modules
4. **Reusability**: Shared components and services
5. **Testing**: Each module can be tested independently
6. **Team Development**: Different teams can work on different features

## Next Steps
1. Initialize Angular 20 application
2. Create the core module structure
3. Implement shared components
4. Build feature modules one by one
5. Add routing and navigation
6. Implement the UI layout

This structure provides a solid foundation for building a comprehensive report builder application similar to Looker Studio.