import Navigation from "../navigation/Navigation";
import Song from "../../components/song/Song";
import styles from './Explore.module.css'
import { useEffect, useState } from "react";
import { MdOutlineLibraryMusic } from "react-icons/md";
import Spinner from "../../components/spinner/Spinner";
import Alert from "../alert/Alert";
import { useLocation } from "react-router-dom";
import usePagination from "../../hooks/usePagination";
import { getSongs, getTotalPages } from "../../services/exploreService";

export default function Explore() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [searchParent, setSearchParent] = useState('');

    const songsPerPage = 2;
    const { page, setPage, totalPages, setTotalPages, from, to } = usePagination(songsPerPage);

    const handlePageChange = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
        setIsInitialRender(false);
    };

    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            try {
                const songs = await getSongs(searchParent, from, to);
                console.log(songs);
                const totalPages = await getTotalPages(searchParent, songsPerPage);
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