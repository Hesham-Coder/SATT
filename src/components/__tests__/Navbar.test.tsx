import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Navbar } from "@/components/layout/Navbar";
import { TranslationProvider } from "@/i18n/provider";
import messages from "../../../messages/ar.json";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
}));

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

    render(
      <TranslationProvider locale="ar" messages={messages}>
        <Navbar />
      </TranslationProvider>
    );

    await user.click(screen.getAllByRole("link", { name: "احجز الآن" })[0]);

    expect(
      document.getElementById("contact")?.scrollIntoView,
    ).toHaveBeenCalled();
  });
});
