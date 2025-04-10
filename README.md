# ReactMusicApp 🎵

A modern web application for managing and exploring music, built with React and Supabase. This application provides a seamless experience for music enthusiasts to manage their favourite songs and artists.

Preview 👉 [Music App](https://react-music-app-delta.vercel.app/)

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

## Music App Screenshots

### Login Page
![login](https://github.com/user-attachments/assets/94fbabb2-0fd2-43ec-a902-4d3a9afc334e)

### Signup Page
![signup](https://github.com/user-attachments/assets/c7355e8f-9033-4825-b51f-4912751c27a0)

### Explore Page
![explore](https://github.com/user-attachments/assets/57270648-d6aa-4468-b7e8-48d725c978e4)

### Artists Page
![artists](https://github.com/user-attachments/assets/6b362d56-19fb-40cd-ac29-47c98aff2bc0)

### Add Song Page
![addsong](https://github.com/user-attachments/assets/9d5b7a6b-a4f6-4740-a0ed-ced147700696)

### Add Artist Page
![addartist](https://github.com/user-attachments/assets/47f1ff68-f97c-4965-91eb-974ab3c5cfb4)

### Favorites Page
![favorites](https://github.com/user-attachments/assets/94ca8055-c480-424f-be14-bd384c78c535)

### My Songs Page
![mysongs](https://github.com/user-attachments/assets/a210dcef-002a-4eb5-945e-5877dec90c7e)

### My Artists Page
![myartists](https://github.com/user-attachments/assets/8f1edd5c-0919-421c-bc25-fb4171f57f6b)

### Edit Song Page
![editsong](https://github.com/user-attachments/assets/36c32cad-146b-4aa2-9d10-182d5a98e187)

### Delete Song Page
![deletesong](https://github.com/user-attachments/assets/92a69945-93f5-455e-8dbb-e458584ff78f)

### Artist Information Page
![artistinformation](https://github.com/user-attachments/assets/01c1f68d-48b0-4b99-9182-2121f2693548)

### Edit Artist Page
![editartist](https://github.com/user-attachments/assets/297d7c1f-f18e-4efd-aaaa-0252abb4411f)

### Delete Artist Page
![deleteartist](https://github.com/user-attachments/assets/015f06c1-8574-4662-9139-e8a7107dac25)

### Login(After Logout)
![logout](https://github.com/user-attachments/assets/eb2b96ee-eedd-4bc9-9797-e51aa4f09e6f)
