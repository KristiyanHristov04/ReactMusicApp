import { Routes, Route } from "react-router-dom"
import Explore from "./components/explore/Explore"
import AddSong from "./components/add-song/AddSong"
import PreviewSong from "./components/preview-song/PreviewSong"
import SignUp from "./components/sign-up/SignUp"
import Login from "./components/login/Login"
import { FavouriteSongsProvider } from "./context/FavouriteSongsContext"
import { AuthProvider } from "./context/AuthContext"
import Favourites from "./components/favourites/Favourites"
import DeleteSong from "./components/delete-song/DeleteSong"
import EditSong from "./components/edit-song/EditSong"
import ProtectedGuard from "./guards/ProtectedGuard"
import GuestGuard from "./guards/GuestGuard"
import NotFound from "./components/not-found/NotFound"
import MySongs from "./components/my-songs/MySongs"
import AddArtist from "./components/add-artist/AddArtist"
import Artist from "./components/artist/Artist"
import DeleteArtist from "./components/delete-artist/DeleteArtist"
import EditArtist from "./components/edit-artist/EditArtist"
import Artists from "./components/artists/Artists"
import MyArtists from "./components/my-artists/MyArtists"

function App() {
    return (
        <AuthProvider>
            <FavouriteSongsProvider>
                <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/add-song" element={<ProtectedGuard><AddSong /></ProtectedGuard>} />
                    <Route path="/add-artist" element={<ProtectedGuard><AddArtist /></ProtectedGuard>} />
                    <Route path="/song/:id/preview" element={<ProtectedGuard><PreviewSong /></ProtectedGuard>} />
                    <Route path="/favourite-songs" element={<ProtectedGuard><Favourites /></ProtectedGuard>} />
                    <Route path="/my-songs" element={<ProtectedGuard><MySongs /></ProtectedGuard>} />
                    <Route path="/signup" element={<GuestGuard><SignUp /></GuestGuard>} />
                    <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
                    <Route path="/song/:id/edit" element={<ProtectedGuard><EditSong /></ProtectedGuard>} />
                    <Route path="/song/:id/delete" element={<ProtectedGuard><DeleteSong /></ProtectedGuard>} />
                    <Route path="/artists" element={<Artists />} />
                    <Route path="/my-artists" element={<ProtectedGuard><MyArtists /></ProtectedGuard>} />
                    <Route path="/artist/:id" element={<Artist />} />
                    <Route path="/artist/:id/edit" element={<ProtectedGuard><EditArtist /></ProtectedGuard>} />
                    <Route path="/artist/:id/delete" element={<ProtectedGuard><DeleteArtist /></ProtectedGuard>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </FavouriteSongsProvider>
        </AuthProvider>
    );
}

export default App
