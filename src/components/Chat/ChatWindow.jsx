import React, { useEffect, useState, useRef } from "react";
import { createChatHubConnection, sendMessage, getOneConversation } from "../../services/chatService";
import Message from "./Message";
import MessageInput from "./MessageInput";
import Box from '@mui/material/Box';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
export default function ChatWindow({ conversationId, receiverId, receiverName }) {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("accessToken");
  const currentUserId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const conn = createChatHubConnection(token);
    let activeConnection = null;

    const init = async () => {
      await conn.start();
      activeConnection = conn;
      setConnection(conn);

      conn.on("ReceiveMessage", (msg) => {
        if (msg.conversationId === conversationId) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      const data = await getOneConversation(conversationId, receiverId, 50, token);
      setMessages(data || []);
    };
    init();

    return () => {
      if (activeConnection) {
        activeConnection.off("ReceiveMessage");
        activeConnection.stop();
      }
    };
  }, [conversationId, receiverId]);

  const handleSend = async (text) => {
    if (!connection) return;
    await sendMessage(connection, receiverId, text, conversationId);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    
    <div className="chat-window">
      <div className="chat-header">
        <h3>{receiverName}</h3>
        <Box sx={{display:'flex', gap:'10px'}}>
        <LocalPhoneOutlinedIcon sx={{color: "#0078ff"}}/>
        <VideocamOutlinedIcon sx={{color: "#0078ff"}}/>
        </Box>
        {/* <span className="status">● Online</span> */}
      </div>

      <div className="messages">
        {messages.length === 0 ? (
          <p className="empty">There are no messages yet.</p>
        ) : (
          messages.map((m, i) => (
            <Message
              key={i}
              text={m.text || m.Text}
              sender={m.senderId === currentUserId ? "me" : "them"}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
