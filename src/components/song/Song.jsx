import { useContext, useEffect, useState } from 'react';
import styles from './Song.module.css';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { supabase } from '../../supabase';

export default function Song({
    id,
    name,
    artists,
    thumbnailImage,
}) {
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.id) {
            const checkIfSongLiked = async () => {
                try {
                    const { data, error } = await supabase
                        .from('users_favourite_songs')
                        .select()
                        .eq('user_id', user.id)
                        .eq('song_id', id);

                    if (error) {
                        console.error(error.message);
                        return;
                    }

                    if (data[0]) {
                        setIsLiked(true);
                    }
                } catch (e) {
                    console.error(e.message);
                } finally {
                    setIsLoading(false);
                }
            }

            checkIfSongLiked();
        } else {
            setIsLoading(false);
        }

    }, [user.id, id]);

    const clickHandlerAddToFavourite = async (e) => {
        e.stopPropagation(); // Prevent triggering the card click

        if (!user.id) {
            navigate('/login');
            return;
        }

        try {
            if (isLiked) {
                const { error } = await supabase
                    .from('users_favourite_songs')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('song_id', id);

                if (error) {
                    throw new Error(error.message);
                }

                setIsLiked(false);
            } else {
                const { error } = await supabase
                    .from('users_favourite_songs')
                    .insert({
                        user_id: user.id,
                        song_id: id,
                    });

                if (error) {
                    throw new Error(error.message);
                }

                setIsLiked(true);
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    const clickHandlerPreviewSong = () => {
        navigate(`/song/${id}/preview`);
    };

    if (isLoading) {
        return null;
    }

    return (
        <article id={id} className={styles.card} onClick={clickHandlerPreviewSong}>
            <div className={styles["card-top"]}>
                <img
                    src={thumbnailImage}
                    alt={name}
                />
                <span
                    onClick={clickHandlerAddToFavourite}
                    className={styles["favourite-icon"]}
                    aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                >
                    {!isLiked ? <FaRegHeart /> : <FaHeart style={{ color: '#f36d6d' }} />}
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