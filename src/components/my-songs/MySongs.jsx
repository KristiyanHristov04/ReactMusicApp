import Navigation from "../navigation/Navigation";
import Song from "../song/Song";
import styles from './MySongs.module.css'
import { useEffect, useState, useContext } from "react";
import { supabase } from "../../supabase";
import { MdOutlineLibraryMusic } from "react-icons/md";
import Spinner from "../spinner/Spinner";
import AuthContext from "../../context/AuthContext";
import usePagination from "../../hooks/usePagination";
import { getMySongs, getTotalPages } from "../../services/mySongsService";

export default function MySongs() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);

    const [searchParent, setSearchParent] = useState('');
    const songsPerPage = 2;
    const { page, setPage, totalPages, setTotalPages, from, to } = usePagination(songsPerPage);

    const handlePageChange = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
    };

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const songs = await getMySongs(searchParent, from, to, user.id);
                const totalPages = await getTotalPages(searchParent, user.id, songsPerPage);
                setSongs(songs);
                setTotalPages(totalPages);
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [page, searchParent]);

    if (isLoading) {
        return (
            <>
                <Navigation
                    showSearchBar={true}
                    searchPlaceHolder="Search for your songs"
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
                searchPlaceHolder="Search for your songs"
            />

            {
                location.state?.message && <Alert
                    variant={location.state?.variant}
                    message={location.state?.message}
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
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Previous Page
                        </button>
                        <span className={styles["page-counter"]}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className={styles["pagination-button"]}
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Next Page
                        </button>
                    </div>
                }
            </main>
        </>
    )
} 