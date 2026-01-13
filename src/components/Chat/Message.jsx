

export default function Message({ text, filePath, content, sender }) {
  const fileName = filePath?.split("/").pop?.() || "file";

  const isImage = filePath && /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);
  const isFileMessage = content === "File" && filePath;
  const isImageMessage = isFileMessage && isImage;

  return (
    <div
          className={`message ${sender}`}
      style={{
        backgroundColor: isImageMessage ? "transparent" : "",
        border: isImageMessage ? "none" : "",
        padding: isImageMessage ? "0" : "10px",
        color: sender === "me" ? "white" : "black",
      }}
    >
      {isFileMessage ? (
        isImage ? (
          <img
            src={`https://uni1swap.runasp.net${filePath}`}
            alt={fileName}
            style={{ maxWidth: "200px", borderRadius: "8px", display: "block" }}
          />
        ) : (
          <a
            href={`https://uni1swap.runasp.net${filePath}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: sender === "me" ? "white" : "black",
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
              // target="_blank"
              rel="noopener noreferrer"
              style={{
                color: sender === "me" ? "white" : "black",
              }}
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
