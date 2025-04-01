import Navigation from "../navigation/Navigation";
import Song from "../../components/song/Song";
import styles from './Explore.module.css'
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { MdOutlineLibraryMusic } from "react-icons/md";
import Spinner from "../../components/spinner/Spinner";
import Alert from "../alert/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Explore() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const [searchParent, setSearchParent] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const songsPerPage = 2;

    const from = (page - 1) * songsPerPage;
    const to = from + songsPerPage - 1;

    const [isInitialRender, setIsInitialRender] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const getSongs = async () => {
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
                    .or(`name.ilike.%${searchParent}%`)
                    .range(from, to)
                    .order('id', { ascending: false });

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

                console.log(songs);

                setSongs(songs);

            } catch (e) {
                console.error(e.message);
            }
            finally {
                setIsLoading(false);
            }

        }

        const getTotalPages = async () => {
            try {
                const { data: totalPages, error: errorTotalPages } = await supabase
                    .from('songs')
                    .select('id', { count: 'exact' })
                    .or(`name.ilike.%${searchParent}%`);

                if (errorTotalPages) {
                    throw new Error(errorTotalPages.message);
                }

                const totalPagesCount = Math.ceil(totalPages.length / songsPerPage);
                setTotalPages(totalPagesCount);
            } catch (e) {
                console.error(e.message);
            }
        }

        getSongs();
        getTotalPages();
    }, [page, searchParent]);

    function nextPage() {
        setPage(page + 1);
        setIsInitialRender(false);
    }

    function previousPage() {
        setPage(page - 1);
        setIsInitialRender(false);
    }

    if (isLoading) {
        return (
            <>
                <Navigation
                    showSearchBar={true}
                    searchPlaceHolder="Search for songs"
                    setSearchParent={setSearchParent}
                    setPage={setPage}
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
            <Navigation
                showSearchBar={true}
                setSearchParent={setSearchParent}
                setPage={setPage}
                searchPlaceHolder="Search for songs"
            />

            {
                location.state?.message && isInitialRender && <Alert
                    variant={location.state.variant}
                    message={location.state.message}
                    setIsInitialRender={setIsInitialRender}
                />
            }

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
                            onClick={previousPage}
                        >
                            Previous Page
                        </button>
                        <span className={styles["page-counter"]}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className={styles["pagination-button"]}
                            disabled={page === totalPages}
                            onClick={nextPage}
                        >
                            Next Page
                        </button>
                    </div>
                }
            </main>
        </>
    )
}