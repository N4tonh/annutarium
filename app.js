// Annutarium Core Application
class AnnutariumApp {
    constructor() {
        this.state = {
            auth: { signedIn: false, user: null },
            ui: { activePanel: 0 }, // 0=explorer, 1=editor
            file: { currentPath: null, content: '' },
            editor: { debounceTimer: null },
            fileExplorer: { items: [], loading: false, currentPath: '/', expandedPaths: new Set(), error: false },
            editor: { debounceTimer: null }
        };
        this.markdownIt = window.markdownit();
        
        // Initialize the app
        this.init();
    }

    // Initialize the application
    async init() {
        // Check if user is already signed in
        try {
            const user = await puter.auth.getUser();
            if (user) {
                this.state.auth.user = user;
                this.state.auth.signedIn = true;
                await this.loadFileExplorer();
            } else {
                this.showAuthButton();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showAuthButton();
        }
    }

    // Authentication methods
    showAuthButton() {
        const authDiv = document.createElement('div');
        // Performance-conscious: Using backdrop-blur only on small auth container
        authDiv.className = 'flex items-center justify-center bg-gray-800/50 backdrop-blur-sm';
        authDiv.innerHTML = `
            <button id="signInBtn" 
                    class="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-semibold 
                           rounded-lg transition-colors flex items-center space-x-2">
                Sign in to Puter
            </button>
        `;
        document.body.appendChild(authDiv);
        
        document.getElementById('signInBtn').addEventListener('click', async () => {
            try {
                this.state.auth.user = await puter.auth.signIn();
                this.state.auth.signedIn = true;
                authDiv.remove();
                await this.loadFileExplorer();
                this.render();
            } catch (error) {
                console.error('Auth error:', error);
                puter.ui.alert('Authentication failed. Please try again.');
            }
        });
    }

    async loadUserData() {
        try {
            const user = await puter.auth.getUser();
            this.state.auth.user = user;
            return user;
        } catch (error) {
            console.error('Failed to get user data:', error);
            puter.ui.alert('Failed to get user data');
            return null;
        }
    }
    
    // Render method to update UI based on state
    render() {
        // This will be implemented as we add more components
        // For now, it's a placeholder
    }
}