import React from "react";

export default function Message({ text, sender }) {
  return (
    //حاطين هيك اسم الكلاس عشان نميز بين الرسائل المرسلة والمستقبلة
    <div className={`message ${sender}`}>
      <p>{text}</p>
    </div>
  );
}
