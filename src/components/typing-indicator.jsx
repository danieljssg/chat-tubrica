import { BookOpenText } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start font-semibold items-center">
      <div className="flex gap-3 max-w-[80%] bg-accent p-4 rounded-full items-center shadow-md">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-stone-500 rounded-full flex items-center justify-center">
            <BookOpenText className="w-4 h-4 text-white " />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            El Maestro está leyendo...
          </span>
          <div className="flex gap-4">
            <div
              className="w-3 h-3 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: "200ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-primary rounded-full animate-pulse "
              style={{ animationDelay: "400ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
