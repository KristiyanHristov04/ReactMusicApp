import styles from "./Artist.module.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import Navigation from "../navigation/Navigation";

export default function Artist() {

    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [artist, setArtist] = useState(null);

    useEffect(() => {
        const getArtist = async () => {
            try {
                const { data: artist, error: errorArtist } = await supabase
                    .from('artists')
                    .select('id, name, artist_image_url')
                    .eq('id', params.id);

                if (errorArtist) {
                    throw new Error(errorArtist.message);
                }

                console.log(artist);
                setArtist(artist);
            } catch (e) {
                console.error(e.message);
            } finally {
                setIsLoading(false);
            }
        }

        getArtist();
    }, [])

    return (
        <>
            <Navigation />
            <main className={styles.main}>
                <p>Artist</p>
            </main>
        </>
    );
}
