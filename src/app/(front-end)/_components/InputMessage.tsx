import { FiSend } from "react-icons/fi";
interface InputMessageProps {
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function InputMessage({ handleSendMessage }: InputMessageProps) {
  return (
    <form
        onSubmit={handleSendMessage}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[50%]"
      >
        <div className="flex gap-2 bg-white rounded-xl px-2 py-1">
          <input
            type="text"
            name="message"
            placeholder="Digite sua mensagem..."
            autoComplete="off"
            className="flex-1  px-4 py-2 focus:outline-none "
          />
          <button
            type="submit"
            className=" text-ice-blue rounded-lg px-4 py-2  focus:outline-none cursor-pointer hover:scale-115 transition-all duration-100"
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
  );
}