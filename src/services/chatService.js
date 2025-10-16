import * as signalR from "@microsoft/signalr";
import api from "./api";

// روابط السيرفر
const API_BASE_URL = "https://uni.runasp.net/api";
const HUB_BASE_URL = "https://uni.runasp.net";

// ✅ إنشاء اتصال SignalR
export function createChatHubConnection(token) {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${HUB_BASE_URL}/chatHub`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return connection;
}

// ✅ إرسال رسالة عبر Hub
export async function sendMessage(connection, receiverId, text, conversationId = null) {
  try {
    if (!receiverId) {
      console.error("❌ خطأ: ReceiverId غير موجود");
      return;
    }

    const messageDto = {
      ReceiverId: receiverId,
      ConversationId: conversationId || null,
      Text: text || "",
      File: null,
    };

    console.log("📤 إرسال عبر Hub:", messageDto);
    await connection.invoke("SendMessage", messageDto);
    console.log("✅ تم الإرسال عبر SignalR");
  } catch (err) {
    console.error("❌ فشل إرسال الرسالة:", err);
    console.error("💡 تأكد أن ReceiverId صالح و ConversationId صحيح و Token ساري");
    throw err;
  }
}

// ✅ جلب جميع المحادثات (لجزء اليمين لاحقًا)
export const getConversations = async (token) => {
  const res = await api.get(`/Chats/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ فتح أو إنشاء محادثة واحدة
export const getOneConversation = async (conversationId, receiverId, take = 10, token) => {
  try {
    let url = `/Chats?receiverId=${receiverId}&take=${take}`;
    if (conversationId) url += `&conversationId=${conversationId}`;

    const res = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("❌ خطأ في استدعاء GetOneConversation:", err);
    throw err;
  }
};

// ✅ جلب الرسائل القديمة
export const getOldMessages = async (conversationId, beforeId, take = 10, token) => {
  const res = await api.get(
    `/Chats/messages/older?conversationId=${conversationId}&beforeId=${beforeId}&take=${take}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ✅ جلب الرسائل الجديدة
export const getNewMessages = async (conversationId, afterId, take = 10, token) => {
  const res = await api.get(
    `/Chats/messages/new?conversationId=${conversationId}&afterId=${afterId}&take=${take}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
