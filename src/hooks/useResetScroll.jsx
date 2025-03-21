import { useEffect } from "react";

export function useResetScroll() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, []);
}
