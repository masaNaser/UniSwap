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
  const token = getToken();
  const currentUserId = getUserId();
  const initials = receiverName?.substring(0, 2).toUpperCase();

  const [initialScrollDone, setInitialScrollDone] = useState(false);
  const isLoadingOlderRef = useRef(false); // تتبع حالة تحميل الرسائل القديمة

  // دالة للتمرير للأسفل 
  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // التمرير الأولي عند تحميل المحادثة
  useEffect(() => {
    if (!initialScrollDone && messages.length > 0 && !isLoadingOlderRef.current) {
      scrollToBottom("auto"); // تمرير فوري عند الفتح
      setInitialScrollDone(true);
    }
  }, [messages, initialScrollDone, scrollToBottom]);

  // التمرير عند إضافة رسائل جديدة (ليس عند تحميل القديمة)
  useEffect(() => {
    if (initialScrollDone && !isLoadingOlderRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom("smooth");
      }, 100);
    }
  }, [messages.length, initialScrollDone, scrollToBottom]);

  // جلب المحادثة عند الفتح
  const initChat = useCallback(async () => {
    if (!receiverId) return;
    setInitialScrollDone(false); // إعادة تعيين عند فتح محادثة جديدة

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
  }, [conversationId, receiverId, token, currentUserId, decreaseUnreadCount, setConversations]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  // استقبال الرسائل الجديدة من SignalR
  useEffect(() => {
    const onNewMessage = (event) => {
      const message = event.detail;
      if (message.conversationId === conversationId) {
        setMessages((prev) => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message]; // رسالة جديدة = تمرير تلقائي
        });

        markMessageAsSeen(conversationId, token);
        decreaseUnreadCount(1);
      }
    };

    window.addEventListener("NEW_SIGNALR_MESSAGE", onNewMessage);
    return () => window.removeEventListener("NEW_SIGNALR_MESSAGE", onNewMessage);
  }, [conversationId, token, decreaseUnreadCount]);

  // تحميل الرسائل القديمة عند السحب للأعلى
  const fetchOlderMessages = async () => {
    if (loadingOlder || !hasMoreRef.current || messages.length === 0) return;

    isLoadingOlderRef.current = true;
    setLoadingOlder(true);

    const container = messagesContainerRef.current;
    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop; // حفظ موضع السكرول

    const oldestMessage = messages.find((m) => !m.id.startsWith("temp-"));
    if (!oldestMessage) {
      setLoadingOlder(false);
      isLoadingOlderRef.current = false;
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

        // الحفاظ على موضع السكرول بعد إضافة الرسائل القديمة
        setTimeout(() => {
          const scrollHeightAfter = container.scrollHeight;
          container.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
        }, 0);
      }
    } catch (err) {
      console.error("فشل جلب الرسائل القديمة:", err);
    } finally {
      setLoadingOlder(false);
      isLoadingOlderRef.current = false; 
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
    const newMessage = {
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
    };

    setMessages((prev) => [...prev, newMessage]); // رسالة جديدة = تمرير تلقائي

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
            ←
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