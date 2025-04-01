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

    const [searchParent, setSearchParent] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const songsPerPage = 2;

    const from = (page - 1) * songsPerPage;
    const to = from + songsPerPage - 1;

    useEffect(() => {
        setIsLoading(true);
        const getFavouriteSongsIds = async () => {
            console.log(user.id);
            try {
                const { data: favouriteSongsIds, error: errorFavouriteSongsIds } = await supabase
                    .from('users_favourite_songs')
                    .select('song_id')
                    .eq('user_id', user.id);

                if (errorFavouriteSongsIds) {
                    throw new Error(errorFavouriteSongsIds.message);
                }

                const songIds = [];
                favouriteSongsIds.forEach(song => songIds.push(song.song_id));

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
                    .in('id', songIds)
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
            const songIds = await getFavouriteSongsIds();
            setFavouriteSongsIds(songIds);
            try {
                const { data: totalPages, error: errorTotalPages } = await supabase
                    .from('songs')
                    .select('id', { count: 'exact' })
                    .in('id', songIds)
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

        getSongs();
        getTotalPages();
    }, [page, searchParent]);

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
                    )) :
                        (<div className={styles["no-songs-container"]}>
                            <MdOutlineLibraryMusic />
                            <h2>No songs found</h2>
                            <p>
                                Start by adding your favorite songs or try a different search term.
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
    );
}