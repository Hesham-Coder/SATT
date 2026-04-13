import {
  IMAGE_URL_VALIDATION_ERROR,
  VIDEO_URL_VALIDATION_ERROR,
  isValidImageUrl,
  isValidVideoUrl,
} from "@/lib/validateImage";

describe("media validators", () => {
  it("accepts only direct image URLs or uploads", () => {
    expect(isValidImageUrl("/uploads/test.jpg")).toBe(true);
    expect(isValidImageUrl("https://facebook.com/page")).toBe(false);
    expect(isValidImageUrl("https://example.com/test")).toBe(false);
    expect(isValidImageUrl("https://localhost/test.webp")).toBe(true);
    expect(IMAGE_URL_VALIDATION_ERROR).toMatch(/direct image URL/i);
  });

  it("accepts youtube or mp4 video URLs", () => {
    expect(isValidVideoUrl("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
    expect(isValidVideoUrl("/uploads/video.mp4")).toBe(true);
    expect(isValidVideoUrl("https://vimeo.com/123")).toBe(false);
    expect(isValidVideoUrl("https://example.com/video.webm")).toBe(false);
    expect(VIDEO_URL_VALIDATION_ERROR).toMatch(/youtube|mp4/i);
  });
});
