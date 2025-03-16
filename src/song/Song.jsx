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
            }

            checkIfSongLiked();
        } else {
            setIsLoading(false);
        }

    }, []);

    const clickHandlerAddToFavourite = async () => {
        if (!user.id) {
            navigate('/login');
        }

        if (isLiked) {
            const response = await supabase
                .from('users_favourite_songs')
                .delete()
                .eq('user_id', user.id)
                .eq('song_id', props.id);

            console.log(response);
            setIsLiked(false);
        } else {
            const { data, error } = await supabase
                .from('users_favourite_songs')
                .insert({
                    user_id: user.id,
                    song_id: props.id,
                });

            if (error) {
                console.error(error.message);
                return;
            }

            setIsLiked(true);
        }
    }

    const clickHandlerPreviewSong = (e) => {
        const id = props.id;
        console.log(id);
        navigate(`/preview-song/${id}`);
    };

    return (
        <>
            {!isLoading &&
                <>
                    <article id={props.id} className={styles["card"]}>
                        <div className={styles["card-top"]}>
                            <img src={props.thumbnailImage} onClick={clickHandlerPreviewSong} alt='thumbnail' />
                            <span
                                onClick={clickHandlerAddToFavourite}
                                className={styles["favourite-icon"]}>
                                {!isLiked ? <FaRegHeart /> : <FaHeart style={{ color: '#f36d6d' }} />}
                            </span>
                            <div className={styles["card-avatar"]}>
                                <img src={props.artistImage} alt='artist' onClick={clickHandlerPreviewSong} />
                            </div>
                        </div>
                        <div className={styles["card-bottom"]} onClick={clickHandlerPreviewSong}>
                            <p>{props.name}</p>
                            <span>{props.artist}</span>
                        </div>
                    </article>
                </>
            }
        </>
    );
}