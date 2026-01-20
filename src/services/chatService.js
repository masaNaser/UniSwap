import * as signalR from "@microsoft/signalr";
import api from "./api";

// روابط السيرفر
 const HUB_BASE_URL = "https://uni1swap.runasp.net";
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

//  جلب جميع المحادثات (لجزء اليمين )
export const getConversations = async (token) => {
  return await api.get(`/Chats/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const getOneConversation = async (conversationId, receiverId, take, token) => {
  try {
    //  بناء الـ params بذكاء - نضيف conversationId بس لو موجود
    const params = {
      receiverId,
      take,
      // conversationId,
      // token
    };
    
    if (conversationId && conversationId !== 'null') {
      params.conversationId = conversationId;
    }

    const response = await api.get(`/Chats`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};


export const getOldMessages = async (conversationId, beforeId, take, token) => {
  return await api.get('/Chats/messages/old', {
    params: { conversationId, beforeId, take },
    headers: { Authorization: `Bearer ${token}` }
  });
};


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

export const markMessageAsSeen = async (conversationId, token) => {
  return await api.post('/chats/mark-conversation-seen', null, {
    headers: { Authorization: `Bearer ${token}` },
    params: { conversationId }
  });
};