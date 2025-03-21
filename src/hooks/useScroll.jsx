import { useState, useEffect } from "react";

export function useScroll() {
    const [showScrollButton, setShowScrollButton] = useState(false);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return {
        scrollToTop,
        showScrollButton
    }
}
