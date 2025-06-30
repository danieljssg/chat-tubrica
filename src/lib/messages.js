import connectDB from "./mongodb";
import Message from "../models/Message";

export async function getMessages() {
  try {
    await connectDB();

    const messages = await Message.find({})
      .sort({ createdAt: 1 }) // Ordenar por fecha de creación ascendente
      .lean(); // Obtener objetos JavaScript planos

    // Transformar los datos para mantener compatibilidad con la interfaz existente
    return messages.map((msg) => ({
      id: msg._id.toString(),
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp || msg.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function saveMessage(messageData) {
  try {
    await connectDB();

    const message = new Message({
      role: messageData.role,
      content: messageData.content,
      timestamp: new Date(),
    });

    const savedMessage = await message.save();

    // Retornar en el formato esperado
    return {
      id: savedMessage._id.toString(),
      role: savedMessage.role,
      content: savedMessage.content,
      timestamp: savedMessage.timestamp,
    };
  } catch (error) {
    console.error("Error saving message:", error);
    throw new Error("Failed to save message");
  }
}

export async function saveMessages(messages) {
  try {
    await connectDB();

    // Si se pasa un array vacío, limpiar toda la colección
    if (messages.length === 0) {
      await Message.deleteMany({});
      return [];
    }

    // Si se pasan mensajes, reemplazar toda la colección
    await Message.deleteMany({});

    const messagesToInsert = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp || new Date(),
    }));

    const savedMessages = await Message.insertMany(messagesToInsert);

    return savedMessages.map((msg) => ({
      id: msg._id.toString(),
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));
  } catch (error) {
    console.error("Error saving messages:", error);
    throw new Error("Failed to save messages");
  }
}

export async function clearMessages() {
  try {
    await connectDB();
    await Message.deleteMany({});
    return [];
  } catch (error) {
    console.error("Error clearing messages:", error);
    throw new Error("Failed to clear messages");
  }
}
