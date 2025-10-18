import React, { useState } from "react";
import AttachFileIcon from '@mui/icons-material/AttachFile';
export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleClick = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="اكتب رسالة..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      />
      <AttachFileIcon/>
      <button onClick={handleClick}>إرسال</button>
    </div>
  );
}
