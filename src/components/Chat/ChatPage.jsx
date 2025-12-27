import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import Container from "@mui/material/Container";
import { useLocation } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useTheme } from "@mui/material/styles"; // ✅ أضف هذا
import "./Chat.css";
import { useUnreadCount } from "../../Context/unreadCountContext";
export default function ChatPage() {
  const theme = useTheme(); // ✅ استخدم الـ theme
  const isDark = theme.palette.mode === "dark"; // ✅ تحقق من Dark Mode
 const {connection}= useUnreadCount();
  const location = useLocation();
  const initialConv = location.state || null;

  const [selectedConv, setSelectedConv] = useState(initialConv);
  const [conversations, setConversations] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChatList, setShowChatList] = useState(() => {
    if (window.innerWidth <= 768 && initialConv?.autoOpen) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setShowChatList(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && initialConv?.autoOpen) {
      setSelectedConv(initialConv);
      setShowChatList(false);
    } else if (isMobile && !initialConv) {
      setSelectedConv(null);
      setShowChatList(true);
    }
  }, [initialConv, isMobile]);

  const handleSelectConversation = (convObj) => {
    setSelectedConv(convObj);

    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedConv(null);
  };
useEffect(() => {
  const onNewMessage = (event) => {
    const message = event.detail;
    setConversations((prev) => {
      const existing = prev.find(c => c.id === message.conversationId);
      if (existing) {
        return prev.map(c => c.id === message.conversationId 
          ? { 
              ...c, 
              lastMessage: message, 
              unreadCount: selectedConv?.convId === c.id ? 0 : (c.unreadCount + 1) 
            } 
          : c).sort((a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt));
      }
      return prev; 
    });
  };

  window.addEventListener("NEW_SIGNALR_MESSAGE", onNewMessage);
  return () => window.removeEventListener("NEW_SIGNALR_MESSAGE", onNewMessage);
}, [selectedConv]);
  // useEffect(() => {

  //   if (!connection) return;

  //   // مستمع خاص بصفحة الشات لتحديث القائمة لحظياً
  //   const handleMessage = (message) => {
  //     setConversations((prev) => {
  //       const existing = prev.find(c => c.id === message.conversationId);
  //       if (existing) {
  //         return prev.map(c => c.id === message.conversationId 
  //           ? { ...c, lastMessage: message, unreadCount: c.unreadCount + 1 } 
  //           : c).sort((a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt));
  //       }
  //       return prev; 
  //     });
  //   };

  //   connection.on("ReceiveMessage", handleMessage);
    
  //   // تنظيف المستمع عند مغادرة الصفحة (دون إغلاق الاتصال بالكامل)
  //   return () => connection.off("ReceiveMessage", handleMessage);
  // }, [connection]);
  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
      {/* ✅ أضف class "dark-mode" لو Dark Mode مفعّل */}
      <div className={`chat-container ${isDark ? "dark-mode" : ""}`}>

        {(!isMobile || showChatList) && (
          <ChatList
            className={isMobile && showChatList ? "mobile-show" : ""}
            conversations={conversations}
            setConversations={setConversations}
            selectedConvId={selectedConv?.convId}
            onSelectConversation={(convId, receiverId, receiverName, receiverImage) =>
              handleSelectConversation({
                convId,
                receiverId,
                receiverName,
                receiverImage,
              })
            }
          />
        )}

        {(!isMobile || (!showChatList && selectedConv)) && (
          selectedConv ? (
            <ChatWindow
              conversationId={selectedConv.convId}
              receiverId={selectedConv.receiverId}
              receiverName={selectedConv.receiverName}
              receiverImage={selectedConv.receiverImage}
              setConversations={setConversations}
              onBack={isMobile ? handleBackToList : null}
            />
          ) : (
            <div className="empty-window">
              <MailOutlineIcon
                sx={{
                  fontSize: 64,
                  opacity: 0.5,
                  color: "#999",
                  mb: 2,
                }}
              />
              <p>Select a conversation to start messaging</p>
            </div>
          )
        )}

      </div>
    </Container>
  );
}