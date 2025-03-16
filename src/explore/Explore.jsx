import Navigation from "../navigation/Navigation";
import Song from "../song/Song";
import styles from './Explore.module.css'
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Explore() {

    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const getSongs = async () => {
            const { data, error } = await supabase
            .from('songs')
            .select()
            .order('id', {ascending: false});

            if (error) {
                console.error(error.message);
                return;
            }

            console.log(data);
            setSongs(data);
        }
        
        getSongs();
    }, []);

    return (
        <>
            <Navigation showSearchBar={true} songs={songs} setSongs={setSongs} />
            <main className={styles["main"]}>
                {songs.map(song => <Song key={song.id} id={song.id} name={song.name} artist={song.artist} thumbnailImage={song.song_image_url} artistImage={song.artist_image_url} />)}
            </main>
        </>
    )
}