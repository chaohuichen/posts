import Custom404 from "@/pages/404";
import { render, screen } from "@testing-library/react";

describe("Custom404 Component", () => {
  it("renders 404 message and link to home", () => {
    render(<Custom404 />);

    // Check if the 404 message is rendered
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "404: Page Not Found"
    );

    // Check if the link to home is rendered
    const homeLink = screen.getByText("Go To Home");
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest("a")).toHaveAttribute("href", "/"); // Check if link redirects to home
  });
});
