"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { AutoExpandingTextarea } from "./auto-expanding-textarea";
import { MarkdownRenderer } from "./markdown-renderer";
import { sendMessage, clearAllMessages } from "@/app/actions";
import { TypingIndicator } from "./typing-indicator";

export function ChatInterface({ initialMessages }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [state, formAction, isPending] = useActionState(sendMessage, {
    success: true,
  });
  const scrollAreaRef = useRef(null);
  const formRef = useRef(null);
  const [clearState, clearAction, isClearPending] = useActionState(
    clearAllMessages,
    { success: true }
  );

  // Actualizar mensajes cuando cambie el estado inicial
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Scroll automático al final cuando se agregan nuevos mensajes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Limpiar el textarea después de enviar exitosamente
  useEffect(() => {
    if (state?.success && !isPending) {
      setMessage("");
    }
  }, [state, isPending]);

  const handleSubmit = (formData) => {
    formAction(formData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isPending) {
        formRef.current?.requestSubmit();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600" />
              Pregúntale al Maestro - Especialista en Tuberías y Conexiones de
              PVC
            </CardTitle>
            <form action={clearAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isClearPending || messages.length === 0}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              >
                {isClearPending ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="ml-1 hidden sm:inline">Limpiar Chat</span>
              </Button>
            </form>
          </div>
          {clearState?.error && (
            <p className="text-red-600 text-sm mt-2">{clearState.error}</p>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 pb-20">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="max-w-md mx-auto">
                    ¡Hola! Soy el Maestro. Puedes preguntarme cualquier cosa
                    relacionada con Tuberías y conexiones de PVC, estoy aquí
                    para ayudarte.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {msg.role === "user" ? (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <MarkdownRenderer content={msg.content} />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isPending && <TypingIndicator />}
            </div>
          </ScrollArea>

          <div className="sticky bottom-0 bg-white border-t p-4 z-10 shadow-lg">
            <form
              ref={formRef}
              action={handleSubmit}
              className="flex flex-row gap-2 items-center justify-center"
            >
              <div className="flex-1 min-w-0">
                <AutoExpandingTextarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Pregunta lo que necesites..."
                  disabled={isPending}
                  onKeyDown={handleKeyDown}
                  style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                />
                <input type="hidden" name="message" value={message} />
              </div>
              <Button
                type="submit"
                disabled={!message.trim() || isPending}
                className="flex-shrink-0"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>

            {state?.error && (
              <p className="text-red-600 text-sm mt-2">{state.error}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
