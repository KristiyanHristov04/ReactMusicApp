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
                .select('song_id')
                .eq('user_id', userId);

            if (favouriteSongsError) {
                throw new Error(favouriteSongsError.message);
            }

            setFavouriteSongs(favouriteSongs.map(song => song.song_id));

            console.log(favouriteSongs);
        } catch (e) {
            console.error(e.message);
        }
    }

    async function toggleFavouriteSong(songId) {
        try {
            if (favouriteSongs.includes(songId)) {
                const { error } = await supabase
                    .from('users_favourite_songs')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('song_id', songId);

                if (error) {
                    throw new Error(error.message);
                }

                setFavouriteSongs(favouriteSongs.filter(id => id !== songId));
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

                setFavouriteSongs([...favouriteSongs, songId]);
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
