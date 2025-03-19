import { useContext, useEffect, useState } from 'react';
import styles from './Song.module.css';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { supabase } from '../supabase';

export default function Song(props) {
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
                        .eq('song_id', props.id);

                    if (error) {
                        console.error(error.message);
                        return;
                    }

                    if (data[0]) {
                        setIsLiked(true);
                    }

                    setIsLoading(false);
                } catch (e) {
                    console.error(e.message);
                }
            }

            checkIfSongLiked();
        } else {
            setIsLoading(false);
        }

    }, [user.id, props.id]);

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
                    .eq('song_id', props.id);

                if (error) {
                    throw new Error(error.message);
                }

                setIsLiked(false);
            } else {
                const { error } = await supabase
                    .from('users_favourite_songs')
                    .insert({
                        user_id: user.id,
                        song_id: props.id,
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
        const id = props.id;
        navigate(`/song/${id}/preview`);
    };

    if (isLoading) {
        return null;
    }

    return (
        <article id={props.id} className={styles.card} onClick={clickHandlerPreviewSong}>
            <div className={styles["card-top"]}>
                <img
                    src={props.thumbnailImage}
                    alt={`${props.name} by ${props.artist}`}
                    loading="lazy"
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
                        src={props.artistImage}
                        alt={props.artist}
                        loading="lazy"
                    />
                </div>
            </div>
            <div className={styles["card-bottom"]}>
                <p>{props.name}</p>
                <span>{props.artist}</span>
            </div>
        </article>
    );
}