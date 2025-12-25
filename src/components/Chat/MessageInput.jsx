import { useState, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleAttachClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = null;
  };

  const removeFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSendClick = () => {
    if (!text.trim() && files.length === 0) return;
    onSend(text, files);
    setText("");
    setFiles([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '40px';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
    // If Shift+Enter is pressed, allow default behavior (new line)
  };
  return (
    <div className="message-input-wrapper">
      {/* منطقة عرض الملفات المرفقة - فوق الـ input */}
      {files.length > 0 && (
        <div className="attached-files">
          {files.map((f, i) => (
            <span key={i} className="file-tag">
              {f.file.name}
              <button onClick={() => removeFile(i)} className="remove-file-btn">
                <CloseIcon fontSize="small" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* منطقة الإدخال */}
      <div className="message-input">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
          rows={1}
          style={{
            resize: 'none',
            overflow: 'hidden',
            minHeight: '40px',
            maxHeight: '120px',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />
        <button onClick={handleAttachClick}>
          <AttachFileIcon />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          onChange={handleFileChange}
        />
        <button onClick={handleSendClick}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}