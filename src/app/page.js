import { getMessages } from "@/lib/messages";
import { ChatInterface } from "@/components/chat-interface";

export default async function HomePage() {
  const messages = await getMessages();

  return <ChatInterface initialMessages={messages} />;
}
