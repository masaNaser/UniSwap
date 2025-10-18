// import React from 'react'
// import { Box } from "@mui/material";

// export default function ChatPage() {
//   return (
//     <>
//     <Box sx={{display:'flex', height:'100vh'}}>
//       <div style={{ width: "30%", borderRight: "1px solid #ddd" }}>Sidebar</div>
//       <div style={{ flex: 1 }}>Chat Window</div>
//     </Box>
//     </>
//   )
// }


import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "./Chat.css";
import Container from "@mui/material/Container";

export default function ChatPage() {
  const [selectedConv, setSelectedConv] = useState(null);

  return (
    <>
    <Container maxWidth="lg">
    <div className="chat-container">
      {/* Sidebar: قائمة المحادثات */}
      <ChatList
      // onSelectConversation : هذا خاصية (prop) نمرّرها للـ ChatList لكي يعرف ماذا نفعل عند الضغط على أي محادثة.
        onSelectConversation={(convId, receiverId, receiverName) =>
            //هذا يعني: لما المستخدم يضغط على محادثة، نخزن بيانات المحادثة المحددة في حالة (selectedConv) الخاصة بـ ChatPage.
          setSelectedConv({ convId, receiverId, receiverName })
        }
      />

      {/* نافذة الشات */}
      {/*يعني: إذا اخترت محادثة → تظهر نافذة الشات مع الرسائل للطرف الآخر، وإلا يظهر نص "اختر محادثة لبدء الدردشة".*/ }
      {selectedConv ? (
        <ChatWindow
          conversationId={selectedConv.convId}
          receiverId={selectedConv.receiverId}
          receiverName={selectedConv.receiverName}
        />
      ) : (
        <div className="empty-window">Select a conversation to start chatting</div>
      )}
    </div>
  </Container>
  </>);
}
