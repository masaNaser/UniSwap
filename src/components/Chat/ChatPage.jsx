import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "./Chat.css";
import Container from "@mui/material/Container";
import { useLocation } from "react-router-dom";
import { useEffect} from "react";

export default function ChatPage() {
  // const [selectedConv, setSelectedConv] = useState(null);
  // const [conversations, setConversations] = useState([]);
    const location = useLocation();
  const initialConv = location.state || null;
  
  const [selectedConv, setSelectedConv] = useState(initialConv);
  const [conversations, setConversations] = useState([]);
    //  لما نيجي من الـ profile، نفتح المحادثة تلقائياً
  useEffect(() => {
    if (initialConv?.autoOpen) {
      setSelectedConv(initialConv);
    }
  }, [initialConv]);
  return (
    <>
      <Container maxWidth="lg" sx={{mt:5,mb: 5}}>
        <div className="chat-container">
          {/* Sidebar: قائمة المحادثات */}
          <ChatList
            conversations={conversations}
            setConversations={setConversations}
            selectedConvId={selectedConv?.convId} // ⬅️ عشان نعرف أي محادثة محددة
            // onSelectConversation : هذا خاصية (prop) نمرّرها للـ ChatList لكي يعرف ماذا نفعل عند الضغط على أي محادثة.
            onSelectConversation={(
              convId,
              receiverId,
              receiverName,
              receiverImage
            ) =>
              //هذا يعني: لما المستخدم يضغط على محادثة، نخزن بيانات المحادثة المحددة في حالة (selectedConv) الخاصة بـ ChatPage.
              setSelectedConv({
                convId,
                receiverId,
                receiverName,
                receiverImage,
              })
            }
          />

          {/* نافذة الشات */}
          {/*يعني: إذا اخترت محادثة → تظهر نافذة الشات مع الرسائل للطرف الآخر، وإلا يظهر نص "اختر محادثة لبدء الدردشة".*/}
          {selectedConv ? (
            <ChatWindow
              setConversations={setConversations} //  لرفع تحديثات قائمة المحادثات عشان انه اخر محادثة انفتحت ( انبعثلها رسالة) هي تظهر بالاول مباشرة بدون ريفريش
              conversationId={selectedConv.convId} //  تمرير اي دي المحادثة
              receiverId={selectedConv.receiverId} //  تمرير اي دي الطرف الآخر
              receiverName={selectedConv.receiverName} //  تمرير اسم الطرف الآخر
              receiverImage={selectedConv.receiverImage} //  تمرير صورة الطرف الآخر
            />
          ) : (
            <div className="empty-window">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
