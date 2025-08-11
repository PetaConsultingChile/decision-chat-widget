# 🤖 Widget de Chat de Decisiones Dinámico

Un widget de chat interactivo con árbol de decisiones completamente dinámico y configurable.

## ✨ Características Principales

- **🌳 Árbol de decisiones dinámico** - Las opciones se pueden actualizar en tiempo real
- **🔌 Carga desde API** - Soporte para cargar configuración desde endpoints externos
- **⚙️ Configuración flexible** - Múltiples formas de configurar el widget
- **🎨 Interfaz moderna** - Diseño responsive y animaciones suaves
- **📱 Totalmente responsive** - Funciona en móviles y desktop
- **🔧 API completa** - Funciones para manipular el árbol dinámicamente

## 🚀 Instalación Rápida

### 1. Incluir el script

```html
<script src="widget.js"></script>
```

### 2. Configuración básica (opcional)

```html
<script>
window.decisionChatConfig = {
    apiUrl: 'https://tu-api.com/decision-tree',
    updateInterval: 30000, // 30 segundos
    initialTree: {
        start: {
            message: "¡Hola! ¿En qué puedo ayudarte?",
            options: [
                { text: "Opción 1", next: "opcion1" },
                { text: "Opción 2", action: "accion_personalizada" }
            ]
        }
    }
};
</script>
```

## 📋 Métodos de Configuración

### 1. Atributos HTML (data-*)

```html
<script src="widget.js" 
        data-api-url="https://api.ejemplo.com/tree" 
        data-update-interval="60000">
</script>
```

### 2. Objeto de configuración global

```javascript
window.decisionChatConfig = {
    apiUrl: 'https://api.ejemplo.com/tree',
    updateInterval: 60000,
    initialTree: { /* tu árbol */ },
    customActions: { /* acciones personalizadas */ }
};
```

### 3. API dinámica (en tiempo real)

```javascript
// Actualizar todo el árbol
window.decisionChatWidget.updateTree(newTree);

// Agregar un nodo específico
window.decisionChatWidget.addNode('nuevo_nodo', nodeData);

// Actualizar opciones de un nodo
window.decisionChatWidget.updateNodeOptions('nodo_id', newOptions);
```

## 🔧 API Completa

### Funciones Disponibles

| Función | Descripción | Ejemplo |
|---------|-------------|---------|
| `updateTree(newTree)` | Actualiza todo el árbol de decisiones | `updateTree({start: {...}})` |
| `getTree()` | Obtiene el árbol actual | `const tree = getTree()` |
| `addNode(nodeId, nodeData)` | Agrega un nuevo nodo | `addNode('nuevo', {message: "...", options: [...]})` |
| `removeNode(nodeId)` | Elimina un nodo | `removeNode('nodo_eliminar')` |
| `updateNodeOptions(nodeId, newOptions)` | Actualiza opciones de un nodo | `updateNodeOptions('start', [{text: "...", next: "..."}])` |
| `updateActions(newActions)` | Actualiza acciones personalizadas | `updateActions({nueva_accion: () => {...}})` |
| `reloadFromAPI()` | Recarga desde la API configurada | `reloadFromAPI()` |
| `stopAutoUpdate()` | Detiene actualización automática | `stopAutoUpdate()` |
| `startAutoUpdate()` | Inicia actualización automática | `startAutoUpdate()` |

### Estructura del Árbol de Decisiones

```javascript
const decisionTree = {
    "nodo_id": {
        message: "Mensaje que se muestra al usuario",
        options: [
            {
                text: "Texto del botón",
                next: "siguiente_nodo" // Navegar a otro nodo
            },
            {
                text: "Otra opción",
                action: "accion_personalizada" // Ejecutar acción
            }
        ]
    }
};
```

### Estructura de Opciones

```javascript
{
    text: "Texto visible del botón",
    next: "id_del_siguiente_nodo", // Opcional: navegar a otro nodo
    action: "nombre_de_la_accion"  // Opcional: ejecutar acción
}
```

### Estructura del Archivo JSON

El archivo `decision-tree.json` debe tener esta estructura:

```json
{
  "tree": {
    "start": {
      "message": "Mensaje inicial",
      "options": [
        {"text": "Opción 1", "next": "nodo1"},
        {"text": "Opción 2", "action": "accion1"}
      ]
    }
  },
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2024-01-15T10:00:00Z",
    "description": "Descripción del árbol de decisiones"
  },
  "config": {
    "autoUpdate": true,
    "updateInterval": 300000,
    "cacheTime": 600000
  }
}
```

## 🌐 Integración con API y GitHub CDN

### Opción 1: GitHub CDN (Recomendado)

La forma más fácil es usar GitHub como CDN para tu archivo JSON:

#### 1. Sube tu JSON a GitHub
Crea un repositorio y sube el archivo `decision-tree.json`

#### 2. Configura el widget
```html
<script>
window.decisionChatConfig = {
    apiUrl: 'https://raw.githubusercontent.com/TU_USUARIO/TU_REPO/main/decision-tree.json',
    updateInterval: 300000 // 5 minutos
};
</script>
<script src="widget.js"></script>
```

#### URLs Alternativas
- **GitHub Raw:** `https://raw.githubusercontent.com/TU_USUARIO/TU_REPO/main/decision-tree.json`
- **jsDelivr CDN:** `https://cdn.jsdelivr.net/gh/TU_USUARIO/TU_REPO@main/decision-tree.json`
- **GitHub Pages:** `https://TU_USUARIO.github.io/TU_REPO/decision-tree.json`

### Opción 2: API Personalizada

### Formato de Respuesta de API

```json
{
    "tree": {
        "start": {
            "message": "Mensaje desde API",
            "options": [
                {"text": "Opción 1", "next": "opcion1"},
                {"text": "Opción 2", "action": "accion1"}
            ]
        }
    },
    "actions": {
        "accion1": "function() { /* código */ }"
    }
}
```

### Ejemplo de API

```javascript
// Endpoint: GET /api/decision-tree
{
    "tree": {
        "start": {
            "message": "¡Bienvenido! ¿Qué necesitas?",
            "options": [
                {"text": "Ver productos", "next": "productos"},
                {"text": "Contactar soporte", "action": "contact_support"}
            ]
        },
        "productos": {
            "message": "Nuestros productos disponibles:",
            "options": [
                {"text": "Producto A", "action": "view_product_a"},
                {"text": "Producto B", "action": "view_product_b"},
                {"text": "Volver", "next": "start"}
            ]
        }
    }
}
```

## 🎯 Casos de Uso

### 1. E-commerce Dinámico

```javascript
// Actualizar productos en tiempo real
function updateProducts(products) {
    const options = products.map(product => ({
        text: product.name,
        action: `view_product_${product.id}`
    }));
    
    window.decisionChatWidget.updateNodeOptions('productos', options);
}

// Agregar acciones para cada producto
const productActions = {};
products.forEach(product => {
    productActions[`view_product_${product.id}`] = () => {
        window.open(`/product/${product.id}`, '_blank');
    };
});

window.decisionChatWidget.updateActions(productActions);
```

### 2. Chat de Soporte Inteligente

```javascript
// Cargar FAQ dinámicamente
async function loadFAQ() {
    const response = await fetch('/api/faq');
    const faqs = await response.json();
    
    const faqOptions = faqs.map(faq => ({
        text: faq.question,
        next: `faq_${faq.id}`
    }));
    
    window.decisionChatWidget.updateNodeOptions('faq_menu', faqOptions);
    
    // Agregar nodos para cada FAQ
    faqs.forEach(faq => {
        window.decisionChatWidget.addNode(`faq_${faq.id}`, {
            message: faq.answer,
            options: [
                {text: "¿Te ayudó?", "action": `rate_faq_${faq.id}`},
                {text: "Volver al menú", "next": "faq_menu"}
            ]
        });
    });
}
```

### 3. Sistema de Reservas

```javascript
// Actualizar horarios disponibles
function updateAvailableSlots(slots) {
    const slotOptions = slots.map(slot => ({
        text: `${slot.time} - ${slot.available ? 'Disponible' : 'Ocupado'}`,
        action: slot.available ? `book_slot_${slot.id}` : 'slot_unavailable'
    }));
    
    window.decisionChatWidget.updateNodeOptions('horarios', slotOptions);
}
```

## 🎨 Personalización

### Estilos CSS

El widget usa Shadow DOM, pero puedes personalizar estilos globales:

```css
/* Personalizar colores principales */
:root {
    --widget-primary-color: #336090;
    --widget-secondary-color: #2a4f7a;
    --widget-background: #ffffff;
}
```

### Acciones Personalizadas

```javascript
// Definir acciones personalizadas
const customActions = {
    open_calendar: () => {
        // Abrir calendario de reservas
        window.open('/calendar', '_blank');
    },
    send_email: () => {
        // Enviar email
        window.location.href = 'mailto:soporte@empresa.com';
    },
    track_event: (eventName) => {
        // Tracking de eventos
        gtag('event', eventName);
    }
};

window.decisionChatWidget.updateActions(customActions);
```

## 🔄 Actualización Automática

### Configurar actualización automática

```javascript
window.decisionChatConfig = {
    apiUrl: 'https://api.ejemplo.com/tree',
    updateInterval: 30000 // Actualizar cada 30 segundos
};
```

### Control manual

```javascript
// Detener actualización automática
window.decisionChatWidget.stopAutoUpdate();

// Iniciar actualización automática
window.decisionChatWidget.startAutoUpdate();

// Recargar manualmente desde API
window.decisionChatWidget.reloadFromAPI();
```

## 📱 Responsive Design

El widget es completamente responsive y se adapta automáticamente:

- **Desktop**: 300px de ancho, posicionado en esquina inferior derecha
- **Tablet**: Se ajusta al ancho disponible (máximo 350px)
- **Mobile**: Ocupa casi todo el ancho de la pantalla

## 🛠️ Debugging

### Ver el árbol actual

```javascript
// En la consola del navegador
console.log(window.decisionChatWidget.getTree());
```

### Verificar estado

```javascript
// Verificar si el widget está cargado
if (window.decisionChatWidget) {
    console.log('Widget cargado correctamente');
} else {
    console.log('Widget no está disponible');
}
```

## 🚨 Manejo de Errores

El widget maneja errores automáticamente:

- **Error de API**: Usa el árbol por defecto
- **Error de configuración**: Usa configuración por defecto
- **Error de red**: Continúa funcionando con datos locales

## 📦 Ejemplos Prácticos

### Ejemplo 1: Configuración Simple con GitHub

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Sitio Web</title>
</head>
<body>
    <h1>Bienvenido a mi sitio</h1>
    
    <!-- Configuración del widget con GitHub CDN -->
    <script>
        window.decisionChatConfig = {
            apiUrl: 'https://raw.githubusercontent.com/TU_USUARIO/TU_REPO/main/decision-tree.json',
            updateInterval: 300000 // 5 minutos
        };
    </script>
    
    <!-- Widget -->
    <script src="widget.js"></script>
</body>
</html>
```

### Ejemplo 2: Configuración Avanzada con API Personalizada

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Sitio Web</title>
</head>
<body>
    <h1>Bienvenido a mi sitio</h1>
    
    <!-- Configuración del widget -->
    <script>
        window.decisionChatConfig = {
            apiUrl: 'https://mi-api.com/chat-tree',
            updateInterval: 60000,
            initialTree: {
                start: {
                    message: "¡Hola! ¿En qué puedo ayudarte?",
                    options: [
                        {text: "Ver productos", next: "productos"},
                        {text: "Contactar soporte", action: "contact_support"}
                    ]
                }
            }
        };
    </script>
    
    <!-- Widget -->
    <script src="widget.js"></script>
    
    <!-- Lógica personalizada -->
    <script>
        // Agregar acciones personalizadas
        window.decisionChatWidget.updateActions({
            contact_support: () => {
                window.open('https://wa.me/123456789', '_blank');
            }
        });
        
        // Actualizar productos dinámicamente
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                const options = products.map(p => ({
                    text: p.name,
                    action: `view_product_${p.id}`
                }));
                
                window.decisionChatWidget.updateNodeOptions('productos', options);
            });
    </script>
</body>
</html>
```

### Ejemplo 3: Configuración con Atributos HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Mi Sitio Web</title>
</head>
<body>
    <h1>Bienvenido a mi sitio</h1>
    
    <!-- Widget con configuración en atributos -->
    <script src="widget.js" 
            data-api-url="https://raw.githubusercontent.com/TU_USUARIO/TU_REPO/main/decision-tree.json"
            data-update-interval="300000">
    </script>
</body>
</html>
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**¡Disfruta usando tu widget de chat dinámico! 🎉** 