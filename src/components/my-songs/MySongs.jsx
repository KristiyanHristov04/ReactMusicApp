import Navigation from "../navigation/Navigation";
import Song from "../song/Song";
import styles from './MySongs.module.css'
import { useEffect, useState, useContext } from "react";
import { supabase } from "../../supabase";
import { MdOutlineLibraryMusic } from "react-icons/md";
import Spinner from "../spinner/Spinner";
import AuthContext from "../../context/AuthContext";

export default function MySongs() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const songsPerPage = 2;

    const from = (page - 1) * songsPerPage;
    const to = from + songsPerPage - 1;

    //
    const [searchParent, setSearchParent] = useState('');
    //

    useEffect(() => {
        const getMySongs = async () => {
            try {
                const { data: songsInformation, error: errorSongsInformation } = await supabase
                    .from('songs')
                    .select(`
                    id,
                    name,
                    song_image_url,
                    song_url,
                    songs_artists (
                        artists (
                            id,
                            name,
                            artist_image_url
                        )
                    )
                `)
                    .eq('user_id', user.id)
                    .or(`name.ilike.%${searchParent}%`)
                    .range(from, to)
                    .order('id', { ascending: false });

                console.log(songsInformation);

                if (errorSongsInformation) {
                    throw new Error(errorSongsInformation.message);
                }

                const songs = songsInformation.map(song => ({
                    id: song.id,
                    name: song.name,
                    song_image_url: song.song_image_url,
                    song_url: song.song_url,
                    artists: song.songs_artists.map(artist => artist.artists)
                }));

                setSongs(songs);
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        const getTotalPages = async () => {
            try {
                const { data: totalPages, error: errorTotalPages } = await supabase
                    .from('songs')
                    .select('id', { count: 'exact' })
                    .eq('user_id', user.id)
                    .or(`name.ilike.%${searchParent}%`);

                console.log(totalPages);
                if (errorTotalPages) {
                    throw new Error(errorTotalPages.message);
                }

                const totalPagesCount = Math.ceil(totalPages.length / songsPerPage);
                console.log(totalPagesCount);
                setTotalPages(totalPagesCount);
            } catch (e) {
                console.error(e.message);
            }
        }

        getMySongs();
        getTotalPages();
    }, [page, searchParent]);

    if (isLoading) {
        return (
            <>
                <Navigation
                    showSearchBar={true}
                    setSongs={setSongs}
                />
                <main className={styles.main}>
                    <div className={styles["songs-container"]}>
                        <Spinner />
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            {
                location.state?.message && <Alert
                    variant={location.state?.variant}
                    message={location.state?.message}
                />
            }

            <Navigation
                showSearchBar={true}
                setSongs={setSongs}
                setSearchParent={setSearchParent}
                setPage={setPage}
            />
            <main className={styles.main}>
                <div className={styles["songs-container"]}>
                    {songs.length > 0 ? songs.map(song => (
                        <Song
                            key={song.id}
                            id={song.id}
                            name={song.name}
                            artists={song.artists}
                            thumbnailImage={song.song_image_url}
                        />
                    )) :
                        (<div className={styles["no-songs-container"]}>
                            <MdOutlineLibraryMusic />
                            <h2>No songs found</h2>
                            <p>
                                Create a song or try a different search term.
                            </p>
                        </div>
                        )}
                </div>
                {songs.length > 0 &&
                    <div className={styles.pagination}>
                        <button
                            className={styles["pagination-button"]}
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous Page
                        </button>
                        <span className={styles["page-counter"]}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className={styles["pagination-button"]}
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next Page
                        </button>
                    </div>
                }
            </main>
        </>
    )
} 