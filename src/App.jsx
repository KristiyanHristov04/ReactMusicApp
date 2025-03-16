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

function App() {

    const [user, setUser] = useState({})
    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                console.log('User is not logged in.')
                return;
            }

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
                    <Route path="/add-song" element={<AddSong />} />
                    <Route path="/preview-song/:id" element={<PreviewSong />} />
                    <Route path="/favourite-songs" element={<Favourites />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/:id/edit" element={<EditSong />} />
                    <Route path="/:id/delete" element={<DeleteSong />} />
                </Routes>
            </AuthContext.Provider>
        </>
    )
}

export default App
