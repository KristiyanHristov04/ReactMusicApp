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
                const { data: songsInformation, error: errorSongsInformation } = await supabase
                    .from('songs')
                    .select()
                    .in('id', songIds)
                    .order('id', { ascending: false });

                if (errorSongsInformation) {
                    throw new Error(error.message);
                }

                const songs = songsInformation.map(song => {
                    return {
                        id: song.id,
                        name: song.name,
                        song_image_url: song.song_image_url,
                        song_url: song.song_url,
                        artists: [],
                        artist_image_url: ''
                    }
                });

                console.log(songs);
                // setSongs(data);

                for (const song of songs) {
                    const { data: artistsInformation, error: errorArtistsInformation } = await supabase
                        .from('songs_artists')
                        .select()
                        .eq('song_id', song.id);

                    if (errorArtistsInformation) {
                        throw new Error(errorArtistsInformation.message);
                    }

                    const { data: artistsData, error: errorArtistsData } = await supabase
                        .from('artists')
                        .select()
                        .in('id', artistsInformation.map(artist => artist.artist_id));

                    if (errorArtistsData) {
                        throw new Error(errorArtistsData.message);
                    }

                    song.artist_image_url = artistsData[0].artist_image_url;

                    song.artists = artistsData.map(artist => ({
                        id: artist.id,
                        name: artist.name
                    }));
                }

                console.log(songs);
                setSongs(songs);
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
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
                        artists={song.artists}
                        thumbnailImage={song.song_image_url}
                        artistImage={song.artist_image_url}
                    />
                )) :
                    (<div className={styles["no-songs-container"]}>
                        <MdOutlineLibraryMusic />
                        <h2>No songs found</h2>
                        <p>
                            Start by adding your favorite songs or try a different search term.
                        </p>
                    </div>
                    )}
            </main>
        </>

    );
}