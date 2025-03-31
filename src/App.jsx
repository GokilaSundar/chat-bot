import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState(() => {
    if (localStorage.getItem("messages")) {
      return JSON.parse(localStorage.getItem("messages"));
    }

    return [];
  });
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (question === "") {
      alert("Ask question to chat bot");
      return;
    }

    setMessages((messages) => [
      ...messages,
      {
        role: "user",
        content: question,
      },
    ]);

    setQuestion("");
  };

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));

    if (
      messages.length === 0 ||
      messages[messages.length - 1].role === "assistant"
    ) {
      return;
    }

    setLoading(true);
    axios
      .post("/api/conversation", messages)
      .then((response) => {
        setMessages((messages) => [...messages, response.data]);
      })
      .catch((error) => {
        alert(error?.response?.data?.message || "Failed to get response!");
        console.error("Failed to get response!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [messages]);

  return (
    <div className="container">
      <div className="chat_container1">
        <div className="chat_container2">
          {messages.map((chat, index) => (
            <div key={index}>
              {chat.role == "assistant" ? (
                <div className="bot_chat_container">
                  <div>
                    <div className="bot_type">Bot</div>{" "}
                    <div className="bot_chats">{chat.content}</div>
                  </div>
                </div>
              ) : (
                <div className="user_chat_container1">
                  <div className="user_chat_container2">
                    <div className="user_type">User</div>{" "}
                    <div className="user_chats">{chat.content}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="loading">{loading ? "Thinking..." : <>&nbsp;</>}</div>
      <form onSubmit={handleSubmit} className="input_container">
        <input
          disabled={loading}
          required
          type="text"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
          placeholder="Ask Questions.... :)"
        />
        <button disabled={loading} type="submit">
          Ask Bot
        </button>
      </form>
    </div>
  );
}

export default App;
