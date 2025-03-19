import { Link } from 'react-router-dom';
import Navigation from '../navigation/Navigation';
import styles from './NotFound.module.css';

const NotFound = () => {
    return (
        <div className={styles.container}>
            <Navigation />
            <div className={styles.notFoundContent}>
                <h1 className={styles.title}>404</h1>
                <h2 className={styles.subtitle}>Page Not Found</h2>
                <p className={styles.message}>
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className={styles.homeButton}>
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound; 