import React, { useEffect, useState } from "react";
import {
  createChatHubConnection,
  getOneConversation,
  sendMessage,
} from "../../services/chatService";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
const [conversationId, setConversationId] = useState("56a67043-4dbb-43d4-b964-01a948bc5cef");
  
  // ReceiverId ثابت لتجربة الشات (آية)
  const [receiverId] = useState("e87a5665-057a-4ee5-ae88-ea85e603312f"); 

  const token = localStorage.getItem("accessToken");

  // 1️⃣ إنشاء اتصال SignalR Hub عند تحميل الصفحة
  useEffect(() => {
    const conn = createChatHubConnection(token);
    setConnection(conn);

    conn.start()
      .then(() => {
        console.log("✅ متصل بالـ SignalR");

        // استقبال أي رسالة جديدة
        conn.on("ReceiveMessage", (msg) => {
          console.log("📩 رسالة جديدة:", msg);
          setMessages((prev) => [...prev, msg]);
        });
      })
      .catch((err) => console.error("❌ فشل الاتصال بـ Hub:", err));

    return () => conn.stop(); // تنظيف عند الخروج
  }, [token]);

  // 2️⃣ إنشاء أو فتح المحادثة عند الضغط على الزر
  const handleStartConversation = async () => {
    try {
      const data = await getOneConversation(null, receiverId, 10, token);
      setConversationId(data.id);             // حفظ conversationId
      setMessages(data.messages || []);       // عرض الرسائل السابقة
      console.log("✅ تم إنشاء/فتح المحادثة:", data);
    } catch (err) {
      console.error("❌ خطأ في إنشاء المحادثة:", err);
      alert("حدث خطأ أثناء إنشاء المحادثة. تحقق من السيرفر أو التوكن.");
    }
  };

  // 3️⃣ إرسال رسالة
  const handleSend = async () => {
    if (!message.trim() || !connection || !conversationId) return;

    try {
      await sendMessage(connection, receiverId, message, conversationId);
      setMessage(""); // مسح input بعد الإرسال
    } catch (err) {
      console.error("❌ فشل إرسال الرسالة:", err);
      alert("حدث خطأ أثناء إرسال الرسالة.");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", maxWidth: "400px" }}>
      <h3>💬 شات تجريبي مع آية</h3>

      {!conversationId && (
        <button onClick={handleStartConversation} style={{ marginBottom: "10px" }}>
          ابدأ محادثة مع آية
        </button>
      )}

      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #eee",
          padding: "5px",
          marginBottom: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>لا توجد رسائل بعد</p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: "8px",
                textAlign: m.senderId === localStorage.getItem("userId") ? "right" : "left",
              }}
            >
              <strong>{m.senderName || "مستخدم"}:</strong> {m.text || "📎 ملف مرفق"}
            </div>
          ))
        )}
      </div>

      {conversationId && (
        <div style={{ display: "flex", gap: "5px" }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالة..."
            style={{ flex: 1, padding: "6px" }}
          />
          <button onClick={handleSend} style={{ padding: "6px 12px" }}>
            إرسال
          </button>
        </div>
      )}
    </div>
  );
};

export default Chat;
