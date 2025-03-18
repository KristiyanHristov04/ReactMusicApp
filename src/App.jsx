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

function App() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                console.log('User is not logged in.')
                return;
            }

            console.log(data.user.id);
            console.log(data.user.email);
            setUser({
                email: data.user.email,
                id: data.user.id
            });
        }

        getUser();
    }, []);

    return (
        <>
            <AuthContext.Provider value={[ user, setUser ]}>
                <Routes>
                    <Route path="/" element={<Explore />} />
                    <Route path="/add-song" element={<ProtectedGuard><AddSong /></ProtectedGuard>} />
                    <Route path="/preview-song/:id" element={<ProtectedGuard><PreviewSong /></ProtectedGuard>} />
                    <Route path="/favourite-songs" element={<ProtectedGuard><Favourites /></ProtectedGuard>} />
                    <Route path="/signup" element={<GuestGuard><SignUp /></GuestGuard>} />
                    <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
                    <Route path="/:id/edit" element={<ProtectedGuard><EditSong /></ProtectedGuard>} />
                    <Route path="/:id/delete" element={<ProtectedGuard><DeleteSong /></ProtectedGuard>} />
                </Routes>
            </AuthContext.Provider>
        </>
    )
}

export default App
