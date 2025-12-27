import { useEffect, useState, useRef, useCallback } from "react";
import {
  sendMessage,
  getOneConversation,
  getOldMessages,
  getNewMessages,
  markMessageAsSeen,
} from "../../services/chatService";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { Avatar, Box, CircularProgress } from "@mui/material";
import { getImageUrl } from "../../utils/imageHelper";
import { useNavigateToProfile } from "../../hooks/useNavigateToProfile";
import { useUnreadCount } from "../../Context/unreadCountContext";
import { useTheme } from "@mui/material/styles";
// import { useUnreadCount } from "../../Context/unreadCountContext";
import { getToken, getUserId } from "../../utils/authHelpers";
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
  const { decreaseUnreadCount, refreshUnreadCount } = useUnreadCount();
  const { connection } = useUnreadCount();

  const [messages, setMessages] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasMoreRef = useRef(true);
  // const token = localStorage.getItem("accessToken");
  const token = getToken();
  const currentUserId = getUserId();
  const initials = receiverName?.substring(0, 2).toUpperCase();

  const [initialScrollDone, setInitialScrollDone] = useState(false);

  useEffect(() => {
    if (!initialScrollDone && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setInitialScrollDone(true);
    }
  }, [messages, initialScrollDone]);

  // 🔥 جلب المحادثة عند الفتح
  // ... (داخل المكون ChatWindow)

  // 1. تعريف دالة جلب البيانات بـ useCallback لحمايتها من التكرار
  const initChat = useCallback(async () => {
    if (!receiverId) return;
    try {
      const convId = (!conversationId || conversationId === "null") ? null : conversationId;
      const response = await getOneConversation(convId, receiverId, 10, token);

      if (response.data) {
        const loadedMessages = Array.isArray(response.data) ? response.data : (response.data.messages || []);
        setMessages(loadedMessages);

        const unreadCount = loadedMessages.filter(
          m => m.receiverId === currentUserId && m.status === "Delivered"
        ).length;

        if (convId && unreadCount > 0) {
          await markMessageAsSeen(convId, token);
          setConversations(prev => prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c));
          decreaseUnreadCount(unreadCount);
        }
      }
    } catch (err) {
      console.error("فشل جلب المحادثة:", err);
    }
  }, [conversationId, receiverId, token]); // التبعيات الصحيحة

  // 2. تشغيل الدالة عند تغيير المحادثة فقط
  useEffect(() => {
    initChat();
  }, [initChat]);

  // جلب الرسائل الجديدة دوريًا
  // داخل ChatWindow
  const fetchNewMessageRealTime = useCallback((message) => {
    if (message.conversationId === conversationId) {
      setMessages((prev) => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      // إذا كانت المحادثة مفتوحة، أخبر الباك إند أنها قُرئت
      markMessageAsSeen(conversationId, token);
    }
  }, [conversationId, token]);

  // useEffect(() => {
  //   if (connection) {
  //     connection.on("ReceiveMessage", fetchNewMessageRealTime);
  //   }
  //   return () => {
  //     if (connection) connection.off("ReceiveMessage");
  //   };
  // }, [connection, fetchNewMessageRealTime]);
  useEffect(() => {
  const onNewMessage = (event) => {
    const message = event.detail;
    if (message.conversationId === conversationId) {
      setMessages((prev) => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });

      markMessageAsSeen(conversationId, token);
      decreaseUnreadCount(1); // ينقص عداد الـ Navbar فوراً
    }
  };

  window.addEventListener("NEW_SIGNALR_MESSAGE", onNewMessage);
  return () => window.removeEventListener("NEW_SIGNALR_MESSAGE", onNewMessage);
}, [conversationId, token, decreaseUnreadCount]);

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
          <Avatar
            src={getImageUrl(receiverImage, receiverName)}
            alt={receiverName}
            sx={{
              width: 45,
              height: 45,
              marginRight: '12px'
            }}
          >
            {receiverName?.substring(0, 2).toUpperCase()}
          </Avatar>
          <h3 className="chat-name">{receiverName}</h3>
        </Box>
      </Box>

      <Box className="messages" ref={messagesContainerRef}>
        <Box sx={{ display: "flex", justifyContent: "center", padding: "8px" }}>
          {loadingOlder && <CircularProgress size={24} />}
        </Box>
        {messages.length === 0 ? (
          <p className="empty"></p>
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