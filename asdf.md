Based on your v0dev.md document and my analysis of your codebase, here's a comprehensive prompt for v0.dev:

---

## **Create a Modern Inventory Management Navigation System**

I need you to create a complete navigation system for a Next.js 15 inventory management application. This should be a modern, mobile-first design with sophisticated responsive behavior.

### **Requirements:**

**Framework & Architecture:**

- Next.js 15 with TypeScript and React 19
- Fixed header + responsive sidebar + scrollable content area layout
- Dark slate theme with glassmorphism effects
- Mobile-first responsive design

**Header Component (Fixed at Top):**

- Height: 64px, fixed positioning with z-index 50
- Background: `bg-slate-900/95` with `backdrop-blur-md`
- Border: `border-b border-slate-700/50`
- Three-section layout: Left (menu + title) | Center (search) | Right (actions)

**Left Section:**

- Hamburger menu button (40x40px) that toggles between Menu and X icons
- Dynamic page title that changes based on current route
- Button styling: `bg-slate-800/50 hover:bg-slate-700/50` with scale animations

**Center Section:**

- Desktop: Full search bar with placeholder "Global search - items, purchases, suppliers..."
- Mobile: Full search bar with no placeholder text.
- Blue focus states with scaling animations
- Clear button when text is present

**Right Section:**

- Notifications bell with red indicator dot
- User profile button with blue gradient background
- All buttons 40x40px with consistent hover states

**Sidebar Navigation:**

- Width: 192px (w-48) on desktop
- Dark slate-900 background with smooth slide animations (300ms)
- **Desktop behavior**: Push layout (content area adjusts width)
- **Mobile behavior**: Overlay with backdrop

**Navigation Items (9 items with icons):**

1. Dashboard (BarChart icon)
2. Items (Package icon)
3. Suppliers (Users icon)
4. Purchases (ShoppingCart icon)
5. Sales (DollarSign icon)
6. Recipes (ChefHat icon)
7. Reports (FileText icon)
8. Batches (Archive icon)
9. Import/Export (Upload icon)

**Interactive States:**

- Active: `bg-blue-600` with shadow
- Hover: `bg-slate-800` with smooth transitions
- 44px minimum touch targets for mobile

**Mobile Features:**

- Search overlay that replaces header content
- Semi-transparent backdrop for sidebar overlay
- Tap-outside and escape key to close
- Responsive breakpoints: < 768px mobile, ≥ 768px desktop

**Dropdowns:**

- **Notifications**: 320px width, priority color borders, sample alerts
- **User Menu**: 288px width, business info header, settings sections

**Technical Requirements:**

- Implement proper click-outside detection
- LocalStorage persistence for desktop sidebar state
- Smooth animations and transitions throughout
- Responsive screen size detection
- Zoom prevention for mobile devices

**Design Details:**

- Use Inter font family
- Slate color palette: slate-900/800/700/600/500
- Blue accents for interactive elements
- Glassmorphism effects with backdrop blur
- 8px spacing grid system
- Hardware acceleration for smooth performance

Please create a complete, working implementation with all components, proper TypeScript types, and responsive behavior. Include state management for sidebar toggle, search functionality, and dropdown interactions.
