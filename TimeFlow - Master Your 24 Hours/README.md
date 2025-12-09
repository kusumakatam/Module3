# TimeFlow ⏰

**Master Your 24 Hours** - A beautiful and intuitive time tracking web application that helps you visualize how you spend every minute of your day.


**Video Contents:**
- Main features walkthrough
- Dashboard and analytics visualization
- "No data available" state demonstration
- Activity logging and editing functionality
- Explanation of AI tools used in development

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization library
- **Lucide React** - Modern icon library
- **date-fns** - Date manipulation utilities
- **Vite** - Fast build tool and dev server

### Backend
- **Cloudflare Workers** - Serverless edge compute platform
- **Hono** - Fast, lightweight web framework
- **Zod** - TypeScript-first schema validation

### Database & Authentication
- **Cloudflare D1** - SQLite-based database at the edge
- **Mocha Auth** - Secure Google OAuth authentication

### Development Tools
- **AI-Assisted Development** - Built with Mocha AI for rapid prototyping and implementation

## ✨ Features

### Core Functionality
- ✅ **User Authentication** - Secure Google OAuth sign-in
- ✅ **Activity Logging** - Add daily activities with minute precision
- ✅ **Category Management** - 10 predefined categories (Work, Study, Sleep, Exercise, etc.)
- ✅ **Daily Limit Enforcement** - Maximum 1,440 minutes (24 hours) per day
- ✅ **Inline Editing** - Edit or delete activities with a smooth UI
- ✅ **Date Selection** - Navigate through different days

### Analytics Dashboard
- 📊 **Multiple Visualization Modes**:
  - Pie Chart - Category distribution
  - Bar Chart - Activity comparison
  - Timeline View - 24-hour breakdown
- 📈 **Key Statistics**:
  - Total time logged
  - Activity count
  - Top category
  - Categories used
- 🎨 **Category Color Coding** - Consistent colors across charts
- ⏰ **24-Hour Unlock** - Special "Analyse" button appears when full day is logged

### Design
- 🎨 Modern, beautiful interface with gradients and animations
- 📱 Fully responsive design (mobile-first)
- ♿ Accessible components
- 🌈 Color-coded categories for easy visualization
- ✨ Smooth transitions and hover effects

## 🏃‍♂️ How to Run the Project Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Google OAuth credentials (for authentication)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd timeflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.dev.vars` file in the root directory:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
   ```

   To get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5173/auth/callback` as an authorized redirect URI

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run migrate` - Run database migrations
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run preview` - Preview production build locally

## 📁 Project Structure

```
timeflow/
├── src/
│   ├── react-app/           # Frontend React application
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (routes)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── worker/              # Cloudflare Worker (backend)
│   │   └── index.ts         # API routes and handlers
│   └── shared/              # Shared types and utilities
│       └── types.ts
├── migrations/              # Database migration files
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── wrangler.json           # Cloudflare Workers configuration
```

## 🤖 AI Tools Used in Development

This project was built with the assistance of **Mocha AI**, an AI-powered development platform. Here's how AI helped accelerate development:

1. **Architecture Design** - AI suggested the tech stack and project structure optimized for Cloudflare Workers
2. **Code Generation** - Rapid scaffolding of React components, API routes, and database schemas
3. **Best Practices** - Ensured TypeScript type safety, proper error handling, and responsive design
4. **UI/UX Design** - Generated modern, accessible component designs with Tailwind CSS
5. **Database Schema** - Created normalized database structure with proper indexes
6. **Testing & Debugging** - Identified and fixed issues quickly through iterative development

The AI acted as a pair programmer, allowing for faster iteration and higher code quality while maintaining full control over the final implementation.

## 🔮 Future Improvements

- [ ] **Export Data** - Download activity data as CSV or JSON
- [ ] **Weekly/Monthly Reports** - Extended analytics beyond daily view
- [ ] **Custom Categories** - Allow users to create their own activity categories
- [ ] **Goal Setting** - Set time goals for specific categories
- [ ] **Notifications** - Reminders to log activities
- [ ] **Dark Mode** - Theme toggle for better UX
- [ ] **Activity Templates** - Save and reuse common activity sets
- [ ] **Comparative Analytics** - Compare different days/weeks/months
- [ ] **Time Blocking** - Plan activities in advance
- [ ] **Collaboration** - Share and compare with friends (gamification)
- [ ] **Mobile Apps** - Native iOS and Android applications
- [ ] **Offline Support** - PWA with offline capability
- [ ] **Data Backup** - Automatic cloud backups
- [ ] **Integration** - Connect with calendar apps (Google Calendar, Outlook)

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Mocha AI](https://getmocha.com)
- Icons from [Lucide](https://lucide.dev)
- Charts powered by [Recharts](https://recharts.org)
- Hosted on [Cloudflare Workers](https://workers.cloudflare.com)

---

**Made with ❤️ using AI-assisted development**
