export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex gap-3 max-w-[80%]">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zM8 13H6v-2h2v2zm0-4H6V7h2v2zm4 4h-2v-2h2v2zm0-4h-2V7h2v2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">
              El Maestro está escribiendo
            </span>
            <div className="flex space-x-1 ml-2">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
