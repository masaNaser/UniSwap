import React from "react";
// مكون لعرض رسالة فردية في الدردشة
export default function Message({ text, sender }) {
  return (
    //حاطين هيك اسم الكلاس عشان نميز بين الرسائل المرسلة والمستقبلة
    <div className={`message ${sender}`}>
      <p>{text}</p>
    </div>
  );
}
