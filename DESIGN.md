---
name: Technical Support System
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#5b5e67'
  on-secondary: '#ffffff'
  secondary-container: '#dfe2ed'
  on-secondary-container: '#61646d'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#dfe2ed'
  secondary-fixed-dim: '#c3c6d1'
  on-secondary-fixed: '#181c23'
  on-secondary-fixed-variant: '#43474f'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for precision, reliability, and high-utility technical environments. It targets technicians in the field and operations managers who require immediate clarity and error-free data entry. 

The visual style is **Corporate / Modern**, prioritizing functional density over decorative elements. It utilizes a structured hierarchy to organize complex technical information, using color strategically as a navigational tool rather than just aesthetic flair. The interface evokes a sense of professional competence and systematic order, ensuring that even under high-pressure support scenarios, the UI remains calm and legible.

## Colors

The palette is anchored by a deep professional navy, providing a strong sense of authority and stability. The background uses a crisp light gray to reduce eye strain during long periods of use. 

Category-specific colors are used for rapid identification of service types:
- **Primary (Navy):** Used for navigation, primary actions, and core structural elements.
- **Surface (Light Gray):** The canvas for all application modules.
- **IT/Informatics (Blue):** Clear, technical blue for digital infrastructure tasks.
- **Electrical (Gold):** High-visibility yellow for power-related systems.
- **Civil/Building (Green):** Representing stability and infrastructure maintenance.
- **Security (Coral):** High-alert red for safety and electronic security systems.
- **Telecom (Purple):** Distinctive purple for connectivity and data networks.

## Typography

The design system exclusively uses **Inter** to ensure maximum legibility across all digital touchpoints. Its high x-height and neutral design make it ideal for reading technical specs, ticket numbers, and diagnostic data.

- **Headlines:** Use Bold and Semi-Bold weights to create a clear hierarchy.
- **Body Text:** Primarily 14px for standard UI elements to maintain high data density without sacrificing readability.
- **Labels:** Use Medium weight and slight letter spacing for all-caps or small-scale descriptors like status tags or field headers.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for desktop environments to accommodate complex dashboards and data tables. On mobile devices, it collapses to a **4-column grid** for ease of use in the field.

The spacing rhythm is built on an **8px base unit**. All padding, margins, and component heights must be multiples of 8 (or 4 for micro-adjustments). This ensures a consistent vertical rhythm that aids in scanning lists and forms quickly. 

- **Containers:** Use 24px (lg) padding for primary content cards.
- **Stacking:** Use 16px (md) gaps between related input fields.
- **Compactness:** Use 8px (base) for list items to maximize visibility of multiple tickets.

## Elevation & Depth

Visual hierarchy is achieved through a combination of **tonal layers** and **ambient shadows**. Because the background is a subtle gray (#f8fafc), white surfaces naturally "lift" off the page.

- **Level 0 (Floor):** The #f8fafc background.
- **Level 1 (Card/Surface):** White background with a very soft, 10% opacity shadow (0px 2px 4px rgba(30, 41, 59, 0.05)).
- **Level 2 (Hover/Active):** Slightly deeper shadow (0px 4px 12px rgba(30, 41, 59, 0.08)) to indicate interactivity.
- **Level 3 (Modals/Popovers):** Higher elevation with a diffused shadow to draw focus.

Borders are kept low-contrast (1px solid #e2e8f0) to define sections without creating visual noise.

## Shapes

The shape language is **Soft (Level 1)**. This ensures the interface feels approachable and modern while maintaining the "serious" and "structured" look required for technical software.

- **Standard Elements (Inputs, Buttons, Small Cards):** 4px (0.25rem) corner radius.
- **Large Containers (Feature Cards, Modals):** 8px (0.5rem) corner radius.
- **Badges/Chips:** 12px (0.75rem) to create a distinct visual contrast from square-like data fields.

## Components

### Buttons
- **Primary:** Solid Navy (#1e293b) with white text. High emphasis.
- **Secondary:** Outline Navy with transparent background. Medium emphasis.
- **Category-Specific:** Small action buttons within category views should use the respective category color as an accent border or text color.

### Chips & Badges
Used heavily for service categories. Badges should use a 10% opacity background of the category color with full-saturation text for readability. (e.g., IT badge has light blue background with dark blue text).

### Input Fields
Standardized with a 1px border (#cbd5e1). Active states use a 2px Navy border. Error states use the Security Red (#ef4444). Labels are always positioned above the input.

### Cards
White background, 4px radius, and Level 1 shadow. Cards for specific service tickets should include a 4px vertical "accent bar" on the left edge using the category color (IT, Electrical, etc.) for instant identification.

### Lists
Dense, clean rows with subtle dividers. Every list item should have a clear "Status" indicator and a primary descriptor in Semi-Bold Inter.

### Dashboard Gauges
For technical monitoring, use circular progress indicators with category colors to represent load, uptime, or completion percentages.