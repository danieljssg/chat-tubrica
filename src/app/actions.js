"use server";

import { generateResponse } from "@/lib/gemini";
import { getMessages, saveMessage } from "@/lib/messages";
import { revalidatePath } from "next/cache";

export async function sendMessage(prevState, formData) {
  const userMessage = formData.get("message");

  if (!userMessage || userMessage.trim() === "") {
    return {
      success: false,
      error: "El mensaje no puede estar vacío",
    };
  }

  try {
    // Obtener historial de mensajes
    const messages = await getMessages();

    // Guardar mensaje del usuario
    await saveMessage({
      role: "user",
      content: userMessage.trim(),
    });

    // Generar respuesta del AI
    const aiResponse = await generateResponse(userMessage.trim(), messages);

    // Guardar respuesta del AI
    await saveMessage({
      role: "assistant",
      content: aiResponse,
    });

    // Revalidar la página para mostrar los nuevos mensajes
    revalidatePath("/");

    return {
      success: true,
      message: "Mensaje enviado correctamente",
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: "Error al enviar el mensaje. Por favor, intenta de nuevo.",
    };
  }
}
