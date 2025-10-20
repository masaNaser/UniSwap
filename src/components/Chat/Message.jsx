// import React from "react";
// // مكون لعرض رسالة فردية في الدردشة
// export default function Message({ text, sender }) {
//   return (
//     //حاطين هيك اسم الكلاس عشان نميز بين الرسائل المرسلة والمستقبلة
//     <div className={`message ${sender}`}>
//       <p>{text}</p>
//     </div>
//   );
// }

export default function Message({ text, filePath, content, sender }) {
  const fileName = filePath?.split("/").pop(); // ناخد اسم الملف من المسار

  const isImage = filePath && /\.(jpg|jpeg|png|gif)$/i.test(filePath);

  return (
      //حاطين هيك اسم الكلاس عشان نميز بين الرسائل المرسلة والمستقبلة
    <div className={`message ${sender}`}>
      {content === "File" && filePath ? (
        isImage ? (
           <div style={{ display: "inline-block", padding: 0, backgroundColor: "transparent" }}>
    <img
      src={`https://uni.runasp.net${filePath}`}
      alt={fileName}
      style={{ maxWidth: "200px", borderRadius: "8px" }}
    />
  </div>
        ) : (
          <a
            href={`https://uni.runasp.net${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📎 {fileName}
          </a>
        )
      ) : (
        text
      )}
    </div>
  );
}
