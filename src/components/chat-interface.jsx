"use client";

import { useState, useEffect, useRef } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Trash2 } from "lucide-react";
import { AutoExpandingTextarea } from "./auto-expanding-textarea";
import { sendMessage, clearAllMessages } from "@/app/actions";
import { TypingIndicator } from "./typing-indicator";

import { MessageComponent } from "./Message";

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

  // Función para hacer scroll al final
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  };

  // Scroll automático al final cuando se agregan nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

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
    <Card className="flex flex-col items-center h-screen w-full pt-4 pb-0">
      <CardHeader className="sticky top-0 bg-white z-20 border-b shadow-sm w-full rounded-b-3xl">
        <div className="flex items-center justify-between">
          <CardTitle className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-600" />
              Pregúntale al Maestro - Especialista en Tuberías y Conexiones de
              PVC
            </span>
            <span className="text-[10px] font-semibold max-w-md text-rose-500">
              DEMO TÉCNICA - SÓLO RESPONDE PARA TUBERÍAS CONDUIT ELÉCTRICAS
            </span>
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

      <CardContent className="flex-1 flex flex-col p-0 w-full">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 pb-5">
          <div className="space-y-6">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="max-w-md mx-auto">
                  ¡Hola! Soy el Maestro. Puedes preguntarme cualquier cosa
                  relacionada con Tuberías y conexiones de PVC, estoy aquí para
                  ayudarte.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <MessageComponent key={msg._id} msg={msg} />
              ))
            )}
            {isPending && <TypingIndicator />}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="sticky bottom-0 border-t-2 p-4 z-10 flex flex-col w-full gap-2 bg-white">
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-row gap-2 items-center justify-center w-full"
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
        <span className="text-[10px] font-semibold max-w-md text-muted-foreground">
          DEMO TÉCNICA - SÓLO RESPONDE PARA TUBERÍAS CONDUIT ELÉCTRICAS
        </span>
        {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      </CardFooter>
    </Card>
  );
}
