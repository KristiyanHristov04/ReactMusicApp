import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SongLyrics from "./SongLyrics";

describe('SongLyrics', () => {
    it('Should render the SongLyrics component with provided lyrics', () => {
        render(<SongLyrics lyrics="Havana oh na na" />);
        expect(screen.getByText('Havana oh na na')).toBeInTheDocument();
    });

    it('Should render the SongLyrics component with empty lyrics', () => {
        render(<SongLyrics lyrics="" />);

        const lyricsElement = screen.getByTestId('lyrics');
        expect(lyricsElement).toBeEmptyDOMElement();
    });
});
