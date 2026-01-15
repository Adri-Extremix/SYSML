# Editor de Diagramas SysMLv2
Este proyecto es un editor de diagramas interactivo basado en la web para SysMLv2. Permite crear, visualizar y organizar nodos de clase con atributos y relaciones utilizando una interfaz intuitiva basada en nodos.

## 🚀 Características

- **Editor Interactivo:** Arrastra y suelta nodos, crea conexiones y edita contenido en tiempo real.
- **Auto-Layout:** Organización automática de los diagramas utilizando el algoritmo de Dagre para una visualización clara.
- **Tipos de Nodos Personalizados:** Soporte para nodos de clase con compartimentos para atributos y métodos.
- **Gestión de Archivos:** Guarda tus diagramas localmente en formato JSON o sincronízalos con un servidor backend.
- **Interfaz Moderna:** Construido con React y Material UI para una experiencia de usuario fluida.
- **Mini-mapa y Controles:** Navegación facilitada por un mini-mapa, zoom y controles de ajuste de vista.

## 🛠️ Tecnologías Utilizadas

- **React 19**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Herramienta de construcción rápida para desarrollo frontend.
- **@xyflow/react (React Flow)**: Potente motor para visualización de diagramas basados en nodos.
- **TypeScript**: Tipado estático para un desarrollo más robusto y seguro.
- **Dagre**: Biblioteca para el cálculo de layouts jerárquicos.
- **MUI (Material UI)**: Sistema de diseño y componentes UI.

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Adri-Extremix/SYSML>
   cd SYSML
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🖥️ Uso

- **Añadir Nodos:** Utiliza el menú lateral (`SideMenu`) para añadir nuevos nodos de clase al lienzo.
- **Conectar Nodos:** Haz clic y arrastra desde los manejadores (puntos en los bordes) de un nodo a otro para crear relaciones.
- **Auto Layout:** Pulsa el botón "📐 Auto Layout" para organizar automáticamente los nodos de forma jerárquica.
- **Guardar:** Puedes descargar el diagrama como un archivo JSON con el botón "💾 Guardar Diagrama".
- **Backend:** El editor intenta conectarse automáticamente a una API en `http://localhost:5171` para cargar diagramas existentes.

## 📄 Estructura del Proyecto

- `src/api.ts`: Servicios para la comunicación con el servidor backend.
- `src/ClassDiagram.tsx`: Componente principal que gestiona el lienzo de React Flow.
- `src/ClassNode.tsx`: Definición personalizada de los nodos de clase.
- `src/SideMenu.tsx`: Menú de herramientas para añadir elementos al diagrama.
- `src/ButtonEdge.tsx`: Conexiones personalizadas con funcionalidades adicionales.

---
Proyecto desarrollado para la asignatura de **Digitalización de Sistemas Complejos**.
