import React, { useState, useEffect } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import Container from "@mui/material/Container";
import { useLocation } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import "./Chat.css";
export default function ChatPage() {
  const location = useLocation();
  const initialConv = location.state || null;

  const [selectedConv, setSelectedConv] = useState(initialConv);
  const [conversations, setConversations] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const [showChatList, setShowChatList] = useState(() => {
  // إذا موبايل + جاي من profile → افتح الشات
  if (window.innerWidth <= 768 && initialConv?.autoOpen) {
    return false;
  }
  return true; // الافتراضي: افتح قائمة المحادثات
});

  // تحديث حالة الموبايل عند تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setShowChatList(true); // على الكمبيوتر دائمًا تظهر القائمة
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // لو جاي من الـ profile → افتح المحادثة مباشرة (حسب اختيارك رقم 2)
useEffect(() => {
  if (isMobile && initialConv?.autoOpen) {
    setSelectedConv(initialConv);
    setShowChatList(false);
  } else if (isMobile && !initialConv) {
    setSelectedConv(null);
    setShowChatList(true); // لو مش جاي من profile → افتح القائمة
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

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <div className="chat-container">

        {/* قائمة المحادثات */}
        {(!isMobile || showChatList) && (
          <ChatList   className={isMobile && showChatList ? "mobile-show" : ""}
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

        {/* نافذة الدردشة */}
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
