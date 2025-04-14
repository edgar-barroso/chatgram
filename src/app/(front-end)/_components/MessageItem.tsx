import { ptBR } from "date-fns/locale";
import { Message } from "../_types/types";
import { format } from "date-fns";
import DeleteModal from "./DeleteModal";

interface MessageItemProps {
  message: Message;
  isUser: boolean;
  handleDeleteMessage: (messageId: string) => void;
}
export default function MessageItem({
  message,
  isUser,
  handleDeleteMessage,
}: MessageItemProps) {
  return (
    <div
      key={message.id}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      \
      <div
        className={`max-w-[70%] rounded-lg shadow-sm p-3 ${
          isUser ? "bg-light-green " : "bg-foreground"
        } text-rich-black`}
      >
        <div className="flex items-center justify-between mb-1 gap-5">
          <span className="text-sm font-medium text-blue-700">
            {message.user?.name || "Usuário"}
          </span>
          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-xs ">
              {format(new Date(message.createdAt), "HH:mm", {
                locale: ptBR,
              })}
            </span>
            {isUser && (
              <DeleteModal
              onDelete={() => handleDeleteMessage(message.id)}
              message="Are you sure you want to delete this message?"
            />
            )}
            
          </div>
        </div>
        <p className="text-gray-800">{message.content}</p>
      </div>
    </div>
  );
}
