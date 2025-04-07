import { supabase } from "../../supabase";
import styles from "./Artists.module.css";
import { useState, useEffect } from "react";
import Navigation from "../navigation/Navigation";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router-dom";
import { MdOutlineLibraryMusic } from "react-icons/md";
import usePagination from "../../hooks/usePagination";
import { getArtists, getTotalPages } from "../../services/artistsService";

export default function Artists() {
    const [searchParent, setSearchParent] = useState('');
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const artistsPerPage = 5;
    const { page, setPage, totalPages, setTotalPages, from, to } = usePagination(artistsPerPage);

    const handlePageChange = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
    };

    // console.log(artists);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const artistsWithTotalListenings = await getArtists(searchParent, from, to);
                setArtists(artistsWithTotalListenings);
                const totalPagesCount = await getTotalPages(searchParent, artistsPerPage);
                setTotalPages(totalPagesCount);
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
                    setSearchParent={setSearchParent}
                    setPage={setPage}
                    searchPlaceHolder="Search for artists"
                />
                <main className={styles.main}>
                    <div className={styles["spinner-container"]}>
                        <Spinner />
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navigation
                showSearchBar={true}
                setSearchParent={setSearchParent}
                setPage={setPage}
                searchPlaceHolder="Search for artists"
            />
            <main className={styles.main}>
                {artists.length > 0 ? (
                    <>
                        <div className={styles["table-container"]}>
                            <table className={styles["artists-table"]}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Total Listenings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artists.map((artist, index) => (
                                        <tr key={`${artist.id}`}>
                                            <td>{from + index + 1}</td>
                                            <td>
                                                <img
                                                    src={artist.artist_image_url}
                                                    alt={artist.name}
                                                    className={styles["artist-image"]}
                                                />
                                            </td>
                                            <td>
                                                <Link
                                                    className={styles["artist-link"]}
                                                    to={`/artist/${artist.id}`}
                                                >
                                                    {artist.name}
                                                </Link>
                                            </td>
                                            <td>{artist.total_listenings}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.pagination}>
                            <button
                                className={styles["pagination-button"]}
                                disabled={page === 1 || isLoading}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Previous Page
                            </button>
                            <span className={styles["page-counter"]}>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className={styles["pagination-button"]}
                                disabled={page === totalPages || isLoading}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                Next Page
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={styles["no-artists-container"]}>
                        <MdOutlineLibraryMusic />
                        <h2>No artists found</h2>
                        <p>Create an artist or try a different search term.</p>
                    </div>
                )}
            </main>
        </>
    );
}