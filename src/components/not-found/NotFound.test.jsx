import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

vi.mock('../navigation/Navigation', () => ({
  default: () => <nav>Fake Navigation</nav>,
}));

it('Should render the NotFound component', () => {
    render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    );
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText("Oops! The page you're looking for doesn't exist or has been moved.")).toBeInTheDocument();
    expect(screen.getByText('Go Back Home')).toBeInTheDocument();
});
