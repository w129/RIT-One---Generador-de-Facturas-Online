(function() {
    'use strict'; // Habilitar modo estricto para mejor calidad de código

    // --- Configuración de Seguridad (ADVERTENCIA IMPORTANTE) ---
    // ALMACENAR LA CONTRASEÑA DIRECTAMENTE EN EL CÓDIGO JAVASCRIPT DEL LADO DEL CLIENTE
    // ES EXTREMADAMENTE INSEGURO.
    // Cualquiera puede ver el código fuente de la página (incluyendo este archivo)
    // y encontrar la contraseña fácilmente.
    //
    // Este mecanismo es solo una BARRERA SUPERFICIAL y NO DEBE USARSE para proteger
    // información sensible, datos críticos o funcionalidades importantes.
    // La seguridad real REQUIERE autenticación del lado del servidor.
    //
    // Considera esto solo como un disuasivo muy básico.
    const CONTRASEÑA_CORRECTA = 'Az-112835813'; // La contraseña proporcionada
    const MAXIMO_INTENTOS = 3; // Número máximo de intentos permitidos

    // --- Estado Interno ---
    let intentosRestantes = MAXIMO_INTENTOS;

    /**
     * Bloquea completamente el acceso a la página.
     * Reemplaza el contenido del body con un mensaje de acceso denegado.
     * @param {string} mensaje - La razón específica por la que se deniega el acceso.
     */
    function bloquearAccesoTotal(mensaje) {
        console.error("Acceso Denegado:", mensaje); // Registrar en consola para depuración
        alert(`Acceso Denegado: ${mensaje}`); // Notificar al usuario

        // Intenta limpiar el contenido del body y mostrar el mensaje de bloqueo.
        // Usamos requestAnimationFrame para esperar un momento óptimo del navegador.
        requestAnimationFrame(() => {
            try {
                if (document.body) {
                    // Estilos para el mensaje de bloqueo
                    const estilosBloqueo = `
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background-color: #1a1a1a; color: #e0e0e0;
                        display: flex; flex-direction: column; justify-content: center; align-items: center;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        z-index: 10000; text-align: center; padding: 20px; box-sizing: border-box;
                    `;
                    const tituloEstilo = `color: #dc3545; margin-bottom: 20px; font-size: 2em;`;
                    const mensajeEstilo = `color: #ccc; margin-bottom: 30px; font-size: 1.1em;`;
                    const infoEstilo = `font-size: 0.9em; color: #888;`;

                    document.body.innerHTML = `
                        <div style="${estilosBloqueo}">
                            <h1 style="${tituloEstilo}"><i class="fas fa-lock"></i> Acceso Denegado</h1>
                            <p style="${mensajeEstilo}">${mensaje}</p>
                            <p style="${infoEstilo}">La página ha sido bloqueada y su contenido no está disponible.</p>
                        </div>`;
                    document.body.style.overflow = 'hidden'; // Prevenir scroll
                } else {
                    // Fallback si document.body no está listo (menos fiable)
                    document.open();
                    document.write(`
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <title>Acceso Denegado</title>
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                            <style>
                                body { margin: 0; padding: 0; background-color: #1a1a1a; color: #e0e0e0; font-family: 'Segoe UI', sans-serif; overflow: hidden; }
                                .bloqueo-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; box-sizing: border-box; z-index: 10000; }
                                .bloqueo-titulo { color: #dc3545; margin-bottom: 20px; font-size: 2em; }
                                .bloqueo-mensaje { color: #ccc; margin-bottom: 30px; font-size: 1.1em; }
                                .bloqueo-info { font-size: 0.9em; color: #888; }
                            </style>
                        </head>
                        <body>
                            <div class="bloqueo-container">
                                <h1 class="bloqueo-titulo"><i class="fas fa-lock"></i> Acceso Denegado</h1>
                                <p class="bloqueo-mensaje">${mensaje}</p>
                                <p class="bloqueo-info">La página ha sido bloqueada y su contenido no está disponible.</p>
                            </div>
                        </body>
                        </html>`);
                    document.close();
                }
                // Cambiar el título de la pestaña del navegador
                document.title = "Acceso Denegado";
            } catch (error) {
                console.error("Error al intentar bloquear el acceso:", error);
                // Como último recurso, intentar una alerta más persistente
                alert("ERROR CRÍTICO AL BLOQUEAR ACCESO. Por favor, cierre esta pestaña.");
            }
        });

        // Intentar detener la ejecución de otros scripts (puede no ser efectivo)
        // Lanzar un error puede detener algunos scripts, pero se mostrará en la consola.
        // setTimeout(() => { throw new Error("Detención de seguridad: Acceso denegado."); }, 50);
    }

    /**
     * Solicita la contraseña al usuario y la verifica contra la contraseña correcta.
     * Gestiona los intentos fallidos y llama a bloquearAccesoTotal si es necesario.
     */
    function verificarAccesoConPrompt() {
        // Medida anti-phishing muy básica: verificar que no esté en un iframe
        try {
            if (window.self !== window.top) {
                bloquearAccesoTotal("Error de seguridad: La página no puede cargarse dentro de un frame.");
                return;
            }
        } catch (e) {
            // Error de seguridad al acceder a window.top (cross-origin frame)
            bloquearAccesoTotal("Error de seguridad: No se pudo verificar el contexto de la ventana.");
            return;
        }

        while (intentosRestantes > 0) {
            const contraseñaIngresada = prompt(
                `SEGURIDAD REQUERIDA\n\n` +
                `Por favor, introduce la contraseña para continuar.\n` +
                `Intentos restantes: ${intentosRestantes}`
            );

            // Caso 1: El usuario presiona "Cancelar" o cierra el diálogo
            if (contraseñaIngresada === null) {
                bloquearAccesoTotal("Acceso cancelado por el usuario.");
                return; // Salir de la función inmediatamente
            }

            // Caso 2: La contraseña es correcta
            // Comparación simple (insegura, como se advirtió)
            if (contraseñaIngresada === CONTRASEÑA_CORRECTA) {
                console.log("Contraseña correcta. Acceso permitido.");
                // No hacer nada más aquí, permitir que el resto de la página cargue/funcione.
                return; // Salir de la función, acceso concedido
            }

            // Caso 3: La contraseña es incorrecta
            intentosRestantes--;
            if (intentosRestantes > 0) {
                alert(
                    `Contraseña incorrecta.\n` +
                    `Te quedan ${intentosRestantes} intento(s).`
                );
                // El bucle while continuará para el siguiente intento
            } else {
                // Se agotaron los intentos
                bloquearAccesoTotal("Contraseña incorrecta. Has agotado todos tus intentos.");
                return; // Salir de la función, acceso denegado definitivamente
            }
        }

        // Este punto teóricamente no debería alcanzarse si la lógica anterior es correcta,
        // pero se incluye como salvaguarda.
        if (intentosRestantes <= 0) {
             bloquearAccesoTotal("Se ha superado el número máximo de intentos de contraseña.");
        }
    }

    // --- Ejecución Inmediata ---
    // Ejecutar la verificación de acceso tan pronto como este script se cargue.
    // Recordatorio final: Esta es una medida de seguridad CLIENT-SIDE y es inherentemente
    // débil. No confíes en ella para proteger nada valioso.
    verificarAccesoConPrompt();

})(); // Fin de la IIFE (Immediately Invoked Function Expression) para encapsular el código
