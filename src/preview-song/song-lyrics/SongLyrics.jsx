import styles from './SongLyrics.module.css';

export default function SongLyrics(props) {
    return (
        <div className={styles["lyrics-container"]}>
            <pre>{props.lyrics}</pre>
        </div>
    );
}