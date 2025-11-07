# Data Architecture Documentation

## Overview

This document describes the data-driven architecture implemented for the Wasatch BioLabs LIMS prototype dashboard.

## Transformation Summary

### Before: Hardcoded Components
```tsx
// Old approach - hardcoded values
<ActionCard
  icon={<FileText size={24} />}
  title="Create Order"
  description="Submit a new testing request..."
  color="purple"
/>
<ActionCard
  icon={<Microscope size={24} />}
  title="Add Sample"
  description="Register new specimens..."
  color="purple"
/>
// ... repeated for every card
```

### After: Data-Driven Components
```tsx
// New approach - map over centralized data
{dashboardData.actionCards.map((card) => (
  <ActionCard
    key={card.id}
    icon={getIcon(card.icon, 24)}
    title={card.title}
    description={card.description}
    color={card.color}
  />
))}
```

## File Structure

```
data/
├── dashboardData.ts          # All dashboard data with TypeScript types
└── DATA_ARCHITECTURE.md      # This file

utils/
└── iconMapper.tsx            # Icon string to component mapping
```

## Data Schema

### 1. Action Cards
```typescript
interface ActionCard {
  id: string;              // Unique identifier
  icon: string;            // Icon name (e.g., 'FileText')
  title: string;           // Card title
  description: string;     // Card description
  color: string;           // Color theme
}
```

**Current Data:**
- Create Order
- Add Sample
- Generate Report

### 2. Stats Cards
```typescript
interface StatsCard {
  id: string;              // Unique identifier
  icon: string;            // Icon name
  value: string;           // Numeric value to display
  title: string;           // Stat title
}
```

**Current Data:**
- Active Orders: 12
- Pending Tests: 25
- Due Soon: 4

### 3. Activity Items
```typescript
interface ActivityItem {
  id: string;              // Unique identifier
  icon: string;            // Icon name
  title: string;           // Activity title
  description: string;     // Activity description
  badge: string;           // Status badge text
  badgeColor: "blue" | "gray" | "green";
  progress?: number;       // Optional progress (0-100)
  showButton?: boolean;    // Show view button
}
```

**Current Data:**
- Project Updated (Processing, blue)
- Results Updated (Analyzing, gray, 75% progress)
- Specimen Batch Approved (Completed, green)

### 4. Projects
```typescript
interface Project {
  id: string;              // Unique identifier
  name: string;            // Project name
  status: string;          // Status text
  statusColor: "green" | "blue" | "yellow" | "gray";
  orderCount: number;      // Number of orders
}
```

**Current Data:**
- BioTech R&D Study (Active, 8 orders)
- Pharma QC Validation (In Progress, 12 orders)
- Clinical Trial Phase II (Active, 15 orders)
- Environmental Safety (Pending, 3 orders)

### 5. Orders
```typescript
interface Order {
  id: string;              // Unique identifier
  orderId: string;         // Display order ID
  company: string;         // Company name
  status: string;          // Status text
  statusColor: "green" | "yellow" | "blue" | "gray";
}
```

**Current Data:**
- F678: GeneTech Solutions (Received)
- E345: BioCore Pharmaceuticals (Pending)
- C789: MediLabs Research (In Progress)
- B456: AdvanceBio Corp (Completed)

## Icon Mapping System

The `iconMapper.tsx` utility provides centralized icon management:

```typescript
export const getIcon = (iconName: string, size: number = 24) => {
  const icons: Record<string, React.ReactNode> = {
    FileText: <FileText size={size} />,
    Microscope: <Microscope size={size} />,
    Clock: <Clock size={size} />,
    TrendingUp: <TrendingUp size={size} />,
  };
  return icons[iconName] || <FileText size={size} />;
};
```

**Benefits:**
- Stores icon names as strings in data
- Converts to React components at render time
- Easy to extend with new icons
- Consistent sizing across components

## Component Pattern Examples

### Pattern 1: Simple Mapping
```tsx
<div className="grid grid-cols-3 gap-4">
  {dashboardData.statsCards.map((stat) => (
    <StatsCard key={stat.id} {...stat} />
  ))}
</div>
```

### Pattern 2: Mapping with Icon Conversion
```tsx
{dashboardData.actionCards.map((card) => (
  <ActionCard
    key={card.id}
    icon={getIcon(card.icon, 24)}
    {...card}
  />
))}
```

### Pattern 3: Table Row Mapping
```tsx
<tbody>
  {dashboardData.activeProjects.map((project) => (
    <ProjectRow key={project.id} {...project} />
  ))}
</tbody>
```

## Benefits Achieved

### 1. Maintainability
- ✅ Update all data in one file
- ✅ No need to modify component logic for data changes
- ✅ Clear separation of data and presentation

### 2. Scalability
- ✅ Easy to add new items (just add to array)
- ✅ Simple to extend with new data types
- ✅ Reusable across multiple pages/components

### 3. Type Safety
- ✅ Full TypeScript interfaces for all data
- ✅ Compile-time error checking
- ✅ IntelliSense support in IDEs

### 4. Performance
- ✅ Efficient rendering with `.map()`
- ✅ Proper React keys for optimization
- ✅ No unnecessary re-renders

### 5. Reusability
- ✅ Data exported for use in other components
- ✅ Types exported for consistent interfaces
- ✅ Icon mapper utility available everywhere

## Future Expansion

To add new pages/components:

1. **Create new data file** (e.g., `specimenData.ts`)
2. **Define TypeScript interfaces**
3. **Add sample data**
4. **Export from index.ts**
5. **Use in components with `.map()`**

Example:
```typescript
// specimenData.ts
export interface Specimen {
  id: string;
  specimenId: string;
  type: string;
  status: string;
  dateReceived: string;
}

export const specimenData: Specimen[] = [
  { id: '1', specimenId: 'SP001', type: 'Blood', status: 'Processing', dateReceived: '2024-01-15' },
  // ... more specimens
];
```

## Best Practices

1. **Always use unique IDs** for mapping keys
2. **Keep data separate** from component logic
3. **Use TypeScript interfaces** for type safety
4. **Export types** for reuse across components
5. **Document data structures** with comments
6. **Use consistent naming** conventions
7. **Group related data** logically

## Related Files

- `dashboardData.ts` - Main data file
- `iconMapper.tsx` - Icon mapping utility
- `WasatchDashboard.tsx` - Dashboard implementation
- `index.ts` - Public exports
- `README.md` - General documentation

