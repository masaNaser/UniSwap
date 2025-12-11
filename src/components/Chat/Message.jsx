

export default function Message({ text, filePath, content, sender }) {
  const fileName = filePath?.split("/").pop?.() || "file";

  const isImage = filePath && /\.(jpg|jpeg|png|gif)$/i.test(filePath);
  const isFileMessage = content === "File" && filePath;

  return (
    <div
      className={`message ${sender}`}
      style={{
        // backgroundColor: isFileMessage ? "transparent" : "",
        border: isFileMessage ? "none" : "",
        padding: "10px",
        color: sender === "me" ? "white" : "initial",
        
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
              target="_blank"
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
