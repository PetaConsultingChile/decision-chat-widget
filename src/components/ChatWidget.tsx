import { useEffect, useState } from "react";
import { decisionTree } from "../decisionTree";
import styles from "./ChatWidget.module.css";

interface Message {
  text: string;
  from: "bot" | "user";
}

const actions: Record<string, () => void> = {
  connect_agent: () => {
    alert("Conectando con un asesor de servicio al cliente...");
    // Aquí podrías abrir un chat en vivo o enviar una notificación al equipo
  },
  schedule_service: () => {
    alert("Abriendo formulario para agendar tu cita...");
    // Aquí podrías abrir un modal o redirigir a un formulario externo
    window.open("/agenda-cita", "_blank");
  },
  open_parts_catalog: () => {
    alert("Abriendo catálogo de repuestos...");
    window.open("/catalogo-repuestos", "_blank");
  },
  open_new_cars: () => {
    alert("Abriendo catálogo de autos nuevos...");
    window.open("/catalogo-autos-nuevos", "_blank");
  },
  open_used_cars: () => {
    alert("Abriendo catálogo de autos usados...");
    window.open("/catalogo-autos-usados", "_blank");
  },
  connect_finance_agent: () => {
    alert("Conectando con un asesor financiero...");
    // Podrías abrir un chat o formulario específico
  },
  close_chat: () => {
    alert("Cerrando el chat. ¡Gracias por visitarnos!");
    // Podrías desmontar el componente
    const container = document.getElementById("decision-chat-root");
    if (container) container.style.display = "none";
  },
};

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

    if (option.action && actions[option.action]) {
      actions[option.action]();
      setCurrentNode("end");
      addBotMessage(decisionTree["end"].message);
    } else if (option.next) {
      setCurrentNode(option.next);
      addBotMessage(decisionTree[option.next].message);
    }
  };

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
