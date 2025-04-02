import { supabase } from "../../supabase";
import styles from "./Artists.module.css";
import { useState, useEffect } from "react";
import Navigation from "../navigation/Navigation";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router-dom";
import { MdOutlineLibraryMusic } from "react-icons/md";
import usePagination from "../../hooks/usePagination";

export default function Artists() {
    const [searchParent, setSearchParent] = useState('');
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const artistsPerPage = 2;
    const { page, setPage, totalPages, setTotalPages, from, to } = usePagination(artistsPerPage);

    const handlePageChange = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
    };

    console.log(artists);
    useEffect(() => {
        setIsLoading(true);
        const getArtists = async () => {
            try {
                const { data: artistsData, error: errorArtists } = await supabase
                    .from('artists')
                    .select(`
                        id,
                        name,
                        artist_image_url,
                        songs_artists (
                            songs (
                                total_listenings
                            )
                        )
                    `)
                    .or(`name.ilike.%${searchParent}%`)
                    .range(from, to)
                    .order('id', { ascending: false });

                if (errorArtists) {
                    throw new Error(errorArtists.message);
                }

                const artistsWithTotalListenings = artistsData.map(artist => ({
                    ...artist,
                    total_listenings: artist.songs_artists.reduce((total, song) =>
                        total + (song.songs?.total_listenings || 0), 0)
                }));

                setArtists(artistsWithTotalListenings);
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        const getTotalPages = async () => {
            try {
                const { data: totalArtists, error: errorTotal } = await supabase
                    .from('artists')
                    .select('id', { count: 'exact' })
                    .or(`name.ilike.%${searchParent}%`);

                if (errorTotal) {
                    throw new Error(errorTotal.message);
                }

                const totalPagesCount = Math.ceil(totalArtists.length / artistsPerPage);
                setTotalPages(totalPagesCount);
            } catch (e) {
                console.error(e.message);
            }
        }

        getArtists();
        getTotalPages();
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