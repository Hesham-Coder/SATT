import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children and responds to clicks", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Launch</Button>);

    await user.click(screen.getByRole("button", { name: "Launch" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("shows a loading state and disables interaction", () => {
    render(<Button loading>Send inquiry</Button>);

    const button = screen.getByRole("button", { name: /loading/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
