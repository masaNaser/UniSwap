//  import AttachFileIcon from '@mui/icons-material/AttachFile';
// import React, { useState, useRef } from "react";
// import CloseIcon from '@mui/icons-material/Close';
// export default function MessageInput({ onSend }) {
//   const [text, setText] = useState("");
//   const [files, setFiles] = useState([]);
//   const fileInputRef = useRef(null);

//   const handleAttachClick = () => fileInputRef.current.click();

//   const handleFileChange = (e) => {
//     const selected = Array.from(e.target.files);
//     setFiles(prev => [...prev, ...selected]);
//     e.target.value = null; // إعادة تهيئة الاختيار
//   };

//   const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));

//   const handleSendClick = () => {
//     if (!text.trim() && files.length === 0) return;
//     onSend(text, files);
//     setText("");
//     setFiles([]);
//   };

//   return (
//     <div className="message-input">
//       <input
//         type="text"
//         value={text}
//         onChange={e => setText(e.target.value)}
//         placeholder="اكتب رسالة..."
//       />
//       <button onClick={handleAttachClick}><AttachFileIcon/></button>
//       <input
//         type="file"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         multiple
//         onChange={handleFileChange}
//       />
//       <button onClick={handleSendClick}>send</button>

//       {files.length > 0 && (
//         <div >
//           {files.map((f, i) => (
//             <span key={i}>
//               {f.name} <button onClick={() => removeFile(i)}><CloseIcon/></button>
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useRef } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

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
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="write messege..."
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
      <button onClick={handleSendClick}>send</button>

      {files.length > 0 && (
        <div className="attached-files">
          {files.map((f, i) => (
            <span key={i}>
              {f.file.name}{" "}
              <button onClick={() => removeFile(i)}>
                <CloseIcon />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
