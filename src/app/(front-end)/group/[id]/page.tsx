"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Group, Message } from "../../_types/types";
import Loading from "../../_components/Loading";
import MessageItem from "../../_components/MessageItem";
import InputMessage from "../../_components/InputMessage";

export default function GroupPage() {
  const { id } = useParams();
  const [group, setGroup] = useState<Group>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({});
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/group/${id}`);
        const data = await response.json();
        setGroup(data.group);
      } catch (error) {
        console.error("Error fetching group:", error);
      } finally {
        setIsLoading(false);
        setTimeout(scrollToBottom, 0); 
      }
    };

    fetchGroup();
  }, [id]);

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/group/${id}/message`, {
        method: "DELETE",
        body: JSON.stringify({ messageId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = (e.target as HTMLFormElement).message.value;
    const isValid = message.trim() !== "";

    if (!isValid) return;

    try {
      const response = await fetch(`/api/group/${id}/message`, {
        method: "POST",
        body: JSON.stringify({ content: message }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchMessages();

      if (!response.ok) {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      (e.target as HTMLFormElement).reset();
    }
  };

  const fetchMessages = async () => {
    const response = await fetch(`/api/group/${id}/message?page=1`);
    const data = await response.json();
    setMessages(data.messages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkNewMessages = async () => {
    try {
      const response = await fetch(`/api/group/${id}/message?page=1`);
      const data = await response.json();
      
      if (data.messages.length > 0) {
        // Verifica mensagens novas
        const newMessages = data.messages.filter((msg: Message) => 
          !messages.some(m => m.id === msg.id)
        );
        
        // Verifica mensagens deletadas
        const deletedMessageIds = messages
          .filter(m => !data.messages.some((msg: Message) => msg.id === m.id))
          .map(m => m.id);

        if (newMessages.length > 0 || deletedMessageIds.length > 0) {
          // Atualiza a lista de mensagens
          setMessages(prev => {
            // Remove mensagens deletadas
            const filteredMessages = prev.filter(m => !deletedMessageIds.includes(m.id));
            // Adiciona novas mensagens
            return [...filteredMessages, ...newMessages];
          });

          // Se o usuário estiver no final da conversa, rola para baixo
          if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop === clientHeight;
            if (isAtBottom) {
              scrollToBottom();
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking new messages:", error);
    }
  };

  useEffect(() => {
    // Verifica novas mensagens a cada 5 segundos
    const interval = setInterval(checkNewMessages, 5000);
    
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [id, messages]);

  if (isLoading) {
    return <Loading />;
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Grupo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-ice-blue h-full relative">
      {/* Header */}
      <div className="flex items-center bg-foreground border-b border-light-gray p-4 h-14">
        <div className="flex items-center gap-2">
          <div className="flex w-10 h-10 rounded-full items-center justify-center bg-ice-blue text-white">
            {group.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className=" text-rich-black">{group.name}</p>
            <p className="text-sm text-navy-gray">
              {group.members.length} members
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="relative flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/background.svg')] bg-repeat bg-contain pb-24"
      >
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isUser={userId == message.user.id}
            handleDeleteMessage={handleDeleteMessage}
          />
        ))}
        <div ref={messagesEndRef} />
        <div />
      </div>

      <InputMessage handleSendMessage={handleSendMessage} />
    </div>
  );
}
