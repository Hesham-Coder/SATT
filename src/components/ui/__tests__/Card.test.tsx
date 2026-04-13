import { render, screen } from "@testing-library/react";

import { Card } from "@/components/ui/Card";

describe("Card", () => {
  it("renders its content", () => {
    render(
      <Card>
        <p>Card body</p>
      </Card>,
    );

    expect(screen.getByText("Card body")).toBeInTheDocument();
  });
});
