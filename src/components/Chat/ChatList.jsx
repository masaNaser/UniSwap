import React, { useEffect } from "react";
import { Avatar } from "@mui/material";
import { getConversations, markMessageAsSeen } from "../../services/chatService";
import { getImageUrl } from "../../utils/imageHelper";
import { useUnreadCount } from "../../Context/unreadCountContext";
import { getToken, getUserId } from "../../utils/authHelpers";
export default function ChatList({
  conversations,
  setConversations,
  onSelectConversation,
  className = "",
  selectedConvId
}) {
  // const token = localStorage.getItem("accessToken");
  const token = getToken();
  const userId = getUserId();


  const { decreaseUnreadCount, refreshUnreadCount } = useUnreadCount();
  // الاستماع للرسائل الجديدة عبر حدث مخصص
 useEffect(() => {
    const handleGlobalMessage = (event) => {
      const message = event.detail;
      setConversations((prev) => {
        const existing = prev.find(c => c.id === message.conversationId);
        
        if (existing) {
          return prev.map(c => 
            c.id === message.conversationId 
              ? { 
                  ...c, 
                  lastMessage: message, 
                  // نزيد العداد فقط إذا لم تكن هذه هي المحادثة المفتوحة حالياً
                  unreadCount: selectedConvId === c.id ? 0 : (c.unreadCount + 1) 
                } 
              : c
          ).sort((a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt));
        }
        return prev;
      });
    };

    window.addEventListener("NEW_SIGNALR_MESSAGE", handleGlobalMessage);
    return () => window.removeEventListener("NEW_SIGNALR_MESSAGE", handleGlobalMessage);
  }, [selectedConvId, setConversations]);
  const fetchConversations = async () => {
    try {
        const response = await getConversations(token);
        const convsWithNames = response.data.map((conv) => {
        const partnerId = conv.receiverId;
        const partnerName = conv.receiverName;
        const partnerImage = conv.receiverImage;

        return {
          ...conv,
          partnerId,
          partnerName,
          partnerImage,
          unreadCount: conv.unreadCount || 0 
        };
      });

      const sorted = convsWithNames.sort(
        (a, b) =>
          new Date(b.lastMessage?.createdAt || 0) -
          new Date(a.lastMessage?.createdAt || 0)
      );

      setConversations(sorted);
      //  حدّث العداد في الـ Navbar بعد جلب المحادثات
      refreshUnreadCount();
    } catch (err) {
      console.error("فشل في جلب المحادثات:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
    // ✅ جلب المحادثات كل 10 ثواني لتحديث الرسائل الجديدة
    const interval = setInterval(fetchConversations, 50000);
    return () => clearInterval(interval);
  }, []);

  const handleConversationClick = async (
    convId,
    partnerId,
    partnerName,
    partnerImage
  ) => {
    const conv = conversations.find(c => c.id === convId);
    const conversationUnreadCount = conv?.unreadCount || 0;

    console.log(`📬 Opening conversation ${convId} with ${conversationUnreadCount} unread messages`);

    onSelectConversation(convId, partnerId, partnerName, partnerImage);

    // ✅ استدعي بس إذا في conversationId حقيقي AND في رسائل مش مقروءة
    if (convId && convId !== "null" && conversationUnreadCount > 0) {
      try {
        await markMessageAsSeen(convId, token);
        console.log("✅ Marked conversation as seen:", convId);

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, unreadCount: 0 }
              : c
          )
        );

        decreaseUnreadCount(conversationUnreadCount);

      } catch (error) {
        console.error("❌ Failed to mark as seen:", error);
      }
    } else {
      console.log("⚠️ Skipping mark as seen - invalid conversationId or no unread messages");
    }
  };

  return (
    <div className={`chat-list ${className}`}>
      <h3 className="chat-list-header">Messages</h3>
      <div className="chat-list-items">
        {conversations.length === 0 ? (
          <p className="empty">There are no messages yet.</p>
        ) : (
          conversations.map((conv) => {
            const lastMsg = conv.lastMessage
              ? conv.lastMessage.text || "File"
              : "";
            const lastTime = conv.lastMessage?.createdAt
              ? new Date(conv.lastMessage?.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "";
            const initials = conv.partnerName?.substring(0, 2).toUpperCase();

            // هل في رسائل جديدة
            const hasUnread = conv.unreadCount > 0;

            return (
              <div
                key={conv.id}
                className="chat-item"
                onClick={() =>
                  handleConversationClick(
                    conv.id,
                    conv.partnerId,
                    conv.partnerName,
                    conv.partnerImage
                  )
                }
              >
                <Avatar
                  src={getImageUrl(conv.partnerImage, conv.partnerName)}
                  alt={conv.partnerName}
                  sx={{
                    width: 45,
                    height: 45,
                    marginRight: '10px',
                    flexShrink: 0
                  }}
                >
                  {conv.partnerName?.substring(0, 2).toUpperCase()}
                </Avatar>
                <div className="chat-info">
                  <div className="chat-name">{conv.partnerName}</div>
                  <div
                    className="chat-last"
                    style={{
                      fontWeight: hasUnread ? '700' : 'normal',
                      color: hasUnread ? '#000' : '#666'
                    }}
                  >
                    {lastMsg}
                  </div>
                </div>
                <div className="chat-time">
                  <div
                    style={{
                      fontWeight: hasUnread ? '600' : 'normal',
                      color: hasUnread ? '#000' : '#666'
                    }}
                  >
                    {lastTime}
                  </div>
                  {/*  Badge للرسائل غير المقروءة */}
                  {hasUnread && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}