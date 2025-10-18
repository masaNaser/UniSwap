import React, { useEffect, useState } from "react";
import { getConversations } from "../../services/chatService";

export default function ChatList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const fetchConversations = async () => {
    try {
      const data = await getConversations(token);

      // تحديد الطرف الآخر واسم افتراضي
      //بنمشي ب ارري ع المحادثات 
      const convsWithNames = data.map((conv) => {
        const partnerId = conv.senderId === userId ? conv.receiverId : conv.senderId;
        const partnerImage = conv.partnerImage || null; // مؤقت
        const partnerName = "مستخدم"; // اسم افتراضي
        //...conv = نسخ كل الحقول الأصلية للمحادثة
        // وبعدين نضيف الحقول الجديدة partnerId و partnerName
        return { ...conv, partnerId, partnerName,partnerImage };
      });

      setConversations(convsWithNames);
    } catch (err) {
      console.error("❌ فشل في جلب المحادثات:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="chat-list">
      <h3 className="chat-list-header">Messages</h3>
      <div className="chat-list-items">
        {conversations.length === 0 ? (
          <p className="empty">There are no messages yet.</p>
        ) : (
          conversations.map((conv) => {
            const lastMsg = conv.lastMessage?.text || "Without messages";
            const lastTime = conv.lastMessage?.createdAt
              ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";
 // استخراج أول حرفين من الاسم
            const initials = conv.partnerName?.substring(0, 2).toUpperCase();
            return (
              <div
                key={conv.id}
                className="chat-item"
                // لما المستخدم يضغط على محادثة، ننادي الدالة onSelectConversation اللي جت من الـ ChatPage
                //عند الضغط على المحادثة → ChatPage يعرف أي محادثة مفتوحة ويعرض الرسائل في ChatWindow
                onClick={() =>
                  onSelectConversation(conv.id, conv.partnerId, conv.partnerName,conv.partnerName)
                }
              >     <div className="chat-avatar">
                  {conv.partnerImage ? (
                    <img
                      src={conv.partnerImage}
                      alt={conv.partnerName}
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-fallback">{initials}</div>
                  )}
                </div>

                <div className="chat-info">
                  <div className="chat-name">{conv.partnerName}</div>
                  <div className="chat-last">{lastMsg}</div>
                </div>
                <div className="chat-time">{lastTime}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
