// export default function Message({ text, filePath, content, sender }) {
//   const fileName = filePath?.split("/").pop(); // ناخد اسم الملف من المسار

//   const isImage = filePath && /\.(jpg|jpeg|png|gif)$/i.test(filePath);
//     // نحدد إذا الرسالة تحتوي على ملف أو صورة

//   const isFileMessage = content === "File" && filePath;

//   return (
//    <div
//    //حاطين هيك اسم الكلاس عشان نميز بين الرسائل المرسلة والمستقبلة
//       className={`message ${sender}`}
//       style={{
//         backgroundColor: isFileMessage ? "transparent" : "",
//         border: isFileMessage ? "none" : "",
//         padding: isFileMessage ? "0" : "10px",
//       }}
//     >
//       {isFileMessage ? (
//         isImage ? (
//           <img
//             src={`https://uni.runasp.net${filePath}`}
//             alt={fileName}
//             style={{
//               maxWidth: "200px",
//               borderRadius: "8px",
//               display: "block",
//             }}
//           />
//         ) : (
//           <a
//             href={`https://uni.runasp.net${filePath}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             style={{
//               color: sender === "me" ? "#be0e0eff" : "#0078ff",
//               textDecoration: "underline",
//             }}
//           >
//              {fileName}
//           </a>
//         )
//       ) : (
//      // تحويل أي رابط في النص لرابط قابل للنقر
//   // نحمي النص من null أو undefined
//   (text || "").split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
//     part.match(/https?:\/\/[^\s]+/) ? (
//       <a
//         key={i}
//         href={part}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={{ color: '#fff' }}
//       >
//         {part}
//       </a>
//     ) : (
//       part
//     )
//   )
// )}
//     </div>
//   );
// }

export default function Message({ text, filePath, content, sender }) {
  const fileName = filePath?.split("/").pop?.() || "file";

  const isImage = filePath && /\.(jpg|jpeg|png|gif)$/i.test(filePath);
  const isFileMessage = content === "File" && filePath;

  return (
    <div
      className={`message ${sender}`}
      style={{
        backgroundColor: isFileMessage ? "transparent" : "",
        border: isFileMessage ? "none" : "",
        padding: isFileMessage ? "0" : "10px",
      }}
    >
      {isFileMessage ? (
        isImage ? (
          <img
            src={`https://uni.runasp.net${filePath}`}
            alt={fileName}
            style={{ maxWidth: "200px", borderRadius: "8px", display: "block" }}
          />
        ) : (
          <a
            href={`https://uni.runasp.net${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: sender === "me" ? "#be0e0eff" : "#0078ff",
              textDecoration: "underline",
            }}
          >
            {fileName}
          </a>
        )
      ) : (
        // تحويل أي رابط في النص لرابط قابل للنقر
        (text || "").split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
          part.match(/https?:\/\/[^\s]+/) ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff" }}
            >
              {part}
            </a>
          ) : (
            part
          )
        )
      )}
    </div>
  );
}
