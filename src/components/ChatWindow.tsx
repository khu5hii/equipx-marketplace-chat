import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send } from "lucide-react";
import { Equipment, Message } from "@/models/models";
import { getMessages, sendMessage } from "@/services/chats.service";


interface ChatWindowProps {
  equipment: Equipment;
  onClose: () => void;
  currentUser: string;
  currentUserId: string;
}

export const ChatWindow = ({ equipment, onClose, currentUser, currentUserId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const POLLING_INTERVAL = 5000; // Polling interval in milliseconds (5 seconds)

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getMessages(equipment._id);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Start polling when the component mounts
  useEffect(() => {
    fetchMessages(); // Initial fetch
    const intervalId = setInterval(fetchMessages, POLLING_INTERVAL); // Set up polling

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [equipment._id]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      senderId: currentUserId,
      sender: currentUser,
      equipmentId: equipment._id,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      const sentMessage = await sendMessage(message);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Card className="fixed inset-4 md:right-4 md:left-auto md:w-96 md:h-[500px] z-50 shadow-medical">
      <CardHeader className="gradient-medical text-primary-foreground flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="text-lg">Chat with {currentUserId == equipment.sellerId ? 'Buyers' : equipment.seller}</CardTitle>
          <p className="text-sm opacity-90">{equipment.name}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${msg.senderId === currentUserId
                      ? "gradient-medical text-primary-foreground"
                      : "bg-muted text-foreground"
                    }`}
                >
                  <p className={`text-xs mt-1 ${msg.senderId === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {msg.sender}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${msg.senderId === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="transition-smooth"
            />
            <Button
              onClick={handleSendMessage}
              className="gradient-medical shadow-button transition-bounce hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};