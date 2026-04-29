"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export async function submitContactForm(data: unknown) {
  try {
    const validated = ContactSchema.parse(data);

    await prisma.message.create({
      data: {
        name: validated.name,
        email: validated.email,
        message: validated.message,
      },
    });

    revalidatePath("/dashboard/messages");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message ?? "Invalid contact form data" };
    }
    console.error("Contact form submission error:", error);
    return { error: "Failed to send message. Please try again later." };
  }
}
