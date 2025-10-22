import React, { useEffect } from "react";
import { getConversations } from "../../services/chatService";

export default function ChatList({
  conversations,
  setConversations,
  onSelectConversation,
}) {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const fetchConversations = async () => {
    try {
      const response = await getConversations(token);
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
    <div className="chat-list">
      <h3 className="chat-list-header">Messages</h3>
      <div className="chat-list-items">
        {conversations.length === 0 ? (
          <p className="empty">There are no messages yet.</p>
        ) : (
          conversations.map((conv) => {
            const lastMsg = conv.lastMessage
              ? conv.lastMessage.content === "Text"
                ? conv.lastMessage.text
                : "File"
              : "";
            const lastTime = conv.lastMessage?.createdAt
              ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
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
