import styles from './Spinner.module.css';

export default function Spinner() {
    return (
        <div className={styles["spinner-container"]}>
            <div className={styles.loader}></div>
            <p>Loading songs...</p>
        </div>
    )
}
