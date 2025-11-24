import React, { useEffect } from "react";
import { getConversations, markMessageAsSeen } from "../../services/chatService";
import { getImageUrl } from "../../utils/imageHelper";
import { useUnreadCount } from "../../Context/unreadCountContext";

export default function ChatList({
  conversations,
  setConversations,
  onSelectConversation,
  className = "",
}) {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  
  // ✅ استخدم الـ Context
  const { decreaseUnreadCount } = useUnreadCount();

  const fetchConversations = async () => {
    try {
      const response = await getConversations(token);
      console.log("المحادثات المستلمة:", response.data);
      
      const convsWithNames = response.data.map((conv) => {
        const partnerId = conv.receiverId;
        const partnerName = conv.receiverName;
        const partnerImage = conv.receiverImage;
        
        return { 
          ...conv, 
          partnerId, 
          partnerName, 
          partnerImage,
          unreadCount: conv.unreadCount || 0 // ✅ تأكد من وجود unreadCount
        };
      });

      const sorted = convsWithNames.sort(
        (a, b) =>
          new Date(b.lastMessage?.createdAt || 0) -
          new Date(a.lastMessage?.createdAt || 0)
      );

      setConversations(sorted);
    } catch (err) {
      console.error("فشل في جلب المحادثات:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleConversationClick = async (
    convId,
    partnerId,
    partnerName,
    partnerImage
  ) => {
    // ✅ جيب عدد الرسائل غير المقروءة لهاي المحادثة
    const conv = conversations.find(c => c.id === convId);
    const conversationUnreadCount = conv?.unreadCount || 0;

    console.log(`📬 Opening conversation ${convId} with ${conversationUnreadCount} unread messages`);

    // ✅ فتح المحادثة
    onSelectConversation(convId, partnerId, partnerName, partnerImage);

    // ✅ وضع علامة "تم القراءة"
    if (convId && conversationUnreadCount > 0) {
      try {
        await markMessageAsSeen(token, convId);
        console.log("✅ Marked conversation as seen:", convId);

        // ✅ حدّث قائمة المحادثات محلياً
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, unreadCount: 0 }
              : c
          )
        );

        // ✅ قلل العداد في الـ Navbar
        decreaseUnreadCount(conversationUnreadCount);

      } catch (error) {
        console.error("❌ Failed to mark as seen:", error);
      }
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
              ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            const lastDate = conv.lastMessage?.createdAt
              ? (() => {
                  const msgDate = new Date(conv.lastMessage.createdAt);
                  const today = new Date();
                  const isToday =
                    msgDate.getDate() === today.getDate() &&
                    msgDate.getMonth() === today.getMonth() &&
                    msgDate.getFullYear() === today.getFullYear();
                  return isToday
                    ? "Today"
                    : msgDate.toLocaleDateString("en-GB");
                })()
              : "";

            const initials = conv.partnerName?.substring(0, 2).toUpperCase();
            
            // ✅ هل في رسائل جديدة؟
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
                <div className="chat-avatar">
                  {conv.partnerImage ? (
                    <img
                      src={getImageUrl(conv.partnerImage, conv.partnerName)}
                      alt={conv.partnerName}
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-fallback">{initials}</div>
                  )}
                </div>
                <div className="chat-info">
                  <div className="chat-name">{conv.partnerName}</div>
                  {/* ✅ لو في رسائل جديدة، خلي النص bold */}
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
                  <div className="chat-date">{lastDate}</div>
                  
                  {/* ✅ Badge للرسائل غير المقروءة */}
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