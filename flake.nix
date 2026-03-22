{
  description = "Entorno de desarrollo para Annutarium - El Segundo Cerebro Gamificado";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            allowUnfree = true; # Licencia liberada para herramientas propietarias e IAs
          };
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            kiro
            xdg-utils # Necesario para abrir el navegador (ej: al hacer login)
	    brave

	    # Servidor local estable y mantenido (reemplazo de live-server)
            nodePackages.http-server
            
            # Entorno base de Node.js (por si tu herramienta de IA o LSPs lo requieren)
            nodejs_22

            # Tailwind CSS CLI (Para la fase de producción cuando quitemos el CDN)
            tailwindcss

            # Control de versiones
            git

            # Herramientas de manipulación de datos y red para el panel hacker
            jq
            curl
          ];

          shellHook = ''
            echo "======================================================"
            echo "🌌 Bienvenido a Annutarium Dev Environment 🌌"
            echo "Lóng Zhé al mando. Entorno NixOS inicializado."
            echo "======================================================"
            echo "Herramientas disponibles en este sub-espacio:"
            echo " - kiro        : AI-First IDE listo para compilar tu voluntad."
            echo " - http-server : Servidor local estático."
            echo " - tailwindcss : Compilador de estilos."
            echo " - git         : Control de versiones activo."
            echo "======================================================"
            
            # Alias rápido para arrancar el entorno de pruebas desactivando la caché (-c-1)
            alias iniciar="http-server -c-1 ."

            # Variable de entorno para que el IDE sepa qué navegador usar
            export BROWSER=brave
          '';
        };
      }
    );
}
