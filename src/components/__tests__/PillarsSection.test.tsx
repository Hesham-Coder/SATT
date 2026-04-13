import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PillarsSection } from "@/components/sections/PillarsSection";

describe("PillarsSection integration", () => {
  it("filters pillars when a focus area pill is selected", async () => {
    const user = userEvent.setup();

    render(<PillarsSection />);

    expect(screen.getByText(/عرض 4 محاور/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "مؤتمرات" }));

    // After filtering for "مؤتمرات", only 1 pillar matches
    expect(screen.getByText(/عرض 1 محور/i)).toBeInTheDocument();
    expect(screen.getByText("التعليم الطبي المستمر")).toBeInTheDocument();
    expect(screen.queryByText("دعم البحث العلمي")).not.toBeInTheDocument();
  });
});
