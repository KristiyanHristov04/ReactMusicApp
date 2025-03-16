import Navigation from '../navigation/Navigation';
import styles from './DeleteSong.module.css'

export default function DeleteSong() {
    return (
        <>
            <Navigation />
            <main className={styles["main"]}>
                <p>Delete Song</p>
            </main>
        </>
    );
}