# GWA Buddy

A modern web application that helps Nueva Ecija University of Science and Technology (NEUST) students calculate their General Weighted Average (GWA) and class standing based on course grades and scoring criteria.

> **Note**: This is an unofficial, student-run platform created to help fellow NEUST students. It is not affiliated with or endorsed by Nueva Ecija University of Science and Technology.

## Features

### GWA Calculator
- **Program & Curriculum Selection** — Choose from a comprehensive database of NEUST programs with dynamically loaded curriculum data
- **Smart Preset System** — Quick-select entire semesters, years, major-specific courses, or core-only courses with a single click
- **Dynamic Course Management** — Add, remove, and modify courses through curriculum picker or custom rows
- **Real-time GWA Computation** — Calculate your GWA using the formula Σ(Units × Grade) / Σ(Units) with detailed step-by-step breakdown
- **Grade Input Validation** — Standard 1.00–5.00 grade scale with proper validation
- **Course Filtering** — Filter by major/specialization, core courses, year level, and semester

### Class Standing Calculator
- **Custom Grading Criteria** — Define categories with custom percentage weights that must total 100%
- **Activity Score Tracking** — Input scores for individual assignments, quizzes, exams, and other graded activities
- **Real-time Computation** — Instantly calculates overall percentage and transmutated grade
- **Transmutation Scale** — Maps percentage scores to the standard 1.00–5.00 grade system
- **Goal Grade Analysis** — Set a target grade and get insights on gaps, improvement opportunities, and specific activities with the most lost points
- **Extra Credit Support** — Toggle to allow scores exceeding maximum points for bonus/extra credit
- **PDF Export** — Generate a detailed PDF report with course info, formula breakdown, category summaries, and grade breakdown
- **Collapsible Categories** — Organize grading sections for cleaner navigation

### Shared Features
- **URL Template Sharing** — Share course configurations and grades via compressed, encoded URL parameters (compressed with fflate, encoded with nuqs)
- **Template ID System** — Optional custom template IDs for identifying shared templates, embedded directly in the share payload
- **Interactive Tour System** — Guided walkthrough for both calculators to help new users get started
- **Responsive Design** — Optimized for desktop, tablet, and mobile with adaptive layouts using drawers for mobile and popovers for desktop
- **Dark/Light Theme** — System preference detection with manual toggle, persisted in localStorage
- **Confirmation Dialogs** — Prevent accidental data loss with confirm-before-action dialogs (using react-confirm)
- **Toast Notifications** — Feedback for copy, export, and error actions (using sonner)
- **Accessible Interface** — Keyboard navigation, screen reader support, and semantic HTML
- **Academic Information Section** — Reference guide to NEUST grading system, Latin honors, retention policies, and more with scroll-spy navigation

## Tech Stack

- **Framework**: Next.js 16 (App Router) — React server components with client-side interactivity
- **Language**: TypeScript — Full type safety across the codebase
- **Styling**: Tailwind CSS v4 — Utility-first CSS with PostCSS configuration
- **Typography**: Figtree (sans) + Fira Code (mono) — Variable fonts
- **UI Components**: Custom shadcn/ui-inspired components built on Radix UI and Ark UI primitives
- **Icons**: Lucide React — Consistent icon library
- **Forms**: react-hook-form + Zod — Type-safe form validation and handling
- **State**: nuqs — Type-safe URL query parameter state management
- **PDF Generation**: pdf-lib + pdf-lib-draw-table-beta — Serverless PDF export with custom tables
- **Compression**: fflate — Lightweight compression for share URL payloads
- **Theme**: next-themes — Dark/light mode with system preference support
- **Navigation**: Vaul (drawer), Radix UI (popover, dialog, sheet)
- **Analytics**: Umami — Self-hosted, privacy-focused analytics (optional, env-controlled)
- **Deployment**: Static site hosting (VPS)

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout: theme, fonts, header, toaster
│   ├── page.tsx                # Homepage — GWA calculator + acads info
│   ├── gwa-calculator.tsx      # GWA calculator component (client)
│   ├── acads-info.tsx          # Academic information reference section
│   ├── globals.css             # Global styles + Tailwind v4 imports
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── manifest.json           # PWA manifest
│   ├── robots.txt              # SEO robots configuration
│   ├── class-standing/
│   │   ├── page.tsx            # Class standing page (server)
│   │   └── grade-calculator.tsx # Class standing calculator (client)
│   └── ...                     # Static assets (icons, favicon)
├── components/
│   ├── ui/                     # 33 reusable UI primitives
│   │   ├── accordion.tsx       # Collapsible accordion
│   │   ├── alert-dialog.tsx    # Confirmation/alert dialogs
│   │   ├── badge.tsx           # Status badge
│   │   ├── button.tsx          # Button variants
│   │   ├── button-group.tsx    # Grouped buttons
│   │   ├── card.tsx            # Card container
│   │   ├── checkbox.tsx        # Checkbox input
│   │   ├── collapsible.tsx     # Expandable sections
│   │   ├── combobox.tsx        # Autocomplete dropdown
│   │   ├── command.tsx         # Command palette / searchable list
│   │   ├── dialog-shadcn.tsx   # Modal dialog
│   │   ├── drawer.tsx          # Mobile drawer (Vaul)
│   │   ├── dropdown-menu.tsx   # Dropdown menu
│   │   ├── empty.tsx           # Empty state placeholder
│   │   ├── field.tsx           # Form field wrapper
│   │   ├── input.tsx           # Text input
│   │   ├── input-group.tsx     # Input with addons
│   │   ├── label.tsx           # Form label
│   │   ├── popover.tsx         # Floating popover
│   │   ├── scroll-area.tsx     # Scrollable container
│   │   ├── scroll-spy.tsx      # Scroll-based navigation
│   │   ├── scroller.tsx        # Horizontal scroll container
│   │   ├── select.tsx          # Native select
│   │   ├── separator.tsx       # Visual divider
│   │   ├── sheet.tsx           # Side sheet (mobile nav)
│   │   ├── sonner.tsx          # Toast notifications
│   │   ├── spinner.tsx         # Loading spinner
│   │   ├── table.tsx           # Data table
│   │   ├── textarea.tsx        # Multi-line input
│   │   ├── tooltip.tsx         # Hover tooltip
│   │   └── tour.tsx            # Interactive feature tour
│   ├── confirm-dialog.tsx      # Helper for confirmable dialogs
│   ├── header.tsx              # Navigation header with mobile sheet
│   ├── logo.tsx                # SVG logo component
│   ├── theme-provider.tsx      # next-themes provider wrapper
│   └── theme-switcher.tsx      # Dark/light toggle button
├── data/
│   ├── types.ts                # Curriculum, Course, Term, Major types
│   ├── programs.ts             # Program definitions with curriculum refs
│   └── curriculums/            # 27 program curriculum data files
│       ├── bsit/latest.ts
│       ├── bsds/latest.ts
│       ├── bsce/latest.ts
│       └── ...                 # 24 more programs
├── hooks/
│   ├── use-mobile.ts           # Mobile detection hook
│   ├── use-as-ref.ts           # Ref forwarding helper
│   └── ...                     # Utility hooks
├── lib/
│   ├── utils.ts                # cn() and other helpers
│   └── compose-refs.ts         # Ref composition utility
└── public/
    ├── fonts/                  # Figtree + Fira Code font files
    └── ...                     # Icons, OG image, favicon
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/aleczr/gwa-buddy.git
cd gwa-buddy
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL (defaults to `https://gwa.vps.aleczr.link`) |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | No | Umami analytics script URL |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | No | Umami website ID |

### Adding a New Program/Curriculum

1. Create a curriculum file at `data/curriculums/<internal-name>/latest.ts` following the `Curriculum` type from `data/types.ts`
2. Add the program entry to `data/programs.ts` with its internal name and curriculum reference

## Sharing Templates

Both calculators support sharing via compressed URL parameters:

- **GWA Calculator** — Course selections are encoded as varint-compressed range indexes in the `ss` parameter. Template IDs are embedded within the same payload.
- **Class Standing Calculator** — Course setup, categories, and scores are JSON-serialized, compressed with fflate, and base64-encoded in the `t` parameter. Template IDs are stored as part of the encoded course tuple.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions, suggestions, or course additions: [gwabuddy@aleczr.link](mailto:gwabuddy@aleczr.link)

---

**Live Site**: [gwa.vps.aleczr.link](https://gwa.vps.aleczr.link)

Made with ❤️ for the NEUST community
