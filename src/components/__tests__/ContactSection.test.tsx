import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ContactSection } from "@/components/sections/ContactSection";
import { TranslationProvider } from "@/i18n/provider";
import messages from "../../../messages/ar.json";

jest.mock("@/app/actions/contact", () => ({
  submitContactForm: jest.fn(async () => ({ success: true })),
}));

const contactMessages = messages.contact;

describe("ContactSection integration", () => {
  it("shows validation errors and success feedback", async () => {
    const user = userEvent.setup();

    render(
      <TranslationProvider locale="ar" messages={messages}>
        <ContactSection />
      </TranslationProvider>,
    );

    await user.click(screen.getByRole("button", { name: contactMessages.submitBtn }));

    expect(screen.getByText(`${contactMessages.name} مطلوب.`)).toBeInTheDocument();
    expect(screen.getByText(`${contactMessages.email} مطلوب.`)).toBeInTheDocument();
    expect(screen.getByText(`${contactMessages.message} مطلوب.`)).toBeInTheDocument();

    await user.type(screen.getByLabelText(contactMessages.name), "Jane");
    await user.type(screen.getByLabelText(contactMessages.email), "jane@example.com");
    await user.type(screen.getByLabelText(contactMessages.message), "We need a redesign.");

    await user.click(screen.getByRole("button", { name: contactMessages.submitBtn }));

    expect(await screen.findByText(contactMessages.successMessage)).toBeInTheDocument();
  });
});
