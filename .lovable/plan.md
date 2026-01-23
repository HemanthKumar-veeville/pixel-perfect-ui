
# Prodify Dashboard - Implementation Plan

## Overview
This plan outlines the implementation of a productivity dashboard application that replicates the UI shown in the reference image. The app will be built using the existing React + Vite + TypeScript + Tailwind CSS + shadcn/ui setup.

## UI Analysis from Reference Image

The dashboard consists of the following major sections:

### Left Sidebar
- User profile section with avatar, name, and online status
- Main navigation menu (Home, Prodify AI, My tasks, Inbox, Calendar, Reports & Analytics)
- "My Projects" section with project list (Product launch, Team brainstorm, Branding launch)
- Settings link at bottom
- Promotional card with "Invite people" button

### Main Content Area
- Header with date and personalized greeting
- Quick action buttons (Ask AI, Get tasks updates, Create workspace, Connect apps)
- Dashboard widgets arranged in a grid layout:
  - My Tasks widget (collapsible task groups)
  - Projects widget
  - Calendar widget with mini calendar and meeting card
  - My Goals widget with progress bars
  - Reminders widget

## Color Scheme
- Primary accent: Purple/Lavender gradient (#9b87f5 to #7E69AB)
- Background: Light purple tint
- Cards: White with subtle shadows
- Status badges: Yellow (In Progress), Gray (To Do), Orange (Upcoming)
- Priority badges: Orange (High), Green (Low)

---

## Implementation Structure

### Phase 1: Update Theme and Create Base Layout

**1.1 Update CSS Variables (src/index.css)**
- Add custom purple/lavender color palette
- Define gradient colors for accent text
- Add custom status colors (yellow, orange, green for badges)

**1.2 Create Dashboard Layout Component**
- New file: `src/components/layout/DashboardLayout.tsx`
- Uses SidebarProvider from shadcn/ui
- Responsive layout with sidebar and main content area

### Phase 2: Build Sidebar Components

**2.1 App Sidebar Component**
- New file: `src/components/sidebar/AppSidebar.tsx`
- User profile section with Avatar component
- Navigation menu items using SidebarMenu components
- My Projects section with collapsible group
- Settings link
- Promotional card at bottom

**2.2 Navigation Items Data**
- Define navigation structure with icons from lucide-react

### Phase 3: Build Main Content Components

**3.1 Dashboard Header Component**
- New file: `src/components/dashboard/DashboardHeader.tsx`
- Date display
- Personalized greeting with gradient text
- Quick action button row

**3.2 My Tasks Widget**
- New file: `src/components/dashboard/TasksWidget.tsx`
- Collapsible sections for task groups (In Progress, To Do, Upcoming)
- Task list with checkboxes, priority badges, and due dates
- Add task functionality placeholder

**3.3 Projects Widget**
- New file: `src/components/dashboard/ProjectsWidget.tsx`
- Create new project button
- Project cards with icons and teammate counts

**3.4 Calendar Widget**
- New file: `src/components/dashboard/CalendarWidget.tsx`
- Mini week view calendar
- Meeting card with attendees and Google Meet link

**3.5 Goals Widget**
- New file: `src/components/dashboard/GoalsWidget.tsx`
- Goal items with progress bars using Progress component

**3.6 Reminders Widget**
- New file: `src/components/dashboard/RemindersWidget.tsx`
- Collapsible "Today" section
- Reminder items with action icons

### Phase 4: Compose Dashboard Page

**4.1 Update Index Page**
- Integrate DashboardLayout
- Arrange widgets in responsive grid
- Apply proper spacing and styling

---

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx
│   ├── sidebar/
│   │   └── AppSidebar.tsx
│   └── dashboard/
│       ├── DashboardHeader.tsx
│       ├── TasksWidget.tsx
│       ├── ProjectsWidget.tsx
│       ├── CalendarWidget.tsx
│       ├── GoalsWidget.tsx
│       └── RemindersWidget.tsx
├── data/
│   └── mockData.ts
└── pages/
    └── Index.tsx (updated)
```

---

## Technical Details

### Mock Data Structure
Create sample data for:
- Tasks with status, priority, due dates
- Projects with teammates count
- Calendar events
- Goals with progress percentages
- Reminders

### Component Dependencies
All components will use existing shadcn/ui primitives:
- Card, CardHeader, CardContent for widgets
- Avatar, AvatarImage, AvatarFallback for user photos
- Badge for status/priority indicators
- Progress for goal progress bars
- Checkbox for task items
- Collapsible for expandable sections
- Button for actions
- Sidebar components for navigation

### Styling Approach
- Tailwind CSS for all styling
- Custom CSS variables for theme colors
- Gradient text using background-clip
- Rounded corners and subtle shadows matching the design
- Responsive grid layout using CSS Grid

### Icon Usage
All icons from lucide-react:
- Home, Sparkles, CheckSquare, Inbox, Calendar, BarChart3 for navigation
- Plus, MoreHorizontal, Settings for actions
- ChevronDown, ChevronLeft, ChevronRight for expand/collapse
- Video for Google Meet indicator

---

## Responsive Considerations
- Sidebar collapses to icon-only view on smaller screens
- Widget grid adjusts from 2-column to single column on mobile
- Touch-friendly button sizes
- Proper spacing for readability

## Expected Outcome
A fully functional static dashboard UI that matches the reference image, with:
- Collapsible sidebar navigation
- Interactive task sections (expand/collapse)
- Visual consistency with the purple/lavender theme
- Clean, modern card-based widget layout
- Proper typography and spacing
