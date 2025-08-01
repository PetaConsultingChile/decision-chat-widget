import { useEffect, useState } from "react";
import { decisionTree } from "../decisionTree";
import styles from "./ChatWidget.module.css";

interface Message {
  text: string;
  from: "bot" | "user";
}

export default function ChatWidget() {
  const [currentNode, setCurrentNode] = useState<string>(
    localStorage.getItem("decision-chat-current") || "start"
  );
  const [history, setHistory] = useState<Message[]>(
    JSON.parse(localStorage.getItem("decision-chat-history") || "[]")
  );

  useEffect(() => {
    if (history.length === 0) {
      addBotMessage(decisionTree[currentNode].message);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("decision-chat-current", currentNode);
    localStorage.setItem("decision-chat-history", JSON.stringify(history));
  }, [currentNode, history]);

  const addBotMessage = (text: string) =>
    setHistory((prev) => [...prev, { text, from: "bot" }]);

  const addUserMessage = (text: string) =>
    setHistory((prev) => [...prev, { text, from: "user" }]);

  const handleOptionClick = (option: { text: string; next?: string; action?: string }) => {
    addUserMessage(option.text);

    if (option.action === "connect_agent") {
      addBotMessage("Conectando con un agente...");
      setCurrentNode("end");
    } else if (option.action === "open_products") {
      addBotMessage("Abriendo catálogo de productos...");
      setCurrentNode("end");
    } else if (option.next) {
      setCurrentNode(option.next);
      addBotMessage(decisionTree[option.next].message);
    }
  };

  /** --- NUEVO: función de reinicio --- **/
  const resetChat = () => {
    localStorage.removeItem("decision-chat-current");
    localStorage.removeItem("decision-chat-history");
    setCurrentNode("start");
    setHistory([]);
    addBotMessage(decisionTree["start"].message);
  };

  const node = decisionTree[currentNode];

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.header}>
        Asistente Virtual
        <button onClick={resetChat} className={styles.resetButton}>
          Reiniciar
        </button>
      </div>

      <div className={styles.messages}>
        {history.map((msg, i) => (
          <div
            key={i}
            className={msg.from === "bot" ? styles.botMessage : styles.userMessage}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {node.options && (
        <div className={styles.options}>
          {node.options.map((o, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(o)}
              className={styles.optionButton}
            >
              {o.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
