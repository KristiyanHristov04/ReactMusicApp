import styles from './SongPlayer.module.css';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import CustomAudioPlayer from './CustomAudioPlayer';
import { Link } from 'react-router-dom';
import FavouriteSongsContext from '../../../context/FavouriteSongsContext';

export default function SongPlayer({
    songId,
    songName,
    songArtists,
    songThumbnailImage,
    songArtistImage,
    songUrl
}) {

    const [user] = useContext(AuthContext);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { favouriteSongs, toggleFavouriteSong } = useContext(FavouriteSongsContext);

    useEffect(() => {
        try {
            if (user.id) {
                const isLiked = favouriteSongs.some(song => song.id === songId);
                setIsLiked(isLiked);
                setIsLoading(false);
            }
        } catch (e) {
            console.error(e.message);
        }
    }, [user, favouriteSongs, songId]);

    const clickHandlerAddToFavourite = async () => {
        if (!user.id) {
            navigate('/login');
        }

        await toggleFavouriteSong(songId);
        setIsLiked(!isLiked);
    }

    return (
        <>
            {!isLoading &&
                <>
                    <div className={styles["card"]}>
                        <div className={styles["card-top"]}>
                            <img src={songThumbnailImage} alt='thumbnail' />
                            <span
                                onClick={clickHandlerAddToFavourite}
                                className={styles["favourite-icon"]}>
                                {!isLiked ? <FaRegHeart /> : <FaHeart style={{ color: '#f36d6d' }} />}
                            </span>
                            <div className={styles["card-avatar"]}>
                                <img src={songArtistImage} alt='artist' />
                            </div>
                        </div>
                        <div className={styles["card-bottom"]}>
                            <div className={styles["song-information"]}>
                                <p>{songName}</p>
                                <div className={styles["artist-names"]}>
                                    {songArtists.map((artist, index) => (
                                        <span key={artist.id}>
                                            <Link
                                                to={`/artist/${artist.id}`}
                                                className={styles["artist-link"]}
                                            >
                                                {artist.name}
                                            </Link>
                                            {index < songArtists.length - 1 && ", "}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <CustomAudioPlayer songId={songId} songUrl={songUrl} />
                        </div>
                    </div>
                </>
            }
        </>
    );
}