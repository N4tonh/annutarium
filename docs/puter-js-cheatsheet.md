| Módulo / Categoría | Función | Descripción |
| :--- | :--- | :--- |
| **Inteligencia Artificial (AI)** | `puter.ai.chat()` | Permite chatear con modelos de IA como GPT-4, Claude y Gemini. |
| | `puter.ai.txt2img()` | Genera imágenes a partir de descripciones de texto. |
| | `puter.ai.txt2speech()` | Convierte texto en audio utilizando voces naturales. |
| | `puter.ai.img2txt()` | Realiza OCR para extraer texto de imágenes o análisis visual. |
| | `puter.ai.speech2txt()` | Transcribe grabaciones de audio a texto. |
| | `puter.ai.txt2vid()` | Genera video a partir de instrucciones de texto. |
| | `puter.ai.speech2speech()` | Cambia la voz en un audio manteniendo el contenido lingüístico. |
| | `puter.ai.listModels()` | Enumera todos los modelos de IA disponibles en la plataforma. |
| **Almacenamiento (FS)** | `puter.fs.write()` | Escribe o crea un archivo en el almacenamiento en la nube. |
| | `puter.fs.read()` | Lee el contenido de un archivo guardado en la nube. |
| | `puter.fs.mkdir()` | Crea un nuevo directorio en el sistema de archivos. |
| | `puter.fs.readdir()` | Lista el contenido de un directorio específico. |
| | `puter.fs.delete()` | Elimina un archivo o directorio de la nube. |
| | `puter.fs.rename()` | Cambia el nombre de un archivo o directorio existente. |
| | `puter.fs.copy()` | Crea una copia de un archivo en una nueva ubicación. |
| | `puter.fs.move()` | Mueve un archivo o directorio a una nueva ruta. |
| | `puter.fs.stat()` | Obtiene metadatos de un archivo como tamaño y fecha de creación. |
| | `puter.fs.upload()` | Facilita la carga de archivos locales al almacenamiento de Puter. |
| **Base de Datos (KV)** | `puter.kv.set()` | Guarda un valor asociado a una clave en la base de datos NoSQL. |
| | `puter.kv.get()` | Recupera el valor de una clave específica. |
| | `puter.kv.incr()` | Incrementa un valor numérico de forma atómica. |
| | `puter.kv.decr()` | Decrementa un valor numérico de forma atómica. |
| | `puter.kv.del()` | Elimina un par clave-valor de la base de datos. |
| | `puter.kv.list()` | Enumera claves que coinciden con un patrón glob determinado. |
| | `puter.kv.update()` | Realiza actualizaciones parciales en objetos usando notación de puntos. |
| | `puter.kv.add()` | Añade elementos a un array almacenado bajo una clave. |
| | `puter.kv.expire()` | Establece un tiempo de expiración para una clave en segundos. |
| | `puter.kv.flush()` | Elimina todos los datos de la aplicación para el usuario actual. |
| **Autenticación (Auth)** | `puter.auth.signIn()` | Inicia el proceso de autenticación del usuario. |
| | `puter.auth.signOut()` | Cierra la sesión del usuario actual. |
| | `puter.auth.isSignedIn()` | Comprueba si el usuario tiene una sesión activa. |
| | `puter.auth.getUser()` | Obtiene la información del perfil del usuario autenticado. |
| **Interfaz de Usuario (UI)** | `puter.ui.alert()` | Muestra un cuadro de diálogo de alerta con el estilo de Puter. |
| | `puter.ui.notify()` | Envía notificaciones de escritorio al usuario. |
| | `puter.ui.prompt()` | Muestra un cuadro de diálogo para solicitar entrada de texto. |
| | `puter.ui.createWindow()` | Crea una nueva ventana dentro del entorno de escritorio de Puter. |
| | `puter.ui.setWindowTitle()` | Cambia el título de la ventana de la aplicación. |
| | `puter.ui.setWindowSize()` | Define las dimensiones de la ventana de la aplicación. |
| | `puter.ui.showOpenFilePicker()` | Abre un selector para que el usuario elija archivos para abrir. |
| | `puter.ui.showSaveFilePicker()` | Abre un selector para guardar archivos en el sistema. |
| | `puter.ui.showSpinner()` | Muestra un indicador visual de carga u operación en curso. |
| | `puter.ui.hideSpinner()` | Oculta el indicador visual de carga. |
| | `puter.ui.exit()` | Cierra la aplicación de forma limpia. |
| **Hosting** | `puter.hosting.create()` | Publica un sitio web estático bajo un subdominio `.puter.site`. |
| | `puter.hosting.list()` | Lista todos los despliegues de hosting activos del usuario. |
| | `puter.hosting.delete()` | Elimina un despliegue de hosting específico. |
| **Networking** | `puter.net.fetch()` | Realiza peticiones HTTP evitando las restricciones de CORS. |
| | `puter.net.Socket` | Proporciona acceso a conexiones de socket TCP crudas. |
| **Utilidades** | `puter.print()` | Imprime información directamente en la consola de Puter. |
| | `puter.randName()` | Genera un nombre aleatorio único. |

| Módulo / Categoría | Función | Descripción |
| :--- | :--- | :--- |
| **Inteligencia Artificial (AI)** | `puter.ai.listModelProviders()` | Enumera los proveedores de modelos de IA disponibles (OpenAI, Anthropic, etc.). |
| **Autenticación (Auth)** | `puter.auth.getMonthlyUsage()` | Devuelve las estadísticas de uso mensual de recursos del usuario. |
| | `puter.auth.getDetailedAppUsage()` | Proporciona un desglose detallado del consumo de recursos por aplicación. |
| **Almacenamiento (FS)** | `puter.fs.getReadURL()` | Genera una URL de acceso directo para leer el contenido de un archivo. |
| **Serverless Workers** | `puter.workers.create()` | Despliega un nuevo worker serverless para ejecutar lógica de backend. |
| | `puter.workers.list()` | Lista todos los workers desplegados por el usuario. |
| | `puter.workers.delete()` | Elimina un worker serverless de la plataforma. |
| | `puter.workers.get()` | Obtiene información específica sobre un worker. |
| | `puter.workers.exec()` | Ejecuta manualmente un worker serverless. |
| **Base de Datos (KV)** | `puter.kv.expireAt()` | Define la expiración de una clave usando una marca de tiempo (timestamp) específica. |
| | `puter.kv.remove()` | Elimina elementos específicos de un objeto o campos por su ruta (dot notation). |
| **Networking** | `puter.net.TLSSocket` | Permite establecer conexiones de socket TCP cifradas mediante TLS. |
| | `puter.peer.serve()` | Configura la instancia para escuchar conexiones entrantes de pares (P2P). |
| | `puter.peer.connect()` | Inicia una conexión P2P directa con otro par. |
| | `puter.peer.ensureTurnRelays()` | Asegura la disponibilidad de servidores relay TURN para atravesar NAT en P2P. |
| **Interfaz de Usuario (UI)** | `puter.ui.authenticateWithPuter()` | Realiza la autenticación del usuario dentro de la interfaz del sistema. |
| | `puter.ui.contextMenu()` | Crea y gestiona menús contextuales personalizados. |
| | `puter.ui.getLanguage()` | Obtiene el código de idioma o locale actual de la interfaz. |
| | `puter.ui.hideWindow()` | Oculta la ventana de la aplicación de la vista del usuario. |
| | `puter.ui.showWindow()` | Hace visible una ventana que estaba previamente oculta. |
| | `puter.ui.launchApp()` | Inicia la ejecución de otra aplicación dentro del entorno de Puter. |
| | `puter.ui.parentApp()` | Proporciona información sobre la aplicación de origen si fue lanzada por otra. |
| | `puter.ui.setMenubar()` | Configura una barra de menús personalizada para la aplicación. |
| | `puter.ui.socialShare()` | Facilita la acción de compartir contenido a través de redes sociales. |
| | `puter.ui.setWindowPosition()` | Define las coordenadas exactas de la ventana en el escritorio de Puter. |
| | `puter.ui.setWindowHeight()` | Ajusta específicamente la altura de la ventana de la aplicación. |
| | `puter.ui.setWindowWidth()` | Ajusta específicamente la anchura de la ventana de la aplicación. |
| | `puter.ui.setWindowX()` / `Y()` | Modifica de forma independiente la posición horizontal o vertical de la ventana. |
| | `puter.ui.showColorPicker()` | Despliega un selector de colores nativo para el usuario. |
| | `puter.ui.showFontPicker()` | Despliega un diálogo nativo para la selección de fuentes. |
| | `puter.ui.showDirectoryPicker()` | Permite seleccionar una carpeta del sistema de archivos mediante un diálogo. |
| | `puter.ui.on()` | Suscribe la aplicación a eventos específicos de la interfaz de usuario. |
| | `puter.ui.onWindowClose()` | Define una acción a realizar cuando el usuario intenta cerrar la ventana. |
| | `puter.ui.onLaunchedWithItems()` | Maneja los datos cuando la aplicación se abre con archivos o ítems. |
| | `puter.ui.wasLaunchedWithItems()` | Verifica si la aplicación fue iniciada mediante la apertura de ítems específicos. |
| **Permisos (Perms)** | `puter.perms.request()` | Solicita al usuario permisos específicos para acceder a sus datos o recursos. |
| | `puter.perms.requestEmail()` | Solicita acceso a la dirección de correo electrónico del usuario. |
| | `puter.perms.requestReadDesktop()` | Pide permiso para leer archivos ubicados en el escritorio del usuario. |
| | `puter.perms.requestReadDocuments()` | Pide permiso para acceder a la carpeta de documentos. |
| | `puter.perms.requestReadPictures()` | Pide permiso para leer la carpeta de imágenes del usuario. |
| **Gestión de Apps** | `puter.apps.create()` | Registra una nueva aplicación dentro de la plataforma de desarrollo. |
| | `puter.apps.list()` | Enumera todas las aplicaciones propiedad del usuario. |
| | `puter.apps.delete()` | Elimina permanentemente una aplicación registrada. |
| | `puter.apps.update()` | Modifica las propiedades y configuración de una aplicación existente. |
| **Utilidades** | `puter.env` | Proporciona acceso a las variables de entorno en el contexto actual. |
| | `puter.appID` | Devuelve el identificador único asignado a la aplicación en ejecución. |

Para crear una aplicación en **Puter.js** de manera eficiente y sin errores, un agente de IA debe seguir estas recomendaciones basadas en la arquitectura y las mejores prácticas del SDK:

### 1. Gestión de Autenticación y Permisos
*   **Aprovecha la autenticación automática:** Puter.js activa el inicio de sesión automáticamente cuando el código intenta acceder a servicios en la nube. Sin embargo, para una mejor experiencia de usuario, es recomendable **activar `puter.auth.signIn()` mediante una acción directa del usuario** (como un clic en un botón) para evitar que los bloqueadores de ventanas emergentes interfieran.
*   **Principio de mínimo privilegio:** Utiliza el módulo `puter.perms` para solicitar solo los permisos específicos que la app necesite (acceso al escritorio, email, documentos, etc.), garantizando que el usuario mantenga el control de sus datos.
*   **Diferenciación de entornos:** Si el agente programa para Node.js, debe recordar que **la autenticación no es automática** y requiere el uso de `puter.init()` con un token de acceso o el flujo de `getAuthToken()`.

### 2. Uso Eficiente de la Inteligencia Artificial
*   **Sin gestión de llaves de API:** El agente no debe intentar configurar variables de entorno para llaves de OpenAI o Anthropic; Puter.js actúa como intermediario y las gestiona internamente.
*   **Optimización de la interfaz:** Se recomienda usar el parámetro `{ stream: true }` en `puter.ai.chat()` para mostrar respuestas en tiempo real, lo que mejora significativamente la percepción de fluidez en la UI.
*   **Modo de prueba para imágenes:** Al desarrollar funciones de generación de imágenes con `puter.ai.txt2img()`, utiliza el parámetro `testMode: true` para devolver una imagen de muestra sin consumir créditos del usuario durante las pruebas.

### 3. Diseño de la Base de Datos (KV Store)
*   **Diseño basado en la lectura:** En el almacén Key-Value, las claves deben diseñarse según cómo se planea leer la información. Estructura las claves con prefijos (ej. `usuario:123:post:456`) para poder filtrarlas eficientemente con `puter.kv.list()` usando patrones glob.
*   **Operaciones atómicas:** Para contadores o datos compartidos, utiliza `puter.kv.incr()` y `decr()` en lugar de leer, modificar y volver a escribir, para evitar condiciones de carrera.
*   **Actualizaciones parciales:** Evita sobrescribir objetos grandes. Usa `puter.kv.update()` con notación de puntos para modificar campos específicos, ahorrando ancho de banda y evitando errores de concurrencia.

### 4. Almacenamiento y Networking
*   **Interfaz POSIX simplificada:** El módulo `puter.fs` maneja automáticamente la creación de directorios padres que falten al escribir archivos, lo que reduce el código repetitivo de validación.
*   **Bypass de CORS:** Cuando necesites consultar APIs externas que no tengan habilitado el intercambio de recursos de origen cruzado, utiliza `puter.net.fetch()` en lugar del `fetch` nativo del navegador.

### 5. Consideraciones del Modelo Económico
*   **Modelo "User-Pays":** El agente debe diseñar la app bajo la premisa de que **el desarrollador paga $0 por infraestructura**. Cada usuario autenticado aporta sus propios recursos (almacenamiento, créditos de IA), lo que elimina la necesidad de implementar sistemas complejos de anti-abuso o cuotas de uso en el lado del desarrollador.

### 6. Integración con la Interfaz de Usuario
*   **Consistencia visual:** Para aplicaciones que corren dentro del escritorio de Puter, utiliza `puter.ui.alert()`, `notify()` y `prompt()` en lugar de las funciones nativas de JavaScript para mantener una estética coherente con el sistema operativo.
*   **Gestión de ventanas:** Si la aplicación requiere múltiples ventanas, usa `puter.ui.createWindow()` y gestiona sus dimensiones y títulos con las funciones específicas de `puter.ui` para asegurar una integración fluida con el entorno de escritorio.