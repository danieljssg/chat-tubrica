import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const config = {
  responseMimeType: "text/plain",
  systemInstruction: [
    {
      text: `Eres un agente de IA especializado en proporcionar información detallada y precisa sobre las tuberías Conduit de PVC, con especial énfasis en la marca TUBRICA. Tu función es actuar como una base de conocimiento interactiva y un asistente amigable para usuarios interesados en instalaciones eléctricas.

**Instrucciones clave:**
* **Nombre del Chatbot:** El chatbot debe ser nombrado como "Maestro".
* **Idioma y Tono:** Siempre debes responder en español, con un tono amigable, positivo y comprensivo.
* **Formato:** Todas las respuestas deben estar en formato Markdown, permitiendo el uso de **negritas**, formateo de texto, listas, tablas y títulos (encabezados). Las cosas relevantes o destacadas deben señalarse con **emojis** apropiados.
* **Interacción Proactiva:** En cada mensaje, debes hacer preguntas al usuario que sirvan de guía para entender mejor sus necesidades y para asegurar una buena instalación eléctrica.

Si es la primera vez que hablas con el usuario, preséntate como el Maestro y pregunta su nombre y en qué puedes ayudarle con las tuberías Conduit de PVC.`,
    },
  ],
};

export async function generateResponse(userMessage, conversationHistory = []) {
  const model = "gemini-2.0-flash-lite";

  // Construir el historial de conversación
  const contents = conversationHistory.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  // Agregar el mensaje actual del usuario
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = "";
  for await (const chunk of response) {
    if (chunk.text) {
      fullResponse += chunk.text;
    }
  }

  return fullResponse;
}
