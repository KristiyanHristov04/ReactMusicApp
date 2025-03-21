import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { IoMdVolumeHigh, IoMdVolumeLow, IoMdVolumeOff } from 'react-icons/io';
import styles from './CustomAudioPlayer.module.css';

export default function CustomAudioPlayer({ songUrl }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        return () => {
            audio.removeEventListener('loadedmetadata', () => {});
            audio.removeEventListener('timeupdate', () => {});
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e) => {
        const value = e.target.value;
        audioRef.current.volume = value;
        setVolume(value);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className={styles.player}>
            <audio ref={audioRef} src={songUrl} />
            
            <div className={styles.mainControls}>
                <button onClick={togglePlay} className={styles.playButton}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                
                <div className={styles.progressContainer}>
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className={styles.progressBar}
                    />
                    <div className={styles.timeDisplay}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            <div className={styles.volumeContainer}>
                <button className={styles.volumeIcon}>
                    {volume === 0 ? <IoMdVolumeOff /> : 
                     volume < 0.5 ? <IoMdVolumeLow /> : 
                     <IoMdVolumeHigh />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className={styles.volumeSlider}
                />
            </div>
        </div>
    );
} 