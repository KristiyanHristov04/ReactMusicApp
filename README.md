# ReactMusicApp 🎵

A modern web application for managing and exploring music, built with React and Supabase. This application provides a seamless experience for music enthusiasts to manage their favourite songs and artists.

Preview 👉 [react-music-app-delta.vercel.app](react-music-app-delta.vercel.app)

## Features 🚀

- **User Authentication**: Secure signup and login functionality
- **Song Management**: 
  - Add, edit, and delete songs
  - Upload song thumbnails
  - Mark songs as favorites
  - Track song listening counts
- **Artist Management**:
  - Add, edit, and delete artists
  - View artist profiles and their songs
- **Explore**: Browse and search through the music library
- **Responsive Design**: Beautiful, modern UI that works on all devices

## Technologies Used 💻

- **Frontend**:
  - React 18
  - React Router DOM for navigation
  - MDB React UI Kit for UI components
  - Formik & Yup for form validation
  - React Icons for beautiful icons
  - CSS Modules for styling
  - Search debounce request optimization
  - Vitest, react testing library, jsdom for Unit Tests

- **Backend**:
  - Supabase for backend services
  - Supabase Auth for user authentication
  - Supabase Storage for file uploads

- **Development**:
  - VS Code
  - Vite for fast development and building
  - Modern ES6+ JavaScript

## Getting Started 🏁

1. Clone the repository:
```bash
git clone https://github.com/KristiyanHristov04/ReactMusicApp.git
cd ReactMusicApp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Supabase Configuration ⚙️

### Database Setup
1. Disable Row Level Security (RLS) for the following tables:
   - `songs`
   - `artists`
   - `songs_artists`
   - `users_favourite_songs`

To disable RLS for each table:
1. Go to Authentication > Policies
2. Find each table
3. Click on "Enable RLS" to disable it (toggle should be grey)

### Storage Setup
1. Create a new bucket named `song-files`
2. Create the following folders inside the bucket:
   - `artist-images/`
   - `song-audios/`
   - `song-images/`

3. Add a storage policy to allow CRUD operations:
   - Go to Storage > Policies
   - Select the `song-files` bucket
   - Click "New Policy"
   - Choose "For full customization"
   - Allow all operations (CRUD)
   - Target roles choose "all"
   - Save the policy
   
   This will allow anyone to perform all operations (read, create, update, delete). For better security in production, you may want to create specific policies to restrict access based on user roles and authentication.

## Project Structure 📁

- `/src` - Source code
  - `/components` - React components
  - `/context` - React context providers
  - `/guards` - Authentication guards
  - `/supabase` - Supabase configuration
  - `/styles` - Global styles
  - `/hooks` - Custom hooks
  - `/common` - Extracted functions
  - `/schemas` - Forms schemas
  - `/services` - Fetch requests

## Supabase Database Diagram 

![supabasedatabase](https://github.com/user-attachments/assets/25f82a87-6265-4260-acca-bb4e65bafb45)
