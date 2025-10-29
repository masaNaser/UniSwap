// import React, { useEffect, useState, useRef } from "react";
// import { createChatHubConnection, sendMessage ,getOneConversation} from "../../services/chatService";

// const Chat = () => {
//   const [connection, setConnection] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
  
//   const conversationId = "73400fe0-e20a-4de4-bff9-93a3202f5c69"; 
//   const receiverId = "6c9e0224-1b33-4db1-07a3-08de0a7e6f3e"; 
//   const token = localStorage.getItem("accessToken");
//   const currentUserId = localStorage.getItem("userId"); 

//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     const initChat = async () => {
//       try {
//         const conn = createChatHubConnection(token);
//         setConnection(conn);
//         await conn.start();
//         console.log("✅ متصل بالـ SignalR");
  
//         // منع التكرار: تحقق من الرسائل المؤقتة والـ id
//         conn.on("ReceiveMessage", (msg) => {
//           setMessages(prev => {
//             // تجاهل أي رسالة موجودة مسبقًا
//             if (prev.some(m => m.id === msg.id)) return prev;

//             // تحقق من وجود رسالة مؤقتة تطابق النص والمرسل
//             const tempIndex = prev.findIndex(
//               m => m.id.toString().startsWith("temp-") &&
//                    (m.Text || m.text) === (msg.Text || msg.text) &&
//                    m.senderId === msg.senderId
//             );

//             if (tempIndex !== -1) {
//               const newMessages = [...prev];
//               newMessages[tempIndex] = { ...msg, status: "delivered" };
//               return newMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//             }

//             return [...prev, msg].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//           });
//         });

//         // جلب الرسائل القديمة
//         const response = await getOneConversation(conversationId, receiverId, 10, token);
//         setMessages(response.data || []);
//       } catch (err) {
//         console.error(" خطأ في تهيئة الشات:", err);
//       }
//     };

//     initChat();

//     return () => {
//       connection?.off("ReceiveMessage");
//       connection?.stop();
//     };
//   }, [token, currentUserId]);

//   useEffect(scrollToBottom, [messages]);

//   const handleSend = async () => {
//     if (!message.trim() || !connection) return;

//     const tempId = `temp-${Date.now()}`;
//     const msgDto = {
//       ReceiverId: receiverId,
//       ConversationId: conversationId,
//       Text: message,
//     };

//     // عرض الرسالة مباشرة
//     setMessages(prev => [
//       ...prev,
//       {
//         ...msgDto,
//         senderId: currentUserId,
//         receiverId,
//         id: tempId,
//         filePath: null,
//         createdAt: new Date().toISOString(),
//       }
//     ]);
//     setMessage("");
//     scrollToBottom();

//     try {
//       await sendMessage(connection, receiverId, message, conversationId);
//     } catch (err) {
//       console.error("❌ فشل إرسال الرسالة:", err);
//     }
//   };

//   return (
//     <></>
//     // <div style={{ border: "1px solid #ccc", padding: "10px", maxWidth: "400px" }}>
//     //   <h3>💬 شات تجريبي</h3>

//     //   <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #eee", padding: "5px", marginBottom: "10px" }}>
//     //     {messages.length === 0 ? (
//     //       <p style={{ textAlign: "center", color: "#777" }}>لا توجد رسائل بعد</p>
//     //     ) : (
//     //       messages.map((m, i) => (
//     //         <div key={m.id || i} style={{ marginBottom: "8px", textAlign: m.senderId === currentUserId ? "right" : "left" }}>
//     //           <strong>{m.senderId === currentUserId ? "أنت" : "آية"}:</strong>{" "}
//     //           {m.text || m.Text || (m.filePath ? "📎 ملف مرفق" : "")}
//     //         </div>
//     //       ))
//     //     )}
//     //     <div ref={messagesEndRef} />
//     //   </div>

//     //   <div style={{ display: "flex", gap: "5px" }}>
//     //     <input
//     //       value={message}
//     //       onChange={(e) => setMessage(e.target.value)}
//     //       placeholder="اكتب رسالة..."
//     //       style={{ flex: 1, padding: "6px" }}
//     //       onKeyDown={(e) => e.key === "Enter" && handleSend()}
//     //     />
//     //     <button onClick={handleSend} style={{ padding: "6px 12px" }}>إرسال</button>
//     //   </div>
//     // </div>
//   );
// };

// export default Chat;