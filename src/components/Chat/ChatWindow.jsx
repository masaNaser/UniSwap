import { useEffect, useState, useRef } from "react";
import {
  sendMessage,
  getOneConversation,
  getOldMessages,
  getNewMessages,
  markMessageAsSeen,
} from "../../services/chatService";
import Message from "./Message";
import MessageInput from "./MessageInput";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { getImageUrl } from "../../utils/imageHelper";
import { useNavigateToProfile } from "../../hooks/useNavigateToProfile";
import { useUnreadCount } from "../../Context/unreadCountContext";
import { useTheme } from "@mui/material/styles";
export default function ChatWindow({
  conversationId,
  receiverId,
  receiverName,
  setConversations,
  receiverImage,
  onBack,
}) {
  const theme = useTheme();
  const navigateToProfile = useNavigateToProfile();
  const { decreaseUnreadCount,refreshUnreadCount } = useUnreadCount();

  const [messages, setMessages] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasMoreRef = useRef(true);
  const token = localStorage.getItem("accessToken");
  const currentUserId = localStorage.getItem("userId");
  const initials = receiverName?.substring(0, 2).toUpperCase();

  const [initialScrollDone, setInitialScrollDone] = useState(false);

  useEffect(() => {
    if (!initialScrollDone && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setInitialScrollDone(true);
    }
  }, [messages, initialScrollDone]);

  // 🔥 جلب المحادثة عند الفتح
useEffect(() => {
  const initChat = async () => {
    try {
      const convId =
        conversationId === "null" || !conversationId ? null : conversationId;
      
      const response = await getOneConversation(
        convId,
        receiverId,
        6,
        token
      );

      if (response.data) {
        let loadedMessages = [];
        
        if (Array.isArray(response.data)) {
          loadedMessages = response.data;
          setMessages(response.data);
        } else if (response.data.messages) {
          loadedMessages = response.data.messages;
          setMessages(response.data.messages);
        } else {
          setMessages([]);
        }

        const unreadMessagesCount = loadedMessages.filter(
          m => m.receiverId === currentUserId && m.status === "Delivered"
        ).length;

        console.log(`📬 Found ${unreadMessagesCount} unread messages in conversation`);

        // ✅ الشرط المهم: استدعي mark as seen بس إذا في conversationId حقيقي
        if (convId && convId !== "null" && unreadMessagesCount > 0) {
          setTimeout(async () => {
            try {
              await markMessageAsSeen(convId,token);
              console.log("✅ Marked conversation as seen:", convId);
              
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === convId ? { ...c, unreadCount: 0 } : c
                )
              );

              decreaseUnreadCount(unreadMessagesCount);

            } catch (error) {
              console.error("❌ Failed to mark as seen:", error);
            }
          }, 300);
        } else {
          console.log("⚠️ Skipping mark as seen - no valid conversationId or no unread messages");
        }
      }
    } catch (err) {
      console.error("فشل جلب المحادثة:", err);
      setMessages([]);
    }
  };

  if (receiverId) {
    initChat();
    setInitialScrollDone(false);
    hasMoreRef.current = true;
  }
}, [conversationId, receiverId, token, setConversations, decreaseUnreadCount, currentUserId]);

  // جلب الرسائل الجديدة دوريًا
  useEffect(() => {
    const fetchNewMessages = async () => {
      if (messages.length === 0) return;
      const lastRealMessage = [...messages]
        .reverse()
        .find((m) => !m.id.startsWith("temp-"));
      if (!lastRealMessage) return;

      const afterId = lastRealMessage.id;
      try {
        const response = await getNewMessages(
          conversationId,
          afterId,
          10,
          token
        );
        const newMsgs = response.data || [];
        if (newMsgs.length > 0) {
          setMessages((prev) => [
            ...prev,
            ...newMsgs.filter((n) => !prev.some((m) => m.id === n.id)),
          ]);
        }
         // ✅ حدّث عداد الرسائل غير المقروءة في الـ Navbar
          refreshUnreadCount();
          console.log("✅ New messages received, refreshing unread count");
      } catch (err) {
        console.error("فشل جلب الرسائل الجديدة:", err);
      }
    };

    const interval = setInterval(fetchNewMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId, messages, token, refreshUnreadCount]);

  // تحميل الرسائل القديمة عند السحب للأعلى
  const fetchOlderMessages = async () => {
    if (loadingOlder || !hasMoreRef.current || messages.length === 0) return;
    setLoadingOlder(true);

    const container = messagesContainerRef.current;
    const scrollHeightBefore = container.scrollHeight;

    const oldestMessage = messages.find((m) => !m.id.startsWith("temp-"));
    if (!oldestMessage) {
      setLoadingOlder(false);
      return;
    }

    try {
      const response = await getOldMessages(
        conversationId,
        oldestMessage.id,
        10,
        token
      );
      const older = response.data || [];

      if (older.length === 0) {
        hasMoreRef.current = false;
      } else {
        setMessages((prev) => [
          ...older.filter((o) => !prev.some((m) => m.id === o.id)),
          ...prev,
        ]);
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - scrollHeightBefore;
        }, 0);
      }
    } catch (err) {
      console.error("فشل جلب الرسائل القديمة:", err);
    } finally {
      setLoadingOlder(false);
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && !loadingOlder) fetchOlderMessages();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, loadingOlder]);

  const handleSend = async (text, files = []) => {
    if (!text.trim() && files.length === 0) return;

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: currentUserId,
        receiverId,
        conversationId,
        text,
        content: files.length ? "File" : "Text",
        filePath: files.length
          ? files.map((f) => f.preview || f.filePath)[0]
          : null,
        createdAt: new Date().toISOString(),
        status: "pending",
      },
    ]);

    try {
      const convId =
        conversationId === "null" || !conversationId ? null : conversationId;
      const res = await sendMessage(receiverId, text, conversationId, files);
      
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...res, status: "delivered" } : m))
      );
      
      if (!convId && res.conversationId) {
        window.history.replaceState(
          {
            convId: res.conversationId,
            receiverId,
            receiverName,
            receiverImage,
          },
          ""
        );
      }
      
      setConversations((prev) => {
        const existingConv = prev.find(
          (c) => c.id === (res.conversationId || convId)
        );

        if (existingConv) {
          return prev
            .map((c) =>
              c.id === existingConv.id
                ? {
                    ...c,
                    lastMessage: { text, createdAt: new Date().toISOString() },
                  }
                : c
            )
            .sort(
              (a, b) =>
                new Date(b.lastMessage?.createdAt) -
                new Date(a.lastMessage?.createdAt)
            );
        } else {
          return [
            {
              id: res.conversationId,
              partnerId: receiverId,
              partnerName: receiverName,
              partnerImage: receiverImage,
              lastMessage: { text, createdAt: new Date().toISOString() },
              unreadCount: 0,
            },
            ...prev,
          ];
        }
      });
    } catch (err) {
      console.error("فشل إرسال الرسالة:", err);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
      );
    }
  };

  return (
    <Box className="chat-window">
      <Box className="chat-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            ← Back
          </button>
        )}

        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => {
            navigateToProfile(receiverId);
          }}
        >
          <Box className="chat-avatar">
            {receiverImage ? (
              <img
                src={getImageUrl(receiverImage, receiverName)}
                alt={receiverName}
                className="avatar-img"
              />
            ) : (
              <Box className="avatar-fallback">{initials}</Box>
            )}
          </Box>
          <h3 className="chat-name">{receiverName}</h3>
        </Box>
      </Box>

      <Box className="messages" ref={messagesContainerRef}>
        <Box sx={{ display: "flex", justifyContent: "center", padding: "8px" }}>
          {loadingOlder && <CircularProgress size={24} />}
        </Box>
        {messages.length === 0 ? (
          <p className="empty">No messages yet</p>
        ) : (
          messages.map((m, i) => (
            <Message
              key={m.id || `temp-${i}`}
              text={m.text}
              sender={m.senderId === currentUserId ? "me" : "them"}
              content={m.content}
              filePath={m.filePath}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      <MessageInput onSend={handleSend} />
    </Box>
  );
}