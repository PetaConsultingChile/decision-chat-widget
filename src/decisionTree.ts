export interface DecisionNode {
    message: string;
    options?: { text: string; next?: string; action?: string }[];
  }
  
  export const decisionTree: Record<string, DecisionNode> = {
    start: {
      message: "¡Hola! ¿En qué puedo ayudarte?",
      options: [
        { text: "Soporte técnico", next: "soporte" },
        { text: "Información de productos", next: "productos" },
      ],
    },
    soporte: {
      message: "¿Qué tipo de problema tienes?",
      options: [
        { text: "No puedo iniciar sesión", next: "login" },
        { text: "Otro problema", next: "otro" },
      ],
    },
    login: {
      message: "Revisa que tu usuario esté correcto. ¿Quieres hablar con un agente?",
      options: [
        { text: "Sí, conectar agente", action: "connect_agent" },
        { text: "No, gracias", next: "end" },
      ],
    },
    productos: {
      message: "Tenemos múltiples categorías. ¿Quieres verlas?",
      options: [
        { text: "Sí", action: "open_products" },
        { text: "No", next: "end" },
      ],
    },
    end: {
      message: "¡Gracias por usar nuestro asistente!",
    },
  };
  