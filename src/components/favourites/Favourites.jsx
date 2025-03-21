import Navigation from "../navigation/Navigation";
import styles from './Favourites.module.css';
import { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabase";
import Song from "../song/Song";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";
import { MdOutlineLibraryMusic } from "react-icons/md";

export default function Favourites() {
    const [songs, setSongs] = useState([]);
    const [favouriteSongsIds, setFavouriteSongsIds] = useState(null);
    const [user] = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getFavouriteSongsIds = async () => {
            console.log(user.id);
            try {
                const { data, error } = await supabase
                    .from('users_favourite_songs')
                    .select('song_id')
                    .eq('user_id', user.id);

                if (error) {
                    throw new Error(error.message);
                }

                const songIds = [];
                data.forEach(song => songIds.push(song.song_id));

                return songIds;
            } catch (e) {
                console.error(e.message);
            }
        };

        const getSongs = async () => {
            try {
                const songIds = await getFavouriteSongsIds();
                setFavouriteSongsIds(songIds);
                const { data, error } = await supabase
                    .from('songs')
                    .select()
                    .in('id', songIds)
                    .order('id', { ascending: false });

                if (error) {
                    throw new Error(error.message);
                }

                console.log(data);
                setSongs(data);
                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
            }
        }

        getSongs();

    }, []);

    if (isLoading) {
        return (
            <>
                <Navigation showSearchBar={true} setSongs={setSongs} />
                <main className={styles.main}>
                    <Spinner />
                </main>
            </>
        )
    }

    return (
        <>
            <Navigation
                showSearchBar={true}
                setSongs={setSongs}
                favouriteSongsIds={favouriteSongsIds}
            />
            <main className={styles.main}>
                {songs.length > 0 ? songs.map(song => (
                    <Song
                        key={song.id}
                        id={song.id}
                        name={song.name}
                        artist={song.artist}
                        thumbnailImage={song.song_image_url}
                        artistImage={song.artist_image_url}
                    />
                )) :
                    (<div className={styles["no-songs-container"]}>
                        <MdOutlineLibraryMusic />
                        <h2>No songs found</h2>
                        <p>
                            {songs.length === 0
                                ? "Start by adding your favorite songs or try a different search term."
                                : "No songs match your search. Try a different search term."}
                        </p>
                    </div>
                    )}
            </main>
        </>

    );
}