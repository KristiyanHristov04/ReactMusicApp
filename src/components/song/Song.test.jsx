import Song from "./Song";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import FavouriteSongsContext from "../../context/FavouriteSongsContext";

describe("Song", () => {
    it("Should render the song name", () => {
        const mockUser = [{}];
        const mockFavorites = {
            favouriteSongs: [],
            toggleFavouriteSong: () => { }
        };

        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockUser}>
                    <FavouriteSongsContext.Provider value={mockFavorites}>
                        <Song
                            id="1"
                            name="Test Song"
                            artists={[{ id: "101", name: "Kristiyan Hristov", artist_image_url: "kristiyan-hristov.jpg" }]}
                            thumbnailImage="thumbnail.jpg"
                        />
                    </FavouriteSongsContext.Provider>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText("Test Song")).toBeInTheDocument();
        expect(screen.getByAltText("Test Song")).toBeInTheDocument();
    });

    it("Should render the artist name", () => {
        const mockUser = [{}];
        const mockFavorites = {
            favouriteSongs: [],
            toggleFavouriteSong: () => { }
        };

        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockUser}>
                    <FavouriteSongsContext.Provider value={mockFavorites}>
                        <Song
                            id="1"
                            name="Test Song"
                            artists={[{ id: "101", name: "Kristiyan Hristov", artist_image_url: "kristiyan-hristov.jpg" }]}
                            thumbnailImage="thumbnail.jpg"
                        />
                    </FavouriteSongsContext.Provider>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText("Kristiyan Hristov")).toBeInTheDocument();
    });

    it("Should render the thumbnail image", () => {
        const mockUser = [{}];
        const mockFavorites = {
            favouriteSongs: [],
            toggleFavouriteSong: () => { }
        };

        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockUser}>
                    <FavouriteSongsContext.Provider value={mockFavorites}>
                        <Song
                            id="1"
                            name="Test Song"
                            artists={[{ id: "101", name: "Kristiyan Hristov", artist_image_url: "kristiyan-hristov.jpg" }]}
                            thumbnailImage="thumbnail.jpg"
                        />
                    </FavouriteSongsContext.Provider>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByAltText("Test Song")).toHaveAttribute("src", "thumbnail.jpg");
    });
});
