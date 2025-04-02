import Alert from "./Alert";
import { render, screen } from "@testing-library/react";

describe("Alert", () => {
    it("Should render the success alert", () => {
        render(<Alert message="Test message" variant="success" />);

        expect(screen.getByText("Test message")).toBeInTheDocument();
        expect(screen.getByTestId("success-icon")).toBeInTheDocument();
    })

    it("Should render the warning alert", () => {
        render(<Alert message="Test message" variant="warning" />);

        expect(screen.getByText("Test message")).toBeInTheDocument();
        expect(screen.getByTestId("warning-icon")).toBeInTheDocument();
    })

    it("Should render the danger alert", () => {
        render(<Alert message="Test message" variant="danger" />);

        expect(screen.getByText("Test message")).toBeInTheDocument();
        expect(screen.getByTestId("close-button")).toBeInTheDocument();
    })
})          
