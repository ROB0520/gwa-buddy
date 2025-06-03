# GWA Buddy

A sleek, modern web application that helps Nueva Ecija University of Science and Technology (NEUST) students easily calculate their General Weighted Average (GWA) based on their course grades and units.

> **Note**: This is an unofficial, student-run platform created to help fellow NEUST students calculate their GWA more efficiently. It is not affiliated with or endorsed by Nueva Ecija University of Science and Technology.

## 🎓 Overview

GWA Buddy is an unofficial web-based calculator platform designed specifically for NEUST students. It streamlines the process of calculating General Weighted Average by providing an intuitive interface with preset course selections for different academic programs, making GWA calculation quick, accurate, and hassle-free.

## ✨ Features

### Core Functionality
- **GWA Calculator**: Calculate your General Weighted Average using the standard formula: Σ(Units × Grade) / Σ(Units)
- **Program-Specific Course Selection**: Choose from a comprehensive database of NEUST programs and their respective courses
- **Smart Preset System**: Quick-select entire semesters, years, or major-specific courses with a single click
- **Dynamic Course Management**: Add, remove, and modify courses with real-time GWA updates
- **Grade Input Validation**: Supports standard grade scales (1.00-5.00) with proper validation

### User Experience
- **Dark/Light Theme Toggle**: Seamless theme switching with system preference detection and localStorage persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices with adaptive layouts
- **Fast Performance**: Built with Next.js for optimal loading speeds and smooth interactions
- **Accessible Interface**: WCAG compliant design with keyboard navigation and screen reader support
- **Interactive Calculations**: Real-time GWA calculation with detailed formula breakdown

### Technical Features
- **Modern UI Components**: Built with shadcn/ui and Radix UI for consistent, beautiful interfaces
- **Type Safety**: Full TypeScript implementation for robust error handling
- **Mobile-First Design**: Responsive components that work seamlessly across all device sizes
- **Progressive Enhancement**: Core functionality works even with JavaScript disabled
- **SEO Optimized**: Complete meta tags and Open Graph integration for better discoverability

### Academic Features
- **Multi-Program Support**: Supports various NEUST academic programs with accurate course data
- **Major-Specific Filtering**: Filter courses by major/specialization within programs
- **Core Course Recognition**: Distinguishes between core program courses and major-specific courses
- **Semester Organization**: Courses organized by year and semester for easy navigation
- **Unit Calculation**: Automatic unit calculation and validation for accurate GWA computation

## 🛠 Tech Stack

- **Framework**: Next.js 15 - React framework with App Router
- **Styling**: Tailwind CSS 4 - Utility-first CSS framework
- **UI Components**: shadcn/ui + Radix UI - Modern component library
- **Icons**: Lucide React - Beautiful, customizable icons
- **Typography**: Geist font family - Modern, readable typography
- **Language**: TypeScript - Type-safe JavaScript
- **Theme System**: next-themes - Advanced dark/light mode implementation
- **Build Tool**: Turbopack - Ultra-fast bundler for development
- **Deployment**: Static site hosting ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ROB0520/gwa-buddy.git
   cd gwa-buddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

### Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## 📁 Project Structure

```
├── next.config.ts               # Next.js configuration
├── components.json              # shadcn/ui configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── eslint.config.mjs           # ESLint configuration
├── app/
│   ├── data.json               # Course and program data
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Homepage with GWA calculator
│   ├── globals.css             # Global styles and Tailwind imports
│   └── manifest.json           # PWA manifest
├── components/
│   ├── gwa-calculator.tsx      # Main GWA calculator component
│   ├── theme-provider.tsx      # Theme context provider
│   ├── theme-toggle.tsx        # Theme switcher component
│   └── ui/                     # shadcn/ui components
│       ├── badge.tsx           # Badge component
│       ├── button.tsx          # Button component
│       ├── card.tsx            # Card component
│       ├── command.tsx         # Command palette component
│       ├── dialog.tsx          # Dialog/modal component
│       ├── drawer.tsx          # Mobile drawer component
│       ├── input.tsx           # Input field component
│       ├── popover.tsx         # Popover component
│       ├── select.tsx          # Select dropdown component
│       ├── separator.tsx       # Separator component
│       └── ...                 # Additional UI components
├── hooks/
│   └── use-mobile.ts           # Mobile device detection hook
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions and cn helper
└── public/
    ├── logo.svg                # Application logo
    ├── og-image.png            # Open Graph image
    └── ...                     # Additional static assets
```

## 🎨 Theming & Customization

The application features a comprehensive theming system:

### Theme Toggle
- **System Detection**: Automatically respects user's system preference (dark/light)
- **Manual Override**: Toggle between dark and light modes with smooth transitions
- **Persistence**: Remembers user's choice using localStorage
- **Dynamic Updates**: Real-time theme switching without page reload

### Course Data Management
- **JSON Configuration**: Course and program data stored in `app/data.json`
- **Type Safety**: Strongly typed course and program interfaces
- **Easy Updates**: Simple JSON structure for adding new programs or courses
- **Flexible Structure**: Supports multiple majors, semesters, and year levels

### Customization Options
- **Brand Colors**: Easily customizable through Tailwind CSS variables
- **Component Variants**: Consistent design system with shadcn/ui
- **Responsive Breakpoints**: Configurable mobile/desktop layouts
- **Animation System**: Smooth transitions and micro-interactions

## 🔧 Configuration

### Adding New Programs/Courses
Update the `app/data.json` file with new program data:

```json
{
  "programs": {
    "PROGRAM_CODE": {
      "code": "PROGRAM_CODE",
      "name": "Program Name",
      "majors": [
        {
          "code": "MAJOR_CODE",
          "name": "Major Name"
        }
      ]
    }
  },
  "courses": {
    "PROGRAM_CODE": [
      {
        "code": "COURSE_CODE",
        "name": "Course Name",
        "units": 3,
        "year": 1,
        "semester": 1,
        "major": "MAJOR_CODE"
      }
    ]
  }
}
```

### SEO Configuration
Update meta tags in `app/layout.tsx`:
- **Title and Description**: Update site metadata
- **Open Graph Images**: Replace with your branded assets
- **Domain Configuration**: Update metadataBase URL

### Build Process
```bash
# Build for production
npm run build

# The build output will be in the .next/ directory
# Upload to your hosting provider (Vercel, Netlify, etc.)
```

## 📱 PWA Features

- **Installable**: Can be installed as a Progressive Web App
- **App-like Experience**: Native app feel on mobile devices
- **Fast Loading**: Optimized for performance and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity with shadcn/ui patterns
- Test on multiple devices and screen sizes
- Ensure accessibility compliance (WCAG 2.1)
- Add proper TypeScript types for new features

### Code Style
- Use ESLint configuration provided
- Follow React hooks best practices
- Implement proper error handling
- Write descriptive commit messages
- Add comments for complex logic

## 📈 Future Enhancements

- **Grade Analytics**: Visual charts and GWA trends over time
- **Goal Setting**: Target GWA calculator and required grades
- **Export Features**: PDF generation of grade reports
- **Multi-Language Support**: Support for Filipino and other languages
- **Advanced Filtering**: More sophisticated course filtering options

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

For questions, suggestions, or course additions, please email: [gwabuddy@aleczr.link](mailto:gwabuddy@aleczr.link)

---

**Live Site**: [gwa.vps.aleczr.link](https://gwa.vps.aleczr.link)

Made with ❤️ for the NEUST community