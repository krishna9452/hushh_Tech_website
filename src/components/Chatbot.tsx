import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm your Hushh assistant 👋" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageToSend = input;
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", text: messageToSend },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!res.ok) {
        throw new Error("Failed to get a response from the server.");
      }
      
      const data = await res.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", text: data.reply },
      ]);
    } catch {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "#111",
          color: "#fff",
          fontSize: "20px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px",
              background: "#111",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Hushh Assistant
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              background: "#f5f5f5",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    background:
                      msg.role === "user" ? "#111" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#000",
                    fontSize: "14px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && <div style={{ fontSize: "12px" }}>Thinking...</div>}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "5px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              style={{
                flex: 1,
                padding: "6px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                background: "#111",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>

          {/* Disclaimer */}
          <div
            style={{
              fontSize: "10px",
              padding: "5px",
              textAlign: "center",
              color: "#777",
            }}
          >
            ⚠️ Not financial advice
          </div>
        </div>
      )}
    </>
  );
}