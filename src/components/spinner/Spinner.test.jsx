import Spinner from "./Spinner";
import { render, screen } from "@testing-library/react";

it("Should render the Spinner component", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
});

