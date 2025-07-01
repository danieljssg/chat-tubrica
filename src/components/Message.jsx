import moment from "moment";
import "moment/locale/es";
import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";
export const MessageComponent = ({ msg }) => {
  return (
    <div
      key={msg._id}
      className={`flex gap-3 ${
        msg.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col gap-1 max-w-[90%] ${
          msg.role === "user" ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`flex gap-3 ${
            msg.role === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div className="flex-shrink-0">
            {msg.role === "user" ? (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white " />
              </div>
            ) : (
              <div className="w-8 h-8 bg-stone-500 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white " />
              </div>
            )}
          </div>
          <div
            className={`rounded-xl px-4 py-3 shadow-lg ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-accent/85 text-gray-900"
            }`}
          >
            {msg.role === "user" ? (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <MarkdownRenderer content={msg.content} />
            )}
          </div>
        </div>
        <div
          className={`text-[10px] font-semibold text-gray-500 px-2 ${
            msg.role === "user" ? "text-right" : "text-left"
          }`}
        >
          {moment(msg.timestamp || msg.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};
