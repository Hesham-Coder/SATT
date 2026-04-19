import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConferencesManager } from "../ConferencesManager";

const mockFetch = jest.fn();

describe("ConferencesManager", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;

    Object.defineProperty(global, "crypto", {
      value: { randomUUID: () => "uuid" },
      configurable: true,
    });

    Object.defineProperty(URL, "createObjectURL", {
      value: jest.fn(() => "blob:preview"),
      configurable: true,
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      value: jest.fn(),
      configurable: true,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ images: [], videos: [] }),
    } as Response);
  });

  it("fails when submitting empty required fields", async () => {
    const user = userEvent.setup();
    render(<ConferencesManager initialData={[]} />);

    await user.click(screen.getByRole("button", { name: /add conference/i }));
    await user.click(screen.getByTestId("save-conference"));

    expect(await screen.findByRole("status")).toHaveTextContent(/title is required/i);
  });

  it("rejects invalid image links and previews selected upload", async () => {
    const user = userEvent.setup();
    render(<ConferencesManager initialData={[]} />);

    await user.click(screen.getByRole("button", { name: /add conference/i }));

    const fileInput = screen.getByTestId("media-upload-input") as HTMLInputElement;
    const file = new File(["dummy"], "photo.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(await screen.findByText(/photo.png/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/image url/i), "https://facebook.com/page");
    await user.click(screen.getByRole("button", { name: /add image url/i }));

    expect(await screen.findByText(/invalid image url/i)).toBeInTheDocument();
  });

  it("submits valid data and passes frontend sync", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: "conf-1", title: { ar: "ar", en: "en" }, date: "2026-04-13", category: { label: { ar: "General", en: "General" } }, images: [], videos: [], createdAt: new Date().toISOString() } }),
    } as Response);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ id: "conf-1" }] }),
    } as Response);

    render(<ConferencesManager initialData={[]} />);

    await user.click(screen.getByRole("button", { name: /add conference/i }));

    await user.type(screen.getByLabelText(/title \(ar\)/i), "Arabic title");
    await user.type(screen.getByLabelText(/title \(en\)/i), "English title");
    await user.type(screen.getByLabelText(/full description \(ar\)/i), "Arabic full description");
    await user.type(screen.getByLabelText(/full description \(en\)/i), "English full description");
    fireEvent.change(screen.getByLabelText(/^date$/i), { target: { value: "2026-04-13" } });

    await user.click(screen.getByTestId("save-conference"));

    await waitFor(() => {
      expect(screen.getByText(/conference saved successfully/i)).toBeInTheDocument();
    });
  });
});
