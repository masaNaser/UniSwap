import * as signalR from "@microsoft/signalr";
import api from "./api";

// روابط السيرفر
// const API_BASE_URL = "https://uni.runasp.net/api";
const HUB_BASE_URL = "https://uni.runasp.net";

//  إنشاء اتصال SignalR
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

//  إرسال رسالة عبر Hub
// export async function sendMessage(connection, receiverId, text, conversationId = null) {
//   try {
//     if (!receiverId) {
//       console.error(" خطأ: ReceiverId غير موجود");
//       return;
//     }

//     const messageDto = {
//       ReceiverId: receiverId,
//       ConversationId: conversationId || null,
//       Text: text || "",
//       File: null,
//     };

//     console.log(" إرسال عبر Hub:", messageDto);
//     await connection.invoke("SendMessage", messageDto);
//     console.log(" تم الإرسال عبر SignalR");
//   } catch (err) {
//     console.error(" فشل إرسال الرسالة:", err);
//     console.error(" تأكد أن ReceiverId صالح و ConversationId صحيح و Token ساري");
//     throw err;
//   }
// }

// إرسال رسالة (نص أو ملف)
export const sendMessage = async (
  receiverId,
  text,
  conversationId = null,
  files = []
) => {
  const formData = new FormData();
  formData.append("receiverId", receiverId);
  formData.append("text", text || "");

  if (conversationId) formData.append("conversationId", conversationId);

  files.forEach((file) => {
    // file.file إذا جاي من MessageInput مع preview
    formData.append("file", file.file || file);
  });

  try {
    const res = await api.post("/Chats/send", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("فشل إرسال الرسالة:", err);
    throw err;
  }
};

//  جلب جميع المحادثات (لجزء اليمين لاحقًا)
export const getConversations = async (token) => {
  return await api.get(`/Chats/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  فتح أو إنشاء محادثة واحدة
// export const getOneConversation = async (
//   conversationId,
//   receiverId,
//   take,
//   token
// ) => {
//   return await api.get(
//     `/Chats?receiverId=${receiverId}&take=${take}&conversationId=${conversationId}`,
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
// };
export const getOneConversation = async (conversationId, receiverId, take, token) => {
  try {
    // 🔥 بناء الـ params بذكاء - نضيف conversationId بس لو موجود
    const params = {
      receiverId,
      take,
      // conversationId,
      // token
    };
    
    // إضافة conversationId فقط إذا كان موجود وليس null
    if (conversationId && conversationId !== 'null') {
      params.conversationId = conversationId;
    }

    const response = await api.get(`/Chats`
, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

// جلب الرسائل القديمة
// export const getOldMessages = async (conversationId, beforeId, take, token) => {
//   return await api.get(
//     `/Chats/messages/old?conversationId=${conversationId}&beforeId=${beforeId}&take=${take}`,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
// };
export const getOldMessages = async (conversationId, beforeId, take, token) => {
  return await api.get('/Chats/messages/old', {
    params: { conversationId, beforeId, take },
    headers: { Authorization: `Bearer ${token}` }
  });
};
// جلب الرسائل الجديدة
// export const getNewMessages = async (conversationId, afterId, take, token) => {
//   return await api.get(
//     `/Chats/messages/new?conversationId=${conversationId}&afterId=${afterId}&take=${take}`,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
// };

export const getNewMessages = async (conversationId, afterId, take, token) => {
  return await api.get('/Chats/messages/new', {
    params: { conversationId, afterId, take },
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getUnreadCount = async (token) => {
  return await api.get('/Chats/unread-count', {
    headers: { Authorization: `Bearer ${token}` }
  });
};
