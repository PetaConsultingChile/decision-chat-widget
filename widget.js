(function () {
    function createWidget() {
      // Crear contenedor principal
      const container = document.createElement('div');
      const shadow = container.attachShadow({ mode: 'open' });
  
      // Estilos del widget
      const style = document.createElement('style');
      style.textContent = `
        .widget-box {
          font-family: Arial, sans-serif;
          background: #fff;
          border: 1px solid #ccc;
          padding: 16px;
          width: 250px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border-radius: 8px;
          text-align: center;
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }
        .widget-box button {
          background: #007BFF;
          color: #fff;
          border: none;
          padding: 10px 16px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
        }
        .widget-box button:hover {
          background: #0056b3;
        }
      `;
  
      // Contenido del widget
      const wrapper = document.createElement('div');
      wrapper.className = 'widget-box';
      wrapper.innerHTML = `
        <h3>Mi Widget</h3>
        <p>Hola, soy un widget básico</p>
        <button id="widgetBtn">Click aquí</button>
      `;
  
      // Evento del botón
      wrapper.querySelector('#widgetBtn').addEventListener('click', () => {
        alert('¡Botón del widget presionado!');
      });
  
      // Adjuntar al shadow DOM
      shadow.appendChild(style);
      shadow.appendChild(wrapper);
  
      // Añadir al body
      document.body.appendChild(container);
    }
  
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidget);
    } else {
      createWidget();
    }
  })();
  