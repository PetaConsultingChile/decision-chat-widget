(function () {
    // Configuración dinámica del widget
    const widgetConfig = {
      // URL de la API para cargar el árbol de decisiones (opcional)
      apiUrl: null,
      // Configuración inicial del árbol (se puede sobrescribir)
      initialTree: null,
      // Intervalo de actualización en milisegundos (0 = sin actualización automática)
      updateInterval: 0,
      // Callback para personalizar acciones
      customActions: {},
      // Callback para personalizar el renderizado
      customRenderer: null
    };

    // Árbol de decisiones por defecto (fallback)
    const defaultDecisionTree = {
      start: {
        message: "¡Hola! Bienvenido al Taller y Concesionario. ¿En qué podemos ayudarte hoy?",
        options: [
          { text: "Servicios de taller mecánico", next: "taller" },
          { text: "Venta de autos", next: "venta" },
          { text: "Contactar un asesor", action: "connect_agent" },
        ],
      },
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

    // Variable global para el árbol de decisiones (se actualiza dinámicamente)
    let decisionTree = { ...defaultDecisionTree };

    // Acciones por defecto
    const defaultActions = {
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

    // Variable global para las acciones (se puede extender dinámicamente)
    let actions = { ...defaultActions };

    // Función para cargar configuración desde el HTML
    function loadConfigFromHTML() {
      const script = document.currentScript || document.querySelector('script[src*="widget.js"]');
      if (script) {
        // Buscar configuración en atributos data-*
        const apiUrl = script.getAttribute('data-api-url');
        const updateInterval = script.getAttribute('data-update-interval');
        
        if (apiUrl) widgetConfig.apiUrl = apiUrl;
        if (updateInterval) widgetConfig.updateInterval = parseInt(updateInterval);
      }

      // Buscar configuración en window
      if (window.decisionChatConfig) {
        Object.assign(widgetConfig, window.decisionChatConfig);
      }
    }

    // Función para cargar árbol desde API
    async function loadTreeFromAPI() {
      if (!widgetConfig.apiUrl) return false;

      try {
        const response = await fetch(widgetConfig.apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.tree && typeof data.tree === 'object') {
          decisionTree = { ...defaultDecisionTree, ...data.tree };
          console.log('Árbol de decisiones cargado desde API:', decisionTree);
          return true;
        }
      } catch (error) {
        console.warn('Error cargando árbol desde API:', error);
        return false;
      }
      
      return false;
    }

    // Función para actualizar acciones dinámicamente
    function updateActions(newActions) {
      if (newActions && typeof newActions === 'object') {
        actions = { ...actions, ...newActions };
      }
    }

    // Función para actualizar el árbol dinámicamente
    function updateDecisionTree(newTree) {
      if (newTree && typeof newTree === 'object') {
        decisionTree = { ...defaultDecisionTree, ...newTree };
        
        // Si el chat está abierto, actualizar la vista
        if (isOpen) {
          renderMessages();
          renderOptions();
        }
        
        console.log('Árbol de decisiones actualizado:', decisionTree);
        return true;
      }
      return false;
    }

    // Función para obtener el árbol actual
    function getCurrentTree() {
      return { ...decisionTree };
    }

    // Función para agregar nodos dinámicamente
    function addNode(nodeId, nodeData) {
      if (nodeId && nodeData && typeof nodeData === 'object') {
        decisionTree[nodeId] = nodeData;
        return true;
      }
      return false;
    }

    // Función para remover nodos
    function removeNode(nodeId) {
      if (decisionTree[nodeId]) {
        delete decisionTree[nodeId];
        return true;
      }
      return false;
    }

    // Función para actualizar opciones de un nodo específico
    function updateNodeOptions(nodeId, newOptions) {
      if (decisionTree[nodeId] && Array.isArray(newOptions)) {
        decisionTree[nodeId].options = newOptions;
        
        // Si estamos en ese nodo, actualizar la vista
        if (isOpen && currentNode === nodeId) {
          renderOptions();
        }
        
        return true;
      }
      return false;
    }

    // Función para actualización automática
    let updateTimer = null;
    
    function startAutoUpdate() {
      if (widgetConfig.updateInterval > 0) {
        updateTimer = setInterval(async () => {
          await loadTreeFromAPI();
        }, widgetConfig.updateInterval);
      }
    }

    function stopAutoUpdate() {
      if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
      }
    }

    // Inicialización del árbol dinámico
    async function initializeDynamicTree() {
      // Cargar configuración
      loadConfigFromHTML();
      
      // Aplicar configuración inicial si existe
      if (widgetConfig.initialTree) {
        updateDecisionTree(widgetConfig.initialTree);
      }
      
      // Intentar cargar desde API
      const apiLoaded = await loadTreeFromAPI();
      
      // Si no se cargó desde API y no hay configuración inicial, usar el árbol por defecto
      if (!apiLoaded && !widgetConfig.initialTree) {
        decisionTree = { ...defaultDecisionTree };
      }
      
      // Iniciar actualización automática si está configurada
      startAutoUpdate();
      
      // Exponer funciones para uso externo
      window.decisionChatWidget = {
        updateTree: updateDecisionTree,
        getTree: getCurrentTree,
        addNode: addNode,
        removeNode: removeNode,
        updateNodeOptions: updateNodeOptions,
        updateActions: updateActions,
        reloadFromAPI: loadTreeFromAPI,
        stopAutoUpdate: stopAutoUpdate,
        startAutoUpdate: startAutoUpdate
      };
    }
  
    let isOpen = false;
    let isCollapsed = false;
    let currentNode = localStorage.getItem("decision-chat-current") || "start";
    let history = JSON.parse(localStorage.getItem("decision-chat-history") || "[]");
    let dragOffset = { x: 0, y: 0 };
    let widgetPosition = { x: 20, y: 20 };
  
    const host = document.createElement("div");
    host.id = "decision-chat-root";
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });
  
    const style = document.createElement("style");
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      .widgetContainer {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        max-height: 550px;
        display: flex;
        flex-direction: column;
        background: #336090;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 999999 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        overflow: hidden;
      }
      
      .widgetContainer.collapsed {
        height: 60px;
        max-height: 60px;
      }
      
      .widgetContainer.dragging {
        cursor: grabbing;
        transform: scale(1.02);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
      }
      
      .header {
        padding: 16px 20px;
        background: #336090;
        color: white;
        border-radius: 16px 16px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: grab;
        user-select: none;
        font-weight: 600;
        font-size: 16px;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        pointer-events: none;
      }
      
      .header:active {
        cursor: grabbing;
      }
      
      .headerContent {
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1;
        position: relative;
      }
      
      .headerIcon {
        width: 24px;
        height: 24px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
      
      .headerControls {
        display: flex;
        gap: 8px;
        z-index: 1;
        position: relative;
      }
      
      .controlButton {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.2s ease;
        backdrop-filter: blur(5px);
      }
      
      .controlButton:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }
      
      .controlButton:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
      }
      
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 0 0 16px 16px;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .content.collapsed {
        display: none;
      }
      
      .messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 250px;
        scrollbar-width: thin;
        scrollbar-color: #cbd5e0 #f7fafc;
      }
      
      .messages::-webkit-scrollbar {
        width: 6px;
      }
      
      .messages::-webkit-scrollbar-track {
        background: #f7fafc;
        border-radius: 3px;
      }
      
      .messages::-webkit-scrollbar-thumb {
        background: #336090;
        border-radius: 3px;
      }
      
      .messages::-webkit-scrollbar-thumb:hover {
        background: #2a4f7a;
      }
      
      .botMessage {
        align-self: flex-start;
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        padding: 12px 16px;
        border-radius: 18px 18px 18px 4px;
        font-size: 14px;
        line-height: 1.4;
        color: #2d3748;
        max-width: 85%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
      }
      
      .userMessage {
        align-self: flex-end;
        background: #336090;
        padding: 12px 16px;
        border-radius: 18px 18px 4px 18px;
        font-size: 14px;
        line-height: 1.4;
        color: white;
        max-width: 85%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .options {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-top: 1px solid #e2e8f0;
        background: #fafbfc;
      }
      
      .optionButton {
        background: #336090;
        color: white;
        padding: 12px 16px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        font-weight: 500;
        text-align: left;
        line-height: 1.4;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .optionButton:hover {
        background: #2a4f7a;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      
      .optionButton:focus {
        outline: 2px solid #667eea;
        outline-offset: 2px;
      }
      
      .optionButton:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .widgetButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: #336090;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        z-index: 999999 !important;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      }
      
      .widgetButton:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
      }
      
      .widgetButton:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
      }
      
      .widgetButton:active {
        transform: scale(0.95);
      }
      
      .resetButton {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
        backdrop-filter: blur(5px);
      }
      
      .resetButton:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.05);
      }
      
      .resetButton:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .widgetContainer {
          width: calc(100vw - 40px);
          max-width: 350px;
          left: 20px;
          right: 20px;
          bottom: 20px;
        }
        
        .messages {
          max-height: 200px;
        }
        
        .widgetButton {
          width: 56px;
          height: 56px;
          font-size: 20px;
        }
      }
      
      @media (max-width: 480px) {
        .widgetContainer {
          width: calc(100vw - 20px);
          left: 10px;
          right: 10px;
          bottom: 10px;
        }
        
        .header {
          padding: 12px 16px;
          font-size: 14px;
        }
        
        .messages {
          padding: 12px;
          max-height: 180px;
        }
        
        .options {
          padding: 12px;
        }
        
        .optionButton {
          padding: 10px 14px;
          font-size: 13px;
        }
      }
      
      /* Animation for new messages */
      .message-enter {
        opacity: 0;
        transform: translateY(10px);
        animation: messageSlideIn 0.3s ease forwards;
      }
      
      @keyframes messageSlideIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Loading animation */
      .loading {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #f3f4f6;
        border-radius: 50%;
        border-top-color: #667eea;
        animation: spin 1s ease-in-out infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    shadow.appendChild(style);
  
    const widgetButton = document.createElement("button");
    widgetButton.className = "widgetButton";
    widgetButton.innerHTML = "💬";
    widgetButton.setAttribute("aria-label", "Abrir chat de asistente");
    shadow.appendChild(widgetButton);
  
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "widgetContainer";
    widgetContainer.style.display = "none";
    shadow.appendChild(widgetContainer);
  
    const header = document.createElement("div");
    header.className = "header";
    header.innerHTML = `
      <div class="headerContent">
        <div class="headerIcon">🤖</div>
        <span>Asistente Virtual</span>
      </div>
      <div class="headerControls">
        <button class="controlButton collapseButton" aria-label="Colapsar chat">−</button>
        <button class="controlButton resetButton" aria-label="Reiniciar chat">↻</button>
      </div>
    `;
    widgetContainer.appendChild(header);
  
    const content = document.createElement("div");
    content.className = "content";
    widgetContainer.appendChild(content);
  
    const messagesContainer = document.createElement("div");
    messagesContainer.className = "messages";
    content.appendChild(messagesContainer);
  
    const optionsContainer = document.createElement("div");
    optionsContainer.className = "options";
    content.appendChild(optionsContainer);
  
    // Dragging functionality
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let widgetStart = { x: 0, y: 0 };
  
    header.addEventListener("mousedown", (e) => {
      if (e.target.closest('.controlButton')) return;
      
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
      widgetStart = { x: widgetPosition.x, y: widgetPosition.y };
      header.style.cursor = "grabbing";
      widgetContainer.classList.add("dragging");
    });
  
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      widgetPosition.x = widgetStart.x + deltaX;
      widgetPosition.y = widgetStart.y + deltaY;
      
      // Keep widget within viewport bounds
      const maxX = window.innerWidth - widgetContainer.offsetWidth - 20;
      const maxY = window.innerHeight - widgetContainer.offsetHeight - 20;
      
      widgetPosition.x = Math.max(20, Math.min(widgetPosition.x, maxX));
      widgetPosition.y = Math.max(20, Math.min(widgetPosition.y, maxY));
      
      widgetContainer.style.left = widgetPosition.x + "px";
      widgetContainer.style.bottom = "auto";
      widgetContainer.style.right = "auto";
    });
  
    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = "grab";
        widgetContainer.classList.remove("dragging");
      }
    });
  
    // Collapse functionality
    const collapseButton = header.querySelector('.collapseButton');
    collapseButton.addEventListener("click", () => {
      isCollapsed = !isCollapsed;
      content.classList.toggle("collapsed", isCollapsed);
      widgetContainer.classList.toggle("collapsed", isCollapsed);
      collapseButton.textContent = isCollapsed ? "+" : "−";
      collapseButton.setAttribute("aria-label", isCollapsed ? "Expandir chat" : "Colapsar chat");
    });
  
    // Reset functionality
    const resetButton = header.querySelector('.resetButton');
    resetButton.addEventListener("click", resetChat);
  
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
      history.forEach((msg, index) => {
        const div = document.createElement("div");
        div.textContent = msg.text;
        div.className = msg.from === "bot" ? "botMessage" : "userMessage";
        
        // Add animation for new messages
        if (index === history.length - 1) {
          div.classList.add("message-enter");
        }
        
        messagesContainer.appendChild(div);
      });
      
      // Smooth scroll to bottom
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth"
      });
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
  
    // Initialize
    renderMessages();
    renderOptions();
    
    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!isOpen) return;
      
      const optionButtons = optionsContainer.querySelectorAll('.optionButton');
      const activeElement = document.activeElement;
      
      if (e.key === "Escape") {
        isOpen = false;
        widgetContainer.style.display = "none";
        widgetButton.style.display = "block";
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = Array.from(optionButtons).indexOf(activeElement);
        let nextIndex;
        
        if (e.key === "ArrowDown") {
          nextIndex = currentIndex < optionButtons.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : optionButtons.length - 1;
        }
        
        optionButtons[nextIndex]?.focus();
      } else if (e.key === "Enter" && activeElement.classList.contains('optionButton')) {
        activeElement.click();
      }
    });

    // Inicializar el árbol dinámico
    initializeDynamicTree();
  })();
  