import { useEffect, useState } from "react";
import Navigation from "../navigation/Navigation";
import styles from './AddSong.module.css';
import { supabase } from "../supabase";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddSong() {
    const [formData, setFormData] = useState({
        name: '',
        artist: '',
        lyrics: '',
        song: undefined,
        songImage: undefined,
        artistImage: undefined
    });

    const [user, setUser] = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const validateUser = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                console.log('User not logged in.')
                setUser({});
                navigate('/login');
            }
        };

        validateUser();
    }, []);

    function changeHandler(e) {
        const name = e.currentTarget.name;
        if (name !== 'song' && name !== 'songImage' && name !== 'artistImage') {
            const value = e.currentTarget.value;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            const file = e.currentTarget.files[0];
            setFormData(prev => ({
                ...prev,
                [name]: file
            }));
        }
    }

    async function submitHandler(e) {
        e.preventDefault();

        try {
            const songFileName = `${Date.now()}-${formData.song.name}`;
            const songImageName = `${Date.now()}-${formData.songImage.name}`;
            const artistImageName = `${Date.now()}-${formData.artistImage.name}`;

            console.log(songFileName);

            const { data: songData, error: songError } = await supabase.storage
                .from('song-files')
                .upload(`song-audios/${songFileName}`, formData.song);

            console.log(songData);

            if (songError) throw songError;

            const { data: songImageData, error: songImageError } = await supabase.storage
                .from('song-files')
                .upload(`song-images/${songImageName}`, formData.songImage);

            console.log(songImageData);

            if (songImageError) throw songImageError;

            const { data: artistImageData, error: artistImageError } = await supabase.storage
                .from('song-files')
                .upload(`artist-images/${artistImageName}`, formData.artistImage);

            console.log(artistImageData);

            if (artistImageError) throw artistImageError;

            console.log(songData.path);
            const songUrl = supabase.storage.from('song-files').getPublicUrl(songData.path).data.publicUrl;
            console.log(songUrl);
            const songImageUrl = supabase.storage.from('song-files').getPublicUrl(songImageData.path).data.publicUrl;
            const artistImageUrl = supabase.storage.from('song-files').getPublicUrl(artistImageData.path).data.publicUrl;

            // Insert the song details into the "songs" table
            const { data, error } = await supabase
                .from('songs')
                .insert([
                    {
                        name: formData.name,
                        artist: formData.artist,
                        lyrics: formData.lyrics,
                        song_url: songUrl,
                        song_image_url: songImageUrl,
                        artist_image_url: artistImageUrl,
                        user_id: user.id
                    }
                ]);

            if (error) throw error;

            console.log("Song added successfully!", data);
            // Optionally, reset the form or provide user feedback here.

        } catch (error) {
            console.error("Error uploading song:", error.message);
        }
    }

    return (
        <>
            <Navigation />
            {user.id && <>
                <main className={styles["main"]}>
                    <h1>Add Song</h1>
                    <form onSubmit={submitHandler} className={styles["form"]}>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input
                                onChange={changeHandler}
                                type="text"
                                placeholder="Song name"
                                name="name"
                                id="name"
                                value={formData.name}
                            />
                        </div>
                        <div>
                            <label htmlFor="artist">Artist:</label>
                            <input
                                onChange={changeHandler}
                                type="text"
                                placeholder="Artist name"
                                name="artist"
                                id="artist"
                                value={formData.artist}
                            />
                        </div>
                        <div>
                            <label htmlFor="lyrics">Lyrics:</label>
                            <textarea
                                onChange={changeHandler}
                                placeholder="Lyrics"
                                name="lyrics"
                                id="lyrics"
                                value={formData.lyrics}
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="song">Song file:</label>
                            <input
                                onChange={changeHandler}
                                type="file"
                                name="song"
                                id="song"
                            />
                        </div>
                        <div>
                            <label htmlFor="songImage">Song image:</label>
                            <input
                                onChange={changeHandler}
                                type="file"
                                name="songImage"
                                id="songImage"
                            />
                        </div>
                        <div>
                            <label htmlFor="artistImage">Artist image:</label>
                            <input
                                onChange={changeHandler}
                                type="file"
                                name="artistImage"
                                id="artistImage"
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </main></>}
        </>
    );
}
