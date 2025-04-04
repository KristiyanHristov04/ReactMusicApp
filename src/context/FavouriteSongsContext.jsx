import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { createContext } from "react";
import AuthContext from "./AuthContext";
import { useContext } from "react";

const FavouriteSongsContext = createContext();

export const FavouriteSongsProvider = ({ children }) => {
    const [favouriteSongs, setFavouriteSongs] = useState([]);
    const [user] = useContext(AuthContext);

    useEffect(() => {
        if (user?.id) {
            getFavouriteSongs(user.id);
        }
    }, [user?.id]);

    async function getFavouriteSongs(userId) {
        try {
            const { data: favouriteSongs, error: favouriteSongsError } = await supabase
                .from('users_favourite_songs')
                .select('song_id, created_at, songs (name)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (favouriteSongsError) {
                throw new Error(favouriteSongsError.message);
            }
            
            setFavouriteSongs(favouriteSongs.map(song => ({id: song.song_id, created_at: song.created_at, name: song.songs.name})));

            console.log(favouriteSongs);
        } catch (e) {
            console.error(e.message);
        }
    }

    async function toggleFavouriteSong(songId) {
        try {
            if (favouriteSongs.some(song => song.id === songId)) {
                const { error } = await supabase
                    .from('users_favourite_songs')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('song_id', songId);

                if (error) {
                    throw new Error(error.message);
                }

                setFavouriteSongs(favouriteSongs.filter(song => song.id !== songId));
            } else {
                const { error } = await supabase
                    .from('users_favourite_songs')
                    .insert({
                        user_id: user.id,
                        song_id: songId
                    });

                if (error) {
                    throw new Error(error.message);
                }

                getFavouriteSongs(user.id);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <FavouriteSongsContext.Provider value={{
            favouriteSongs,
            setFavouriteSongs,
            getFavouriteSongs,
            toggleFavouriteSong
        }}>
            {children}
        </FavouriteSongsContext.Provider>
    );
};

export default FavouriteSongsContext;
