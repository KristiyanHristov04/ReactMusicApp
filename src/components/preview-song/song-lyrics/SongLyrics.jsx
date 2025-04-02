import styles from './SongLyrics.module.css';

export default function SongLyrics({
    lyrics
}) {
    return (
        <div className={styles["lyrics-container"]}>
            <pre data-testid="lyrics">{lyrics}</pre>
        </div>
    );
}