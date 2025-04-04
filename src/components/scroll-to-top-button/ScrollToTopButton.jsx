import { IoIosArrowUp } from "react-icons/io";
import { useScroll } from "../../hooks/useScroll";
import styles from "./ScrollToTopButton.module.css";
export default function ScrollToTopButton() {
    const { scrollToTop, showScrollButton } = useScroll();

    return (
        <>
            {showScrollButton && (
                <IoIosArrowUp data-testid="scroll-to-top-icon" onClick={scrollToTop} className={styles["scroll-to-top-icon"]} />
            )}
        </>
    );
}
