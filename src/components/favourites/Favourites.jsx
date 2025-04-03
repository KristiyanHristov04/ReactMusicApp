import Navigation from "../navigation/Navigation";
import styles from './Favourites.module.css';
import { useState, useEffect, useContext } from "react";
import { supabase } from "../../supabase";
import Song from "../song/Song";
import Spinner from "../spinner/Spinner";
import { MdOutlineLibraryMusic } from "react-icons/md";
import usePagination from "../../hooks/usePagination";
import FavouriteSongsContext from "../../context/FavouriteSongsContext";

export default function Favourites() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { favouriteSongs } = useContext(FavouriteSongsContext);

    const [searchParent, setSearchParent] = useState('');
    const songsPerPage = 2;
    const { page, setPage, totalPages, setTotalPages, from, to } = usePagination(songsPerPage);

    console.log(favouriteSongs);

    const handlePageChange = (newPage) => {
        setIsLoading(true);
        setPage(newPage);
    };

    useEffect(() => {
        setIsLoading(true);
        const getSongs = async () => {
            try {
                if (favouriteSongs.length === 0) {
                    setSongs([]);
                    setIsLoading(false);
                    return;
                }

                const songsThatMatchSearch = favouriteSongs.filter(song => song.name.toLowerCase().includes(searchParent.toLowerCase()));
                const songIds = songsThatMatchSearch.map(song => song.id);
                const paginatedIds = songIds.slice(from, to + 1);
                console.log(songIds);
                console.log(paginatedIds);

                if (paginatedIds.length === 0) {
                    setSongs([]);
                    setIsLoading(false);
                    return;
                }

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
                    .in('id', paginatedIds);

                if (errorSongsInformation) {
                    throw new Error(errorSongsInformation.message);
                }

                const songsData = songsInformation.map(song => ({
                    id: song.id,
                    name: song.name,
                    song_image_url: song.song_image_url,
                    song_url: song.song_url,
                    artists: song.songs_artists.map(artist => artist.artists)
                }));

                songsData.sort((a, b) => {
                    return paginatedIds.indexOf(a.id) - paginatedIds.indexOf(b.id);
                });

                setSongs(songsData);
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        const getTotalPages = async () => {
            try {
                if (favouriteSongs.length === 0) {
                    setTotalPages(0);
                    return;
                }

                const songIds = favouriteSongs.map(song => song.id);

                const { data, error } = await supabase
                    .from('songs')
                    .select('id')
                    .in('id', songIds)
                    .or(`name.ilike.%${searchParent}%`);

                if (error) {
                    throw new Error(error.message);
                }

                const totalPagesCount = Math.ceil(data.length / songsPerPage);
                setTotalPages(totalPagesCount);

            } catch (e) {
                console.error(e.message);
            }
        }

        getSongs();
        getTotalPages();
    }, [page, searchParent, favouriteSongs]);

    if (isLoading) {
        return (
            <>
                <Navigation
                    showSearchBar={true}
                    searchPlaceHolder="Search for your favourite songs"
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
                searchPlaceHolder="Search for your favourite songs"
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
                    )) : page === 1 ?
                        (<div className={styles["no-songs-container"]}>
                            <MdOutlineLibraryMusic />
                            <h2>No songs found</h2>
                            <p>
                                Start by adding your favorite songs or try a different search term.
                            </p>
                        </div>
                        ) : setPage(1)}
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
    );
}