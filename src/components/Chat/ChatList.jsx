import React, { useEffect } from "react";
import { getConversations } from "../../services/chatService";
import { getImageUrl } from "../../utils/imageHelper";

export default function ChatList({
  conversations,
  setConversations,
  onSelectConversation,
  className = "",
}) {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const fetchConversations = async () => {
    try {
      const response = await getConversations(token);
      console.log("المحادثات المستلمة:", response.data);
      const convsWithNames = response.data.map((conv) => {
        const partnerId =
          conv.senderId === userId ? conv.receiverId : conv.senderId;
        const partnerName =
          conv.senderId === userId ? conv.receiverName : conv.senderName;
        const partnerImage =
          conv.senderId === userId ? conv.receiverImage : conv.senderImage;
        return { ...conv, partnerId, partnerName, partnerImage };
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

            // ✅ اعرض "Today" إذا نفس اليوم، وإلا اعرض التاريخ
            const lastDate = conv.lastMessage?.createdAt // إذا في رسالة أخيرة
              ? (() => {
                  //   تاريخ الرسالة
                  const msgDate = new Date(conv.lastMessage.createdAt);

                  //   تاريخ اليوم
                  const today = new Date();

                  // هل الرسالة نفس اليوم؟
                  const isToday =
                    msgDate.getDate() === today.getDate() && // نفس اليوم من الشهر؟ (1-31)
                    msgDate.getMonth() === today.getMonth() && // نفس الشهر؟ (0-11)
                    msgDate.getFullYear() === today.getFullYear(); // نفس السنة؟

                  //  إذا اليوم → "Today"، إذا لا → التاريخ
                  return isToday
                    ? "Today"
                    : msgDate.toLocaleDateString("en-GB"); // ✅ هون استخدم en-GB
                })()
              : "";
            // أول حرفين من اسم الطرف الآخر
            const initials = conv.partnerName?.substring(0, 2).toUpperCase();

            return (
              <div
                key={conv.id}
                className="chat-item"
                onClick={() =>
                  onSelectConversation(
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
                  <div className="chat-last">{lastMsg}</div>
                </div>
                <div className="chat-time">
                  <div>{lastTime}</div>
                  <div className="chat-date">
                    {lastDate} {/* ✅ التاريخ */}
                  </div>
                  
                </div>{" "}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
