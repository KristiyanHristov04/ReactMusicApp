import styles from './SongPlayer.module.css';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { supabase } from '../../supabase';
import CustomAudioPlayer from './CustomAudioPlayer';

export default function SongPlayer(props) {

    const [user] = useContext(AuthContext);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            if (user.id) {
                const checkIfSongLiked = async () => {
                    const { data, error } = await supabase
                        .from('users_favourite_songs')
                        .select()
                        .eq('user_id', user.id)
                        .eq('song_id', props.id);
    
                    if (error) {
                        throw new Error(error.message);
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
        } catch (e) {
            console.error(e.message);
        }
        

    }, []);

    const clickHandlerAddToFavourite = async () => {
        if (!user.id) {
            navigate('/login');
        }

        try {
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
                    throw new Error(error.message);
                }
    
                setIsLiked(true);
            }
        } catch (e) {
            console.error(e.message);
        }
        
    }

    return (
        <>
            {!isLoading &&
                <>
                    <div className={styles["card"]}>
                        <div className={styles["card-top"]}>
                            <img src={props.thumbnailImage} alt='thumbnail' />
                            <span
                                onClick={clickHandlerAddToFavourite}
                                className={styles["favourite-icon"]}>
                                {!isLiked ? <FaRegHeart /> : <FaHeart style={{ color: '#f36d6d' }} />}
                            </span>
                            <div className={styles["card-avatar"]}>
                                <img src={props.artistImage} alt='artist' />
                            </div>
                        </div>
                        <div className={styles["card-bottom"]}>
                            <div className={styles["song-information"]}>
                                <p>{props.name}</p>
                                <span>{props.artist}</span>
                            </div>
                            <CustomAudioPlayer songUrl={props.songUrl} />
                        </div>
                    </div>
                </>
            }
        </>
    );
}