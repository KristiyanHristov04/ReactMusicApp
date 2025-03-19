import { Routes, Route } from "react-router-dom"
import Explore from "./explore/Explore"
import AddSong from "./add-song/AddSong"
import PreviewSong from "./preview-song/PreviewSong"
import SignUp from "./sign-up/SignUp"
import Login from "./login/Login"
import AuthContext from "./context/AuthContext"
import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Favourites from "./favourites/Favourites"
import DeleteSong from "./delete-song/DeleteSong"
import EditSong from "./edit-song/EditSong"
import ProtectedGuard from "./guards/ProtectedGuard"
import GuestGuard from "./guards/GuestGuard"
import NotFound from "./not-found/NotFound"

function App() {
    const [user, setUser] = useState({
        email: null,
        id: null
    });

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();

                console.log(data);
                console.log(error);
                if (error || !data.user) {
                    throw new Error('User is not logged in.');
                }

                console.log(data.user.id);
                console.log(data.user.email);
                setUser({
                    email: data.user.email,
                    id: data.user.id
                });
            } catch (e) {
                console.error(e.message);
            }
        }

        getUser();
    }, []);

    return (
        <AuthContext.Provider value={[user, setUser]}>
            <Routes>
                <Route path="/" element={<ProtectedGuard><Explore /></ProtectedGuard>} />
                <Route path="/add-song" element={<ProtectedGuard><AddSong /></ProtectedGuard>} />
                <Route path="/song/:id/preview" element={<ProtectedGuard><PreviewSong /></ProtectedGuard>} />
                <Route path="/favourite-songs" element={<ProtectedGuard><Favourites /></ProtectedGuard>} />
                <Route path="/signup" element={<GuestGuard><SignUp /></GuestGuard>} />
                <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
                <Route path="/song/:id/edit" element={<ProtectedGuard><EditSong /></ProtectedGuard>} />
                <Route path="/song/:id/delete" element={<ProtectedGuard><DeleteSong /></ProtectedGuard>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthContext.Provider>
    );
}

export default App
