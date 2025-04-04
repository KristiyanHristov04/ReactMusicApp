import Navigation from '../navigation/Navigation';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useContext, useEffect, useState, useRef } from "react";
import { MDBInput, MDBBtn, MDBTextArea } from "mdb-react-ui-kit";
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/spinner/Spinner';
import ScrollToTopButton from '../../components/scroll-to-top-button/ScrollToTopButton';
import { useResetScroll } from '../../hooks/useResetScroll';
import { getArtistInformation, getSongsByArtist, deleteSongsByArtist, deleteArtist, deleteArtistImage } from '../../services/deleteArtistService';
import styles from './DeleteArtist.module.css';

export default function DeleteArtist() {
    const params = useParams();
    const [artist, setArtist] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [user] = useContext(AuthContext);
    const navigate = useNavigate();

    const deleteFileNameRef = useRef('');

    useResetScroll();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const artistInformation = await getArtistInformation(params.id);

                if (artistInformation.length === 0) {
                    navigate('/', { state: { message: "Artist doesn't exist!", variant: "danger" } });
                    return;
                }

                if (artistInformation[0].user_id !== user.id) {
                    navigate('/', { state: { message: "You do not have permission to this artist!", variant: "warning" } });
                    return;
                }

                setArtist({
                    name: artistInformation[0].name,
                    biography: artistInformation[0].biography
                });


                deleteFileNameRef.current = artistInformation[0].file_name;
                setIsLoading(false);
            } catch (e) {
                console.error(e.message);
                navigate('/', { state: { message: "Something went wrong!", variant: "danger" } });
            }
        }

        fetchData();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const songsByArtist = await getSongsByArtist(params.id);

            await deleteSongsByArtist(songsByArtist);

            await deleteArtist(params.id);

            await deleteArtistImage(deleteFileNameRef.current);

            navigate('/', { state: { message: "Artist deleted successfully!", variant: "success" } });
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
                    <h1 className={styles["title"]}><span>Delete</span> artist</h1>
                    <form onSubmit={handleSubmit} className={styles["form"]}>
                        <div className={styles["input-group"]}>
                            <MDBInput
                                label="Name"
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={artist.name}
                                disabled
                            />

                        </div>

                        <div className={styles["input-group"]}>
                            <MDBTextArea
                                className={styles["textarea"]}
                                rows={6}
                                label="Biography"
                                id="biography"
                                name="artistBiography"
                                defaultValue={artist.biography}
                                disabled
                            />
                        </div>

                        <MDBBtn type="submit">Delete Artist</MDBBtn>
                    </form>
                </div>
                <ScrollToTopButton />
            </main>
        </>
    );
}