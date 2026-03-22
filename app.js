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
                this.setupSlidingPanes();
            } else {
                this.showAuthButton();
                // Still setup sliding panes for UI structure
                this.setupSlidingPanes();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showAuthButton();
            // Still setup sliding panes for UI structure
            this.setupSlidingPanes();
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
    
    // Sliding panes methods
    setupSlidingPanes() {
        this.panesContainer = document.getElementById('panesContainer');
        this.explorerPanel = document.getElementById('explorerPanel');
        this.editorPanel = document.getElementById('editorPanel');
        
        // Set initial state
        this.updatePanelVisibility();
        
        // Setup scroll snapping for desktop
        this.panesContainer.addEventListener('scroll', (e) => {
            const scrollLeft = e.target.scrollLeft;
            const panelWidth = this.explorerPanel.offsetWidth;
            this.state.ui.activePanel = Math.round(scrollLeft / panelWidth);
            this.updatePanelVisibility();
        });
        
        // Setup touch gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.panesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.panesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left -> next panel
                this.nextPanel();
            } else {
                // Swiped right -> previous panel
                this.prevPanel();
            }
        }
    }

    nextPanel() {
        if (this.state.ui.activePanel < 1) { // Assuming 2 panels (0 and 1)
            this.state.ui.activePanel++;
            this.updatePanelVisibility();
            this.panesContainer.scrollTo({
                left: this.state.ui.activePanel * this.explorerPanel.offsetWidth,
                behavior: 'smooth'
            });
        }
    }

    prevPanel() {
        if (this.state.ui.activePanel > 0) {
            this.state.ui.activePanel--;
            this.updatePanelVisibility();
            this.panesContainer.scrollTo({
                left: this.state.ui.activePanel * this.explorerPanel.offsetWidth,
                behavior: 'smooth'
            });
        }
    }

    updatePanelVisibility() {
        // For mobile, we use transform to hide/show panels
        if (window.innerWidth < 640) {
            const offset = -this.state.ui.activePanel * 100;
            this.panesContainer.style.transform = `translateX(${offset}vw)`;
        }
        // On desktop, scroll snapping handles visibility, but we can still update active state for UI
    }
    
    // Render method to update UI based on state
    render() {
        // This will be implemented as we add more components
        // For now, it's a placeholder
    }
}