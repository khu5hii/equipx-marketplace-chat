import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, User } from "lucide-react";
import { Equipment } from "./EquipmentCard";

interface Message {
  id: string;
  text: string;
  sender: "user" | "seller";
  timestamp: Date;
}

interface ChatWindowProps {
  equipment: Equipment;
  onClose: () => void;
  currentUser: string;
}

export const ChatWindow = ({ equipment, onClose, currentUser }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hi! I'm interested in the ${equipment.name}. Is it still available?`,
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: "2", 
      text: "Hello! Yes, it's still available. Would you like to know more about its condition?",
      sender: "seller",
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // Simulate seller response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'll get back to you shortly.",
        sender: "seller", 
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <Card className="fixed inset-4 md:right-4 md:left-auto md:w-96 md:h-[500px] z-50 shadow-medical">
      <CardHeader className="gradient-medical text-primary-foreground flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="text-lg">Chat with {equipment.seller}</CardTitle>
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "gradient-medical text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="transition-smooth"
            />
            <Button 
              onClick={sendMessage}
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