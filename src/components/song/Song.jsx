import { useContext } from 'react';
import styles from './Song.module.css';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import FavouriteSongsContext from '../../context/FavouriteSongsContext';

export default function Song({
    id,
    name,
    artists,
    thumbnailImage,
}) {
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();
    const { favouriteSongs, toggleFavouriteSong } = useContext(FavouriteSongsContext);

    const isSongLiked = favouriteSongs.includes(id);

    const clickHandlerToggleFavouriteSong = async (e) => {
        e.stopPropagation();
 
        if (!user.id) {
            navigate('/login');
            return;
        }

        await toggleFavouriteSong(id);
    }

    const clickHandlerPreviewSong = () => {
        navigate(`/song/${id}/preview`);
    };

    return (
        <article id={id} className={styles.card} onClick={clickHandlerPreviewSong}>
            <div className={styles["card-top"]}>
                <img
                    src={thumbnailImage}
                    alt={name}
                />
                <span
                    data-testid="fav-button"
                    onClick={clickHandlerToggleFavouriteSong}
                    className={styles["favourite-icon"]}
                    aria-label={isSongLiked ? "Remove from favorites" : "Add to favorites"}
                >
                    {!isSongLiked ? <FaRegHeart /> : <FaHeart style={{ color: '#f36d6d' }} />}
                </span>
                <div className={styles["card-avatar"]}>
                    <img
                        src={artists[0].artist_image_url}
                        alt={artists[0].name}
                    />
                </div>
            </div>
            <div className={styles["card-bottom"]}>
                <p>{name}</p>
                <div className={styles["artist-names"]}>
                    {artists.map((artist, index) => (
                        <span key={artist.id}>
                            <Link 
                                to={`/artist/${artist.id}`} 
                                className={styles["artist-link"]}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {artist.name}
                            </Link>
                            {index < artists.length - 1 && ", "}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}