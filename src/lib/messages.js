import fs from "fs/promises";
import path from "path";

const messagesPath = path.join(process.cwd(), "messages.json");

export async function getMessages() {
  try {
    const data = await fs.readFile(messagesPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, devolver array vacío
    return [];
  }
}

export async function saveMessage(message) {
  const messages = await getMessages();
  const newMessage = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...message,
  };

  messages.push(newMessage);

  await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
  return newMessage;
}

export async function saveMessages(messages) {
  await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
}
