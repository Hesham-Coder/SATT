import { act, renderHook } from "@testing-library/react";

import { useForm } from "@/hooks/useForm";

describe("useForm", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("reports validation errors for empty submissions", async () => {
    const { result } = renderHook(() => useForm());

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as never);
    });

    expect(result.current.errors).toEqual({
      message: "الرسالة مطلوبة.",
      name: "الاسم مطلوب.",
    });
  });

  it("submits successfully with valid values", async () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.handleChange("name", "Jane");
      result.current.handleChange("email", "jane@example.com");
      result.current.handleChange("message", "Hello there");
    });

    await act(async () => {
      const submitPromise = result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as never);
      jest.advanceTimersByTime(900);
      await submitPromise;
    });

    expect(result.current.submitStatus).toBe("success");
    expect(result.current.values).toEqual({
      email: "",
      message: "",
      name: "",
    });
  });

  it("submits successfully with an empty email", async () => {
    const { result } = renderHook(() => useForm());

    act(() => {
      result.current.handleChange("name", "Jane");
      result.current.handleChange("email", "");
      result.current.handleChange("message", "Hello there");
    });

    await act(async () => {
      const submitPromise = result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as never);
      jest.advanceTimersByTime(900);
      await submitPromise;
    });

    expect(result.current.submitStatus).toBe("success");
  });
});
