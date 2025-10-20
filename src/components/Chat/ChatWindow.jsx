// import React, { useEffect, useState, useRef } from "react";
// import {
//   createChatHubConnection,
//   sendMessage,
//   getOneConversation,
//   getOldMessages,
// } from "../../services/chatService";
// import Message from "./Message";
// import MessageInput from "./MessageInput";
// import Box from "@mui/material/Box";
// import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
// import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
// import CircularProgress from "@mui/material/CircularProgress";

// export default function ChatWindow({
//   conversationId,
//   receiverId,
//   receiverName,
// }) {
//   const [connection, setConnection] = useState(null);
//   //عملنا ستيت عشان نخزن الرسائل
//   const [messages, setMessages] = useState([]);
//   const token = localStorage.getItem("accessToken");
//   const currentUserId = localStorage.getItem("userId");
//   const messagesEndRef = useRef(null);
//   const connectionRef = useRef(null);
// const [loadingOlder, setLoadingOlder] = useState(false);

//   //يشتغل عند تغيير 
//   // messages
//   //يقوم بالتمريرإلى
//   // messagesEndRef
//   // ليبقي العرض عند أخر رسالة
//   //باختصار انه كل  ما تنضاف رسالة جديدة رح تشتغل هاي اليوز
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // إنشاء اتصال SignalR وإدارة الرسائل
//   useEffect(() => {
//     const conn = createChatHubConnection(token);
//     //حفظنا الاتصال بمتغير ثابت عشان لما يصير ريندر يكون التصال محفوظ
//     connectionRef.current = conn;

// // تشتغل كل مرة توصل رسالة جديدة من السيرفر
//     const handleReceiveMessage = (msg) => {
//       if (msg.conversationId === conversationId) {
//         //هون بنحدث قائمة الرسائل
//         setMessages((prev) => {
//           //  بنتاكد اول  إذا الرسالة الجديدة مكرّرة 
//           // (يعني وصلت قبل بنفس الـ id).
//           if (prev.some((m) => m.id === msg.id)) return prev;

//           // استبدال الرسائل المؤقتة (المرسلة قبل التسليم)
//           const tempIndex = prev.findIndex(
//             (m) =>
//               m.id.toString().startsWith("temp-") &&
//               (m.text) === (msg.text) &&
//               m.senderId === msg.senderId
//           );
        

// // إذا لقينا رسالة مؤقتة مناسبة،


//           if (tempIndex !== -1) {
//             const newMessages = [...prev];
//             //يبدل الرسالة المؤقتة (id مؤقت) بالرسالة الحقيقية من السيرفر (id حقيقي).++
//           //  بنحدث حالتها لـ "تم التسليم" 
//             newMessages[tempIndex] = { ...msg, status: "delivered" };

//             //يرتّب كل الرسائل حسب وقت الإنشاء، عشان تظهر بالترتيب الصحيح.
//             return newMessages.sort(
//               (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//             );
//           }

//           return [...prev, msg].sort(
//             (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//           );
//         });
//       }
//     };
  
//     const init = async () => {
//       //بدون هذا السطر، لن نستقبل أي رسائل من السيرفر.
//       await conn.start();
//       setConnection(conn);

//       // إزالة أي اشتراك سابق لتجنب التكرار
//       conn.off("ReceiveMessage");
//       conn.on("ReceiveMessage", handleReceiveMessage);

//       const data = await getOneConversation(
//         conversationId,
//         receiverId,
//         10,
//         token
//       );
//       //يعرض الرسائل المجلوبة في الواجهة.
//       //إذا لم تعد أي رسالة (null) →
//       //  يعرض مصفوفة فارغة [].
//       setMessages(data || []);
//     };

//     init();

//     return () => {
//       if (connectionRef.current) {
//         connectionRef.current.off("ReceiveMessage");
//         connectionRef.current.stop();
//       }
//     };
//   }, [conversationId, receiverId, token]);

//   // إرسال رسالة جديدة
//   const handleSend = async (text) => {
//     if (!connection || !text.trim()) return;
//   // إنشاء اي دي مؤقت للرسالة
//     const tempId = `temp-${Date.now()}`;
//     // عرض الرسالة مؤقتًا فورًا في الواجهة
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: tempId,
//         senderId: currentUserId,
//         receiverId,
//         conversationId,
//         text,
//         createdAt: new Date().toISOString(),
//         status: "pending",
//       },
//     ]);

//     try {
//       await sendMessage(connection, receiverId, text, conversationId);
//     } catch (err) {
//       console.error(" فشل إرسال الرسالة:", err);
//     }
//   };


//   const loadOlderMessages = async () => {
//   if (messages.length === 0) return;
//   const firstMsgId = messages[0].id;

//   try {
//     setLoadingOlder(true);
//     const res = await getOldMessages(conversationId, firstMsgId, 10, token);
//     const older = res.data || [];

//     // دمج الرسائل القديمة مع الجديدة بدون تكرار
//     setMessages((prev) => [
//       ...older.filter((o) => !prev.some((m) => m.id === o.id)),
//       ...prev,
//     ]);
//   } catch (err) {
//     console.error("خطأ أثناء تحميل الرسائل القديمة:", err);
//   } finally {
//     setLoadingOlder(false);
//   }
// };
// useEffect(() => {
//   const container = document.querySelector(".messages");
//   const handleScroll = () => {
//     if (container.scrollTop === 0 && !loadingOlder) {
//       loadOlderMessages();
//     }
//   };
//   container.addEventListener("scroll", handleScroll);
//   return () => container.removeEventListener("scroll", handleScroll);
// }, [messages, loadingOlder]);

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <h3>{receiverName}</h3>
//         <Box sx={{ display: "flex", gap: "10px" }}>
//           <LocalPhoneOutlinedIcon sx={{ color: "#0078ff" }} />
//           <VideocamOutlinedIcon sx={{ color: "#0078ff" }} />
//         </Box>
//       </div>

//       <div className="messages">
//        {loadingOlder && (
//     <div style={{ display: "flex", justifyContent: "center", padding: "8px" }}>
//       <CircularProgress size={24} />
//     </div>
//   )}

//   {messages.length === 0 ? (
//     <p className="empty">There are no messages yet.</p>
//   ) : (
//     messages.map((m, i) => (
//       <Message
//         key={m.id || i}
//         text={m.text}
//         sender={m.senderId === currentUserId ? "me" : "them"}
//       />
//     ))
//   )}
//         {/*هاد الديف محطوط بالاخر قصدا عشان احنا حاطين باليوز ايفيكت انه يعمل سكرول خفيف وتلقائي لاخر رسالة مرسلة */ }
//         <div ref={messagesEndRef} />
//       </div>

//       <MessageInput onSend={handleSend} />
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import {
  createChatHubConnection,
  sendMessage,
  getOneConversation,
  getOldMessages
} from "../../services/chatService";
import Message from "./Message";
import MessageInput from "./MessageInput";
import Box from "@mui/material/Box";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CircularProgress from "@mui/material/CircularProgress";

export default function ChatWindow({ conversationId, receiverId, receiverName }) {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const token = localStorage.getItem("accessToken");
  const currentUserId = localStorage.getItem("userId");

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const connectionRef = useRef(null);
  const hasMoreRef = useRef(true);

  // تمرير تلقائي عند الرسائل الجديدة فقط
  useEffect(() => {
    if (messages.length === 0) return;
    // const lastMessage = messages[messages.length - 1];
    // // scroll إذا كانت رسالة جديدة أو مرسلة من المستخدم الحالي
    // if (lastMessage.senderId === currentUserId || lastMessage.isNew) {
    //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }
  }, [messages]);

  // إنشاء اتصال SignalR وإدارة الرسائل
  useEffect(() => {
    const conn = createChatHubConnection(token);
    connectionRef.current = conn;

    const handleReceiveMessage = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;

          const tempIndex = prev.findIndex(
            (m) =>
              m.id.toString().startsWith("temp-") &&
              m.text === msg.text &&
              m.senderId === msg.senderId
          );

          if (tempIndex !== -1) {
            const newMessages = [...prev];
            newMessages[tempIndex] = { ...msg, status: "delivered" };
            return newMessages.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
          }

          return [...prev, { ...msg, isNew: true }].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        });
      }
    };

    const init = async () => {
      await conn.start();
      setConnection(conn);

      conn.off("ReceiveMessage");
      conn.on("ReceiveMessage", handleReceiveMessage);

      const data = await getOneConversation(conversationId, receiverId, 7, token);
      setMessages(data || []);
    };

    init();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.off("ReceiveMessage");
        connectionRef.current.stop();
      }
    };
  }, [conversationId, receiverId, token]);

  // تحميل الرسائل القديمة
  const fetchOlderMessages = async () => {
    if (loadingOlder || !hasMoreRef.current || messages.length === 0) return;
    setLoadingOlder(true);
    console.log("جلب رسائل أقدم...",messages);
    const container = messagesContainerRef.current;
    const scrollHeightBefore = container.scrollHeight;

    const oldestMessage = messages.find(m => !m.id.startsWith("temp-"));
    if (!oldestMessage) return;
    const beforeId = oldestMessage.id;
 console.log("أقدم رسالة ID:", beforeId);
    try {
      const res = await getOldMessages(conversationId, beforeId, 7);
      const olderMessages = res.data || [];

      if (olderMessages.length === 0) {
        hasMoreRef.current = false;
      } else {
        setMessages((prev) => [...olderMessages, ...prev]);
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - scrollHeightBefore;
        }, 0);
      }
    } catch (err) {
      console.error("فشل في جلب الرسائل القديمة:", err);
    } finally {
      setLoadingOlder(false);
    }
  };

  // مراقبة السحب للأعلى
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && !loadingOlder) {
        fetchOlderMessages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages, loadingOlder]);

  // إرسال رسالة جديدة
const handleSend = async (text, files = []) => {
  const tempId = `temp-${Date.now()}`;
  setMessages(prev => [
    ...prev,
    {
      id: tempId,
      senderId: currentUserId,
      receiverId,
      conversationId,
      text,
      createdAt: new Date().toISOString(),
      status: "pending",
      isNew: true,
      files
    }
  ]);

  try {
    await sendMessage(connection, receiverId, text, conversationId, files);
  } catch (err) {
    console.error("فشل إرسال الرسالة:", err);
  }
};


  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{receiverName}</h3>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <LocalPhoneOutlinedIcon sx={{ color: "#0078ff" }} />
          <VideocamOutlinedIcon sx={{ color: "#0078ff" }} />
        </Box>
      </div>

      <div className="messages" ref={messagesContainerRef}>
        {loadingOlder && (
          <div className="loading-older" style={{ textAlign: "center", padding: "10px" }}>
            <CircularProgress size={24} />
          </div>
        )}

        {messages.length === 0 ? (
          <p className="empty">There are no messages yet.</p>
        ) : (
          messages.map((m, i) => (
        <Message
  key={m.id || i}
  text={m.text}
  sender={m.senderId === currentUserId ? "me" : "them"}
  content={m.content}
  filePath={m.filePath}
  style={{
    backgroundColor: m.isNew ? "#2e2e2e" : "transparent", // لون غامق للرسالة الجديدة
    transition: "background-color 0.5s",
  }}
/>

          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSend} />
    </div>
  );
}
