import Navigation from "../navigation/Navigation";
import styles from './EditSong.module.css'

export default function EditSong() {
    return (
        <>
            <Navigation />
            <main className={styles["main"]}>
                <p>Edit Song</p>
            </main>
        </>
    );
}