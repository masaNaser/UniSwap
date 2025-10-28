
// import { useEffect, useState, useRef } from "react";
// import {
//   sendMessage,
//   getOneConversation,
//   getOldMessages,
//   getNewMessages,
// } from "../../services/chatService";
// import Message from "./Message";
// import MessageInput from "./MessageInput";
// import CircularProgress from "@mui/material/CircularProgress";
// import Box from "@mui/material/Box";
// import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
// import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
// export default function ChatWindow({
//   conversationId,
//   receiverId,
//   receiverName,
//   setConversations,
//   receiverImage,
// }) {
//   const [messages, setMessages] = useState([]);
//   const [loadingOlder, setLoadingOlder] = useState(false);
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const hasMoreRef = useRef(true);
//   const token = localStorage.getItem("accessToken");
//   const currentUserId = localStorage.getItem("userId");
//   const initials = receiverName?.substring(0, 2).toUpperCase(); // لأخذ أول حرفين من اسم المستقبل
 
//   // تمرير تلقائي للرسائل الجديدة
//   const [initialScrollDone, setInitialScrollDone] = useState(false);

//   useEffect(() => {
//     if (!initialScrollDone && messages.length > 0) {
//       // تمرير أول مرة فقط عند الفتح
//       messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
//       setInitialScrollDone(true);
//     }
//   }, [messages, initialScrollDone]);

//   // جلب آخر الرسائل عند فتح المحادثة
//   useEffect(() => {
//     const fetchMessages = async () => {
//       const response = await getOneConversation(
//         conversationId,
//         receiverId,
//         10,
//         token
//       );
//       setMessages(response.data || []);
//     };
//     fetchMessages();
//   }, [conversationId, receiverId,token]);

//   //  جلب الرسائل الجديدة بعد العودة للمحادثة أو بعد فترة
//   useEffect(() => {
//     const fetchNewMessages = async () => {
//       if (messages.length === 0) return;
//       const lastRealMessage = [...messages]
//         .reverse()
//         .find((m) => !m.id.startsWith("temp-"));
//       if (!lastRealMessage) return;
//       const afterId = lastRealMessage.id;
//       try {
//         const response = await getNewMessages(
//           conversationId,
//           afterId,
//           10,
//           token
//         );
//         const newMsgs = response.data || [];
//         if (newMsgs.length > 0) {
//           setMessages((prev) => [
//             ...prev,
//             ...newMsgs.filter((n) => !prev.some((m) => m.id === n.id)),
//           ]);
//         }
//       } catch (err) {
//         console.error("فشل جلب الرسائل الجديدة:", err);
//       }
//     };
//     //(جلب الرسائل الجديدة كل 5 ثواني)
//     const interval = setInterval(fetchNewMessages, 5000);
//     return () => clearInterval(interval);
//   }, [conversationId, messages]);

//   // تحميل الرسائل القديمة عند السحب للأعلى
//   const fetchOlderMessages = async () => {
//     if (loadingOlder || !hasMoreRef.current || messages.length === 0) return;
//     setLoadingOlder(true);

//     const container = messagesContainerRef.current;
//     const scrollHeightBefore = container.scrollHeight;

//     const oldestMessage = messages.find((m) => !m.id.startsWith("temp-"));
//     if (!oldestMessage) {
//       setLoadingOlder(false);
//       return;
//     }

//     try {
//       const response = await getOldMessages(
//         conversationId,
//         oldestMessage.id,
//         10,
//         token
//       );
//       const older = response.data || [];
//       console.log("الرسائل الأقدم:", response);
//       if (response.data.length === 0) hasMoreRef.current = false;
//       else {
//         setMessages((prev) => [
//           ...older.filter((o) => !prev.some((m) => m.id === o.id)),
//           ...prev,
//         ]);
//         setTimeout(() => {
//           container.scrollTop = container.scrollHeight - scrollHeightBefore;
//         }, 0);
//       }
//     } catch (err) {
//       console.error("فشل جلب الرسائل القديمة:", err);
//     } finally {
//       setLoadingOlder(false);
//     }
//   };

//   // مراقبة السحب للأعلى
//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       if (container.scrollTop === 0 && !loadingOlder) fetchOlderMessages();
//     };

//     container.addEventListener("scroll", handleScroll);
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, [messages, loadingOlder]);

//   // إرسال رسالة جديدة
//   const handleSend = async (text, files = []) => {
//     if (!text.trim() && files.length === 0) return;

//     const tempId = `temp-${Date.now()}`;
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: tempId,
//         senderId: currentUserId,
//         receiverId,
//         conversationId,
//         text,
//         content: files.length ? "File" : "Text",
//         filePath: files.length
//           ? files.map((f) => f.preview || f.filePath)[0]
//           : null,
//         createdAt: new Date().toISOString(),
//         status: "pending",
//       },
//     ]);

//     try {
//       const res = await sendMessage(receiverId, text, conversationId, files);
//       setMessages((prev) =>
//         prev.map((m) => (m.id === tempId ? { ...res, status: "delivered" } : m))
//       );
//       // **تحديث ترتيب المحادثات**
//       setConversations((prev) =>
//         prev
//           .map((c) =>
//             c.id === conversationId
//               ? {
//                   ...c,
//                   lastMessage: { text, createdAt: new Date().toISOString() },
//                 } // أو lastMessageTime
//               : c
//           )
//           .sort(
//             (a, b) =>
//               new Date(b.lastMessage?.createdAt) -
//               new Date(a.lastMessage?.createdAt)
//           )
//       );
//     } catch (err) {
//       console.error("فشل إرسال الرسالة:", err);
//     }
//   };
// useEffect(() => {
//   const initChat = async () => {
//     try {
//       // إذا ما في conversationId، حاول تجلب المحادثة
//       if (!conversationId && receiverId) {
//         const response = await getOneConversation(
//           null, // conversationId = null
//           receiverId,
//           20,
//           token
//         );
        
//         // إذا السيرفر رجع محادثة موجودة
//         if (response.data && response.data.conversationId) {
//           setMessages(response.data.messages || []);
//           // ممكن تحدث الـ conversationId هنا إذا بدك
//         } else {
//           // ما في محادثة، المستخدم لازم يكتب أول رسالة
//           setMessages([]);
//         }
//       } else {
//         // في conversationId، اجلب الرسائل عادي
//         const response = await getOneConversation(
//           conversationId,
//           receiverId,
//           20,
//           token
//         );
//         setMessages(response.data.messages || []);
//       }
//     } catch (err) {
//       console.error("فشل جلب المحادثة:", err);
//       setMessages([]);
//     }
//   };

//   initChat();
// }, [conversationId, receiverId]);
//   return (
//     <Box className="chat-window">
//       <Box className="chat-header">
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <Box className="chat-avatar">
//             {receiverImage ? (
//               <img
//                 src={receiverImage}
//                 alt={receiverName}
//                 className="avatar-img"
//               />
//             ) : (
//               <Box className="avatar-fallback">{initials}</Box>
//             )}
//           </Box>
//           <h3 className="chat-name">{receiverName}</h3>
//         </Box>

//         <Box sx={{ display: "flex", gap: "10px" }}>
//           <LocalPhoneOutlinedIcon sx={{ color: "#0078ff" }} />
//           <VideocamOutlinedIcon sx={{ color: "#0078ff" }} />
//         </Box>
//       </Box>
//       <Box className="messages" ref={messagesContainerRef}>
//         <Box sx={{ display: "flex", justifyContent: "center", padding: "8px" }}>
//           {loadingOlder && <CircularProgress size={24} />}
//         </Box>
//         {messages.length === 0 ? (
//           <p className="empty">No messages yet</p>
//         ) : (
//           messages.map((m, i) => (
//             <Message
//               key={m.id || `temp-${i}`}
//               text={m.text}
//               sender={m.senderId === currentUserId ? "me" : "them"}
//               content={m.content}
//               filePath={m.filePath}
//             />
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </Box>
//       <MessageInput onSend={handleSend} />
//     </Box>
//   );
// }


import { useEffect, useState, useRef } from "react";
import {
  sendMessage,
  getOneConversation,
  getOldMessages,
  getNewMessages,
} from "../../services/chatService";
import Message from "./Message";
import MessageInput from "./MessageInput";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";

export default function ChatWindow({
  conversationId,
  receiverId,
  receiverName,
  setConversations,
  receiverImage,
}) {
  const [messages, setMessages] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasMoreRef = useRef(true);
  const token = localStorage.getItem("accessToken");
  const currentUserId = localStorage.getItem("userId");
  const initials = receiverName?.substring(0, 2).toUpperCase();
 
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // تمرير تلقائي للرسائل الجديدة
  useEffect(() => {
    if (!initialScrollDone && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setInitialScrollDone(true);
    }
  }, [messages, initialScrollDone]);

  // 🔥 جلب المحادثة عند الفتح (معدّل)
  useEffect(() => {
    const initChat = async () => {
      try {
         // ⬅️ مهم: نتأكد إن conversationId مش string "null"
        const convId = conversationId === "null" || !conversationId ? null : conversationId;
        const response = await getOneConversation(
           convId,
          receiverId,
          20,
          token
        );
        
        if (response.data) {
          if (Array.isArray(response.data)) {
            setMessages(response.data);
          } else if (response.data.messages) {
            setMessages(response.data.messages);
          } else {
            setMessages([]);
          }
        }
      } catch (err) {
        console.error("فشل جلب المحادثة:", err);
      setMessages([]); // ⬅️ نبدأ محادثة فارغة إذا حصل خطأ
      }
    };

    if (receiverId) {
      initChat();
      setInitialScrollDone(false);
      hasMoreRef.current = true; // reset للمحادثة الجديدة
    }
  }, [conversationId, receiverId, token]);

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
      } catch (err) {
        console.error("فشل جلب الرسائل الجديدة:", err);
      }
    };
    
    const interval = setInterval(fetchNewMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId, messages, token]);

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

  // مراقبة السحب للأعلى
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && !loadingOlder) fetchOlderMessages();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, loadingOlder]);

  // إرسال رسالة جديدة
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
          // ⬅️ نتأكد من conversationId
          const convId = conversationId === "null" || !conversationId ? null : conversationId;
      const res = await sendMessage(receiverId, text, conversationId, files);
         // 🔥 تحديث الرسائل بالرسالة الجديدة
    setMessages((prev) =>
      prev.map((m) => 
        m.id === tempId 
          ? { ...res, status: "delivered" } 
          : m
      ));
        // 🔥 تحديث conversationId إذا كانت محادثة جديدة
    if (!convId && res.conversationId) {
      // نحدث الـ URL state عشان المحادثة تصير معروفة
      window.history.replaceState(
        { 
          convId: res.conversationId,
          receiverId,
          receiverName,
          receiverImage
        },
        ''
      );
    }
      // تحديث ترتيب المحادثات
    setConversations((prev) => {
      const existingConv = prev.find(c => c.id === (res.conversationId || convId));
      
      if (existingConv) {
        // تحديث محادثة موجودة
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
        // إضافة محادثة جديدة
        return [
          {
            id: res.conversationId,
            partnerId: receiverId,
            partnerName: receiverName,
            partnerImage: receiverImage,
            lastMessage: { text, createdAt: new Date().toISOString() },
          },
          ...prev
        ];
      }
    });
  } catch (err) {
    console.error("فشل إرسال الرسالة:", err);
    // تحديث حالة الرسالة لـ failed
    setMessages((prev) =>
      prev.map((m) => 
        m.id === tempId 
          ? { ...m, status: "failed" } 
          : m
      )
    );
  }
  };

  return (
    <Box className="chat-window">
      <Box className="chat-header">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box className="chat-avatar">
            {receiverImage ? (
              <img
                src={receiverImage}
                alt={receiverName}
                className="avatar-img"
              />
            ) : (
              <Box className="avatar-fallback">{initials}</Box>
            )}
          </Box>
          <h3 className="chat-name">{receiverName}</h3>
        </Box>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <LocalPhoneOutlinedIcon sx={{ color: "#0078ff" }} />
          <VideocamOutlinedIcon sx={{ color: "#0078ff" }} />
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