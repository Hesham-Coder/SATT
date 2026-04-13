import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Navbar } from "@/components/layout/Navbar";

describe("Navbar integration", () => {
  beforeEach(() => {
    const top = document.createElement("section");
    top.id = "top";
    top.scrollIntoView = jest.fn();
    document.body.appendChild(top);

    const about = document.createElement("section");
    about.id = "about";
    about.scrollIntoView = jest.fn();
    document.body.appendChild(about);

    const pillars = document.createElement("section");
    pillars.id = "pillars";
    pillars.scrollIntoView = jest.fn();
    document.body.appendChild(pillars);

    const contact = document.createElement("section");
    contact.id = "contact";
    contact.scrollIntoView = jest.fn();
    document.body.appendChild(contact);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("scrolls smoothly when a nav item is clicked", async () => {
    const user = userEvent.setup();

    render(<Navbar />);

    await user.click(screen.getAllByRole("button", { name: "تواصل معنا" })[0]);

    expect(
      document.getElementById("contact")?.scrollIntoView,
    ).toHaveBeenCalled();
  });
});
