# 🚀 Guía Paso a Paso: Widget con GitHub CDN

## 📋 Pasos para Configurar tu Widget con GitHub

### Paso 1: Crear Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) y crea una cuenta si no tienes una
2. Haz clic en "New repository" (Nuevo repositorio)
3. Dale un nombre como `decision-chat-config`
4. Hazlo público (para que sea accesible)
5. Haz clic en "Create repository"

### Paso 2: Subir el Archivo JSON

1. En tu repositorio nuevo, haz clic en "Add file" → "Create new file"
2. Nombra el archivo: `decision-tree.json`
3. Copia y pega el contenido del archivo `decision-tree.json` que creamos
4. Haz clic en "Commit new file"

### Paso 3: Obtener la URL

1. Una vez subido el archivo, haz clic en él
2. Haz clic en el botón "Raw" (en la esquina superior derecha)
3. Copia la URL que aparece en el navegador
4. La URL será algo como: `https://raw.githubusercontent.com/TU_USUARIO/TU_REPO/main/decision-tree.json`

### Paso 4: Configurar tu Sitio Web

En tu archivo HTML, agrega este código:

```html
<!-- Configuración del widget -->
<script>
window.decisionChatConfig = {
    apiUrl: 'TU_URL_DE_GITHUB_AQUI',
    updateInterval: 300000 // 5 minutos
};
</script>

<!-- Widget -->
<script src="widget.js"></script>
```

### Paso 5: Probar

1. Abre tu sitio web
2. Haz clic en el botón del chat (💬)
3. ¡El widget debería cargar con tu configuración!

## 🔄 Actualizar la Configuración

Para cambiar las opciones del chat:

1. Ve a tu repositorio en GitHub
2. Haz clic en el archivo `decision-tree.json`
3. Haz clic en el ícono de lápiz (editar)
4. Modifica el contenido
5. Haz clic en "Commit changes"
6. El widget se actualizará automáticamente en 5 minutos

## 📝 Ejemplo de Configuración Personalizada

Aquí tienes un ejemplo de cómo personalizar tu `decision-tree.json`:

```json
{
  "tree": {
    "start": {
      "message": "¡Hola! Bienvenido a mi empresa. ¿En qué puedo ayudarte?",
      "options": [
        { "text": "Ver nuestros servicios", "next": "servicios" },
        { "text": "Contactar ventas", "action": "contact_sales" },
        { "text": "Soporte técnico", "next": "soporte" }
      ]
    },
    "servicios": {
      "message": "Ofrecemos los siguientes servicios:",
      "options": [
        { "text": "Desarrollo web", "action": "web_dev" },
        { "text": "Diseño gráfico", "action": "graphic_design" },
        { "text": "Marketing digital", "action": "digital_marketing" },
        { "text": "Volver al inicio", "next": "start" }
      ]
    },
    "soporte": {
      "message": "¿Qué tipo de soporte necesitas?",
      "options": [
        { "text": "Problema técnico", "action": "tech_support" },
        { "text": "Facturación", "action": "billing_support" },
        { "text": "Volver al inicio", "next": "start" }
      ]
    }
  },
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2024-01-15T10:00:00Z",
    "description": "Chat de soporte para mi empresa"
  },
  "config": {
    "autoUpdate": true,
    "updateInterval": 300000,
    "cacheTime": 600000
  }
}
```

## 🎯 Casos de Uso Comunes

### Para una Tienda Online
```json
{
  "tree": {
    "start": {
      "message": "¡Bienvenido a nuestra tienda! ¿Qué buscas?",
      "options": [
        { "text": "Ver productos", "next": "productos" },
        { "text": "Ofertas especiales", "next": "ofertas" },
        { "text": "Atención al cliente", "action": "customer_service" }
      ]
    }
  }
}
```

### Para un Restaurante
```json
{
  "tree": {
    "start": {
      "message": "¡Hola! Bienvenido a nuestro restaurante. ¿Qué necesitas?",
      "options": [
        { "text": "Ver menú", "action": "view_menu" },
        { "text": "Hacer reserva", "action": "make_reservation" },
        { "text": "Horarios", "action": "view_hours" }
      ]
    }
  }
}
```

### Para una Clínica Médica
```json
{
  "tree": {
    "start": {
      "message": "¡Bienvenido a nuestra clínica! ¿En qué podemos ayudarte?",
      "options": [
        { "text": "Agendar cita", "action": "schedule_appointment" },
        { "text": "Ver especialidades", "next": "especialidades" },
        { "text": "Información de contacto", "action": "contact_info" }
      ]
    }
  }
}
```

## 🔧 URLs Alternativas

Si la URL de GitHub Raw no funciona, puedes usar estas alternativas:

### jsDelivr CDN
```
https://cdn.jsdelivr.net/gh/TU_USUARIO/TU_REPO@main/decision-tree.json
```

### GitHub Pages (si tienes Pages activado)
```
https://TU_USUARIO.github.io/TU_REPO/decision-tree.json
```

## 🚨 Solución de Problemas

### El widget no carga
- Verifica que la URL del JSON sea correcta
- Asegúrate de que el repositorio sea público
- Revisa la consola del navegador (F12) para errores

### No se actualiza automáticamente
- Verifica que `updateInterval` esté configurado
- Asegúrate de que el JSON tenga la estructura correcta
- Revisa que no haya errores en la consola

### Error de CORS
- Usa la URL de GitHub Raw o jsDelivr
- Asegúrate de que el repositorio sea público

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que la URL del JSON sea accesible
3. Asegúrate de que el JSON tenga la estructura correcta
4. Prueba con una URL alternativa

---

**¡Con estos pasos tendrás tu widget funcionando con GitHub CDN en minutos! 🎉** 