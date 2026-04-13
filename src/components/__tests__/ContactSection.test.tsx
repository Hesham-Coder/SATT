import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ContactSection } from "@/components/sections/ContactSection";

describe("ContactSection integration", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows validation errors and success feedback", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<ContactSection />);

    await user.click(screen.getByRole("button", { name: "إرسال الرسالة" }));

    expect(screen.getByText("الاسم مطلوب.")).toBeInTheDocument();
    expect(screen.getByText("البريد الإلكتروني مطلوب.")).toBeInTheDocument();
    expect(screen.getByText("الرسالة مطلوبة.")).toBeInTheDocument();

    await user.type(screen.getByLabelText("الاسم"), "Jane");
    await user.type(screen.getByLabelText("البريد الإلكتروني"), "jane@example.com");
    await user.type(screen.getByLabelText("رسالتك"), "We need a redesign.");

    await user.click(screen.getByRole("button", { name: "إرسال الرسالة" }));

    jest.advanceTimersByTime(900);

    expect(
      await screen.findByText(
        "شكراً لك، تم إرسال رسالتك بنجاح وسنفيدك قريباً.",
      ),
    ).toBeInTheDocument();
  });
});
