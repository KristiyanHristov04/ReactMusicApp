import Navigation from '../navigation/Navigation';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useContext, useEffect, useState, useRef } from "react";
import { MDBInput, MDBBtn, MDBTextArea } from "mdb-react-ui-kit";
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/spinner/Spinner';
import ScrollToTopButton from '../../components/scroll-to-top-button/ScrollToTopButton';
import { useResetScroll } from '../../hooks/useResetScroll';
import { getSong, deleteSong, deleteSongFiles } from '../../services/deleteSongService';


import styles from './DeleteSong.module.css';

export default function DeleteSong() {
    const params = useParams();
    const [song, setSong] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useContext(AuthContext);
    const navigate = useNavigate();

    
    const deleteFileNameRef = useRef('');
    
    useResetScroll();

    useEffect(() => {
        async function getSongInformation() {
            try {
                const songInformation = await getSong(params.id);

                if (songInformation.length === 0) {
                    navigate('/', { state: { message: "Song doesn't exist!", variant: "danger" } });
                    return;
                }

                if (songInformation[0].user_id !== user.id) {
                    navigate('/', { state: { message: "You do not have permission to this song!", variant: "warning" } });
                    return;
                }

                setSong({
                    name: songInformation[0].name,
                    lyrics: songInformation[0].lyrics
                });

                deleteFileNameRef.current = songInformation[0].file_name;
                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
                navigate('/', { state: { message: "Something went wrong!", variant: "danger" } });
            }
        }

        getSongInformation();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await deleteSong(params.id);

            await deleteSongFiles(deleteFileNameRef.current);

            navigate('/', { state: { message: "Song deleted successfully!", variant: "success" } });
        } catch (e) {
            console.error(e.message);
        }

    }

    if (isLoading) {
        return (
            <>
                <Navigation showSearchBar={false} />
                <main className={styles["main"]}>
                    <Spinner />
                </main>
            </>
        );
    }

    return (
        <>
            <Navigation showSearchBar={false} />
            <main className={styles["main"]}>
                <div className={styles["form-container"]}>
                    <h1 className={styles["title"]}><span>Delete</span> song</h1>
                    <form onSubmit={handleSubmit} className={styles["form"]}>
                        <div className={styles["input-group"]}>
                            <MDBInput
                                label="Name"
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={song.name}
                                disabled
                            />

                        </div>

                        <div className={styles["input-group"]}>
                            <MDBTextArea
                                className={styles["textarea"]}
                                rows={6}
                                label="Lyrics"
                                id="lyrics"
                                name="lyrics"
                                defaultValue={song.lyrics}
                                disabled
                            />
                        </div>

                        <MDBBtn type="submit">Delete Song</MDBBtn>
                    </form>
                </div>
                <ScrollToTopButton />
            </main>
        </>
    );
}