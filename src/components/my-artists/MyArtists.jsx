import { supabase } from "../../supabase";
import styles from "./MyArtists.module.css";
import { useState, useEffect, useContext } from "react";
import Navigation from "../navigation/Navigation";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router-dom";
import { MdOutlineLibraryMusic } from "react-icons/md";
import AuthContext from "../../context/AuthContext";

export default function MyArtists() {
    const [searchParent, setSearchParent] = useState('');
    const [user] = useContext(AuthContext);
    const [artists, setArtists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const artistsPerPage = 2;

    const from = (page - 1) * artistsPerPage;
    const to = from + artistsPerPage - 1;

    useEffect(() => {
        const getArtists = async () => {
            try {
                setIsLoading(true);
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
                    .eq('user_id', user.id)
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
                    .eq('user_id', user.id)
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
                    searchPlaceHolder="Search for your artists"
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
                searchPlaceHolder="Search for your artists"
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
                                        <tr key={artist.id}>
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