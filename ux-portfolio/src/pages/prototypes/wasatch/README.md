# Wasatch BioLabs LIMS Prototype

This folder contains the interactive prototype for the Wasatch BioLabs Laboratory Information Management System (LIMS).

## Structure

```
wasatch/
├── WasatchDashboard.tsx          # Main dashboard component
├── index.ts                       # Barrel exports for clean imports
├── assets/                        # Images, logos, and static assets
├── components/                    # Shared components (modals, cards, etc.)
├── data/
│   └── dashboardData.ts          # Centralized data structure with TypeScript types
├── utils/
│   └── iconMapper.tsx            # Icon mapping utility
├── pages/                         # Additional pages (order details, specimen view, etc.)
└── README.md                      # This file
```

## Data Architecture

All dashboard data is centralized in `data/dashboardData.ts` for maintainability and reusability.

### Available Data Types

```typescript
ActionCard      // Quick action buttons
StatsCard       // Statistical overview cards
ActivityItem    // Recent activity feed items
Project         // Active project entries
Order           // Order entries
DashboardData   // Complete dashboard data structure
```

### Usage Examples

#### Import Data and Types
```tsx
import { dashboardData } from './data/dashboardData';
import type { Project, Order } from './data/dashboardData';
```

#### Use Data in Components
```tsx
// Map over projects
{dashboardData.activeProjects.map((project) => (
  <ProjectRow key={project.id} {...project} />
))}

// Access specific data
const totalOrders = dashboardData.recentOrders.length;
```

#### Icon Mapping
```tsx
import { getIcon } from './utils/iconMapper';

// Use in components
<div>{getIcon('FileText', 24)}</div>
```

### Adding New Data

To add new data structures:

1. **Define TypeScript interface** in `dashboardData.ts`:
```typescript
export interface NewDataType {
  id: string;
  name: string;
  // ... other fields
}
```

2. **Add data to dashboardData object**:
```typescript
export const dashboardData = {
  // ... existing data
  newData: [
    { id: '1', name: 'Item 1' },
    // ...
  ]
};
```

3. **Update DashboardData interface**:
```typescript
export interface DashboardData {
  // ... existing fields
  newData: NewDataType[];
}
```

4. **Export from index.ts** (optional):
```typescript
export type { NewDataType } from './data/dashboardData';
```

## Component Patterns

### Reusable Table Rows
```tsx
function ProjectRow({ name, status, statusColor, orderCount }: Project) {
  // Component implementation
}

// Usage
{dashboardData.activeProjects.map((project) => (
  <ProjectRow key={project.id} {...project} />
))}
```

### Dynamic Icon Rendering
```tsx
{dashboardData.statsCards.map((stat) => (
  <StatsCard
    key={stat.id}
    icon={getIcon(stat.icon, 20)}
    {...stat}
  />
))}
```

## Components

### WasatchDashboard
Main dashboard view showing:
- Active orders and projects
- Recent activity feed with progress tracking
- Quick action cards (Create Order, Add Sample, Generate Report)
- Navigation sidebar with expandable menus
- Statistics overview (Active Orders, Pending Tests, Due Soon)

All data is dynamically rendered from `dashboardData.ts` using efficient `.map()` patterns.

## Benefits of This Architecture

✅ **Centralized Data**: Single source of truth for all dashboard data  
✅ **Type Safety**: Full TypeScript support with interfaces  
✅ **Reusability**: Data can be used across multiple components/pages  
✅ **Maintainability**: Easy to update data without touching component logic  
✅ **Scalability**: Simple to extend with new data types and structures  
✅ **Efficiency**: Components map over data arrays instead of hardcoding

## Usage

```tsx
import { WasatchDashboard, dashboardData, getIcon } from './prototypes/wasatch';
```

## Future Development

This prototype will expand to include:
- Order management pages
- Specimen tracking views
- Results and reporting interfaces
- User management screens
- Additional data structures for each view
