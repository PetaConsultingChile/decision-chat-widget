(function () {
    const decisionTree = {
      start: {
        message: "¡Hola! Bienvenido al Taller y Concesionario. ¿En qué podemos ayudarte hoy?",
        options: [
          { text: "Servicios de taller mecánico", next: "taller" },
          { text: "Venta de autos", next: "venta" },
          { text: "Contactar un asesor", action: "connect_agent" },
        ],
      },
      // --- Taller Mecánico ---
      taller: {
        message: "Ofrecemos distintos servicios mecánicos. ¿Qué necesitas?",
        options: [
          { text: "Mantenimiento preventivo", next: "mantenimiento" },
          { text: "Reparaciones específicas", next: "reparaciones" },
          { text: "Cotizar repuestos", next: "repuestos" },
          { text: "Volver al inicio", next: "start" },
        ],
      },
      mantenimiento: {
        message: "Realizamos cambio de aceite, revisión de frenos, alineación, etc. ¿Quieres agendar una cita?",
        options: [
          { text: "Sí, agendar cita", action: "schedule_service" },
          { text: "Volver al menú de taller", next: "taller" },
        ],
      },
      reparaciones: {
        message: "Podemos diagnosticar y reparar problemas eléctricos, de motor, suspensión y más. ¿Quieres hablar con un asesor?",
        options: [
          { text: "Sí, conectar con asesor", action: "connect_agent" },
          { text: "Volver al menú de taller", next: "taller" },
        ],
      },
      repuestos: {
        message: "Contamos con repuestos originales y alternativos. ¿Quieres ver nuestro catálogo?",
        options: [
          { text: "Sí, abrir catálogo de repuestos", action: "open_parts_catalog" },
          { text: "Volver al menú de taller", next: "taller" },
        ],
      },
      // --- Venta de Autos ---
      venta: {
        message: "Tenemos autos nuevos y usados disponibles. ¿Qué tipo de auto buscas?",
        options: [
          { text: "Autos nuevos", next: "autos_nuevos" },
          { text: "Autos usados", next: "autos_usados" },
          { text: "Ver planes de financiamiento", next: "financiamiento" },
          { text: "Volver al inicio", next: "start" },
        ],
      },
      autos_nuevos: {
        message: "Contamos con las últimas versiones de nuestras marcas principales. ¿Quieres ver el catálogo?",
        options: [
          { text: "Sí, ver catálogo de autos nuevos", action: "open_new_cars" },
          { text: "Volver a venta de autos", next: "venta" },
        ],
      },
      autos_usados: {
        message: "Ofrecemos autos usados certificados. ¿Quieres ver la lista?",
        options: [
          { text: "Sí, ver autos usados", action: "open_used_cars" },
          { text: "Volver a venta de autos", next: "venta" },
        ],
      },
      financiamiento: {
        message: "Ofrecemos opciones de crédito y leasing. ¿Quieres que un asesor te contacte?",
        options: [
          { text: "Sí, contactar asesor financiero", action: "connect_finance_agent" },
          { text: "Volver a venta de autos", next: "venta" },
        ],
      },
      end: {
        message: "¡Gracias por visitar nuestro asistente! ¿Deseas algo más?",
        options: [
          { text: "Volver al inicio", next: "start" },
          { text: "Salir", action: "close_chat" },
        ],
      },
    };
  
    const actions = {
      connect_agent: () => alert("Conectando con un asesor de servicio al cliente..."),
      schedule_service: () => window.open("/agenda-cita", "_blank"),
      open_parts_catalog: () => window.open("/catalogo-repuestos", "_blank"),
      open_new_cars: () => window.open("/catalogo-autos-nuevos", "_blank"),
      open_used_cars: () => window.open("/catalogo-autos-usados", "_blank"),
      connect_finance_agent: () => alert("Conectando con un asesor financiero..."),
      close_chat: () => {
        alert("Cerrando el chat. ¡Gracias por visitarnos!");
        const container = document.getElementById("decision-chat-root");
        if (container) container.style.display = "none";
      },
    };
  
    let isOpen = false;
    let currentNode = localStorage.getItem("decision-chat-current") || "start";
    let history = JSON.parse(localStorage.getItem("decision-chat-history") || "[]");
  
    const host = document.createElement("div");
    host.id = "decision-chat-root";
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });
  
    const style = document.createElement("style");
    style.textContent = `
      .widgetContainer { position: fixed; bottom: 20px; right: 20px; width: 320px; display: flex; flex-direction: column; background: white; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); font-family: system-ui, sans-serif; }
      .header { padding: 12px; font-weight: bold; background-color: #2563eb; color: white; border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
      .messages { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; height: 320px; }
      .botMessage { align-self: flex-start; background-color: #f3f4f6; padding: 8px; border-radius: 8px; font-size: 14px; }
      .userMessage { align-self: flex-end; background-color: #bfdbfe; padding: 8px; border-radius: 8px; font-size: 14px; }
      .options { padding: 12px; display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #e5e7eb; }
      .optionButton { background-color: #2563eb; color: white; padding: 8px; border-radius: 6px; border: none; cursor: pointer; transition: background 0.2s ease; }
      .optionButton:hover { background-color: #1d4ed8; }
      .resetButton { font-size: 12px; padding: 4px 8px; background: white; color: #2563eb; border: 1px solid #2563eb; border-radius: 4px; cursor: pointer; transition: background 0.2s ease; }
      .resetButton:hover { background: #2563eb; color: white; }
      .widgetButton { padding: 10px 16px; background: #2563eb; color: #fff; border: none; border-radius: 50%; width: 56px; height: 56px; cursor: pointer; position: fixed; bottom: 20px; right: 20px; font-size: 16px; z-index: 10000; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    `;
    shadow.appendChild(style);
  
    const widgetButton = document.createElement("button");
    widgetButton.className = "widgetButton";
    widgetButton.textContent = "💬";
    shadow.appendChild(widgetButton);
  
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widgetContainer";
    widgetContainer.style.display = "none";
    shadow.appendChild(widgetContainer);
  
    const header = document.createElement("div");
    header.className = "header";
    header.innerHTML = `Asistente Virtual`;
    const resetButton = document.createElement("button");
    resetButton.className = "resetButton";
    resetButton.textContent = "Reiniciar";
    header.appendChild(resetButton);
    widgetContainer.appendChild(header);
  
    const messagesContainer = document.createElement("div");
    messagesContainer.className = "messages";
    widgetContainer.appendChild(messagesContainer);
  
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options";
    widgetContainer.appendChild(optionsContainer);
  
    function saveState() {
      localStorage.setItem("decision-chat-current", currentNode);
      localStorage.setItem("decision-chat-history", JSON.stringify(history));
    }
    function addMessage(text, from) {
      history.push({ text, from });
      renderMessages();
      saveState();
    }
    function handleOptionClick(option) {
      addMessage(option.text, "user");
      if (option.action && actions[option.action]) {
        actions[option.action]();
        currentNode = "end";
        addMessage(decisionTree["end"].message, "bot");
      } else if (option.next) {
        currentNode = option.next;
        addMessage(decisionTree[option.next].message, "bot");
      }
      renderOptions();
    }
    function resetChat() {
      localStorage.removeItem("decision-chat-current");
      localStorage.removeItem("decision-chat-history");
      currentNode = "start";
      history = [];
      addMessage(decisionTree["start"].message, "bot");
      renderOptions();
    }
    function renderMessages() {
      messagesContainer.innerHTML = "";
      history.forEach((msg) => {
        const div = document.createElement("div");
        div.textContent = msg.text;
        div.className = msg.from === "bot" ? "botMessage" : "userMessage";
        messagesContainer.appendChild(div);
      });
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    function renderOptions() {
      optionsContainer.innerHTML = "";
      const node = decisionTree[currentNode];
      if (node.options) {
        node.options.forEach((o) => {
          const btn = document.createElement("button");
          btn.textContent = o.text;
          btn.className = "optionButton";
          btn.addEventListener("click", () => handleOptionClick(o));
          optionsContainer.appendChild(btn);
        });
      }
    }
  
    widgetButton.addEventListener("click", () => {
      isOpen = !isOpen;
      widgetContainer.style.display = isOpen ? "flex" : "none";
      widgetButton.style.display = isOpen ? "none" : "block";
      if (isOpen && history.length === 0) {
        addMessage(decisionTree[currentNode].message, "bot");
        renderOptions();
      }
    });
    resetButton.addEventListener("click", resetChat);
  
    renderMessages();
    renderOptions();
  })();
  