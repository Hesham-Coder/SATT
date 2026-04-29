import { act, renderHook } from "@testing-library/react";

import { submitContactForm } from "@/app/actions/contact";
import { useContactForm } from "@/hooks/useContactForm";

jest.mock("@/app/actions/contact", () => ({
  submitContactForm: jest.fn(),
}));

const mockedSubmitContactForm = jest.mocked(submitContactForm);

describe("useContactForm", () => {
  afterEach(() => {
    mockedSubmitContactForm.mockReset();
  });

  it("reports validation errors for empty submissions", async () => {
    const { result } = renderHook(() => useContactForm());

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as never);
    });

    expect(result.current.errors).toEqual({
      email: "Email is required",
      message: "Message is required",
      name: "Name is required",
    });
    expect(mockedSubmitContactForm).not.toHaveBeenCalled();
  });

  it("submits successfully with valid values", async () => {
    mockedSubmitContactForm.mockResolvedValue({ success: true });
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.handleChange("name", "Jane");
      result.current.handleChange("email", "jane@example.com");
      result.current.handleChange("message", "Hello there");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as never);
    });

    expect(mockedSubmitContactForm).toHaveBeenCalledWith({
      email: "jane@example.com",
      message: "Hello there",
      name: "Jane",
    });
    expect(result.current.submitStatus).toBe("success");
    expect(result.current.values).toEqual({
      email: "",
      message: "",
      name: "",
    });
  });
});
