import { MessagesManager } from "./MessagesManager";
import prisma from "@/lib/db";
import type { Message } from "@prisma/client";

export default async function MessagesPage() {
  let messages: Message[] = [];
  
  try {
    messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error('Error loading messages:', error);
    // Continue even if database fails - show empty state
  }

  return (
    <div>
      <MessagesManager initialData={messages} />
    </div>
  );
}
