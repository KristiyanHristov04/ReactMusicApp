import Navigation from "../navigation/Navigation";
import styles from './Favourites.module.css';
import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabase";
import Song from "../song/Song";
import AuthContext from "../context/AuthContext";

export default function Favourites() {

    const [songs, setSongs] = useState([]);
    const [favouriteSongsIds, setFavouriteSongsIds] = useState(null);
    const [user] = useContext(AuthContext);

    useEffect(() => {
        const getFavouriteSongsIds = async() => {
            console.log(user.id);
            const { data, error } = await supabase
            .from('users_favourite_songs')
            .select('song_id')
            .eq('user_id', user.id);

            if (error) {
                console.error(error.message);
                return;
            }

            const songIds = [];
            data.forEach(song => songIds.push(song.song_id));

            return songIds;
        };

        if (user.id) {
            const getSongs = async () => {
                const songIds = await getFavouriteSongsIds();
                setFavouriteSongsIds(songIds);
                const { data, error } = await supabase
                    .from('songs')
                    .select()
                    .in('id', songIds)
                    .order('id', { ascending: false });
    
                if (error) {
                    console.error(error.message);
                    return;
                }
    
                console.log(data);
                setSongs(data);
            }

            getSongs();
        }
        
    }, [user]);

    return (
        <>
            <Navigation showSearchBar={true} setSongs={setSongs} favouriteSongsIds={favouriteSongsIds} />
            <main className={styles["main"]}>
                {songs.map(song => <Song key={song.id} id={song.id} name={song.name} artist={song.artist} thumbnailImage={song.song_image_url} artistImage={song.artist_image_url} />)}
            </main>
        </>

    );
}