import { render, screen } from "@testing-library/react";
import ScrollToTopButton from "./ScrollToTopButton";
import { useScroll } from "../../hooks/useScroll";

vi.mock("../../hooks/useScroll", () => ({
    useScroll: vi.fn()
}));

describe("ScrollToTopButton", () => {
    it("Should render the ScrollToTopButton component when the showScrollButton is true", () => {
        useScroll.mockReturnValue({
            showScrollButton: true
        });

        render(<ScrollToTopButton />);
        expect(screen.queryByTestId("scroll-to-top-icon")).toBeInTheDocument();
    });

    it("Should not render the ScrollToTopButton component when the showScrollButton is false", () => {
        useScroll.mockReturnValue({
            showScrollButton: false
        });

        render(<ScrollToTopButton />);
        expect(screen.queryByTestId("scroll-to-top-icon")).not.toBeInTheDocument();
    });
});
