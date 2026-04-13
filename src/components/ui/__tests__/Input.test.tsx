import { render, screen } from "@testing-library/react";

import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("connects label and input accessibly", () => {
    render(<Input id="email" label="Email" name="email" />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
  });

  it("renders an error message when provided", () => {
    render(
      <Input
        error="Email is required."
        id="email"
        label="Email"
        name="email"
      />,
    );

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
