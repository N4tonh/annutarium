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
                this.setupFileExplorerEvents();
                this.setupEditor();
                this.setupRadialMenu();
            } else {
                this.showAuthButton();
                // Still setup sliding panes for UI structure
                this.setupSlidingPanes();
                this.setupFileExplorerEvents();
                this.setupEditor();
                this.setupRadialMenu();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showAuthButton();
            // Still setup sliding panes for UI structure
            this.setupSlidingPanes();
            this.setupFileExplorerEvents();
            this.setupEditor();
            this.setupRadialMenu();
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

    // File Explorer Methods
    async loadFileExplorer(path = '/') {
        try {
            const items = await puter.fs.readdir(path);
            // Initialize expanded paths set if not exists
            if (!this.state.fileExplorer.expandedPaths) {
                this.state.fileExplorer.expandedPaths = new Set();
            }
            // Always expand the root path by default
            this.state.fileExplorer.expandedPaths.add('/');
            this.state.fileExplorer = { 
                items: [], 
                loading: false, 
                currentPath: path,
                expandedPaths: this.state.fileExplorer.expandedPaths,
                loading: false, 
                error: false 
            };
            await this.populateFileTree(items, path);
        } catch (error) {
            console.error('Failed to load file explorer:', error);
            this.state.fileExplorer = { 
                items: [], 
                loading: false, 
                currentPath: path,
                expandedPaths: new Set(),
                loading: false, 
                error: true 
            };
        }
        this.render(); // Trigger re-render
    }

    // Builds a tree structure representing the file system hierarchy
    async populateFileTree(items, currentPath) {
        // Sort: directories first, then files, both alphabetically
        const sortedItems = items.sort((a, b) => {
            if (a.is_dir && !b.is_dir) return -1;
            if (!a.is_dir && b.is_dir) return 1;
            return a.name.localeCompare(b.name);
        });
        
        // Add parent directory navigation if not at root
        const pathItems = currentPath === '/' 
            ? sortedItems 
            : [{ name: '..', is_dir: true }, ...sortedItems];
        
        // Convert to tree nodes with metadata for rendering
        this.state.fileExplorer.items = pathItems.map(item => ({
            ...item,
            path: item.name === '..' 
                ? currentPath.split('/').slice(0, -1).join('/') || '/'
                : `${currentPath}/${item.name}`.replace(/\/{2,}/g, '/'),
            type: item.is_dir ? 'directory' : 'file',
            // For .md files, we'll handle icon rendering specially in the UI
            isMd: !item.is_dir && item.name.endsWith('.md')
        }));
        
        this.renderFileTree();
    }

    // Renders the file tree with Apple-inspired aesthetics and semi-rounded hierarchy lines
    renderFileTree() {
        const fileList = document.getElementById('fileList');
        if (!this.state.fileExplorer) {
            fileList.innerHTML = '<p class="text-gray-500">Loading...</p>';
            return;
        }
        
        if (this.state.fileExplorer.error) {
            fileList.innerHTML = '<p class="text-red-400">Failed to load files. Click to retry.</p>';
            fileList.onclick = () => this.loadFileExplorer();
            return;
        }
        
        if (this.state.fileExplorer.items.length === 0) {
            fileList.innerHTML = '<p class="text-gray-500">No files found.</p>';
            return;
        }
        
        // Build indent-based tree representation with proper visual hierarchy
        // We'll implement a simple indent-based approach for the plan
        // In practice, this would use CSS for the semi-rounded connector lines
        let html = '';
        
        // Process items to build tree structure
        // For simplicity in the plan, we'll show current directory contents
        // with visual indicators for expanded state
        this.state.fileExplorer.items.forEach((item, index) => {
            const isLast = index === this.state.fileExplorer.items.length - 1;
            const isExpanded = this.state.fileExplorer.expandedPaths.has(item.path);
            const isDirectory = item.type === 'directory';
            
            // Special handling for parent directory item
            if (item.name === '..') {
                html += `
                    <div class="file-item flex items-center p-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors file-parent"
                         data-path="${item.path}" data-type="directory">
                        <div class="tree-connector"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 flex-shrink-0 shrink-0" 
                             fill="#8b5cf6" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span class="flex-1 truncate">../ (Volver)</span>
                    </div>
                `;
                return;
            }
            
            // Determine if this is a .md file (no icon by default)
            const isMdFile = item.isMd;
            const showIcon = !isMdFile; // Only show icon for non-.md files and directories
            
            html += `
                <div class="file-item flex items-center p-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                     data-path="${item.path}" data-type="${item.type}"
                     ${isDirectory && !isLast ? 'data-has-children="true"' : ''}
                     ${isExpanded && isDirectory ? 'data-expanded="true"' : ''}>
                    <!-- Tree connector lines with semi-rounded corners -->
                    <div class="tree-connector ${isLast ? 'last' : ''}"></div>
                    
                    <!-- Icon section -->
                    <div class="file-icon ${showIcon ? '' : 'hidden'} flex-shrink-0">
                        ${isDirectory ? 
                            '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="#8b5cf6" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h10a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"/></svg>' : 
                            ''}
                    </div>
                    
                    <!-- Item name -->
                    <span class="flex-1 truncate ml-2">${item.name}</span>
                    
                    <!-- Expander icon for directories (only if has children) -->
                    ${isDirectory && !isLast ? 
                        `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1 transition-transform duration-200 ${isExpanded ? 'rotated' : ''}" 
                              viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                          </svg>' : 
                        ''}
                </div>
                
                <!-- Children would be rendered here when directory is expanded -->
                ${isDirectory && isExpanded ? 
                    '<div class="tree-children ml-4">' : ''}
                ${isDirectory && isExpanded ? 
                    '</div>' : ''}
            `;
        });
        
        fileList.innerHTML = html;
        
        // Add click handlers for expanding/collapsing directories
        fileList.querySelectorAll('[data-type="directory"]:not(.file-parent)').forEach(item => {
            item.addEventListener('click', (e) => {
                // Prevent triggering context menu on left click
                if (e.button !== 0) return;
                
                const path = e.currentTarget.dataset.path;
                const isExpanded = this.state.fileExplorer.expandedPaths.has(path);
                
                if (isExpanded) {
                    this.state.fileExplorer.expandedPaths.delete(path);
                } else {
                    this.state.fileExplorer.expandedPaths.add(path);
                    // Load children for this directory
                    this.loadDirectoryContents(path);
                }
                
                this.renderFileTree();
            });
        });
        
        // Add click handlers for file items (non-directories)
        fileList.querySelectorAll('[data-type="file"]').forEach(item => {
            item.addEventListener('click', (e) => {
                // Prevent triggering context menu on left click
                if (e.button !== 0) return;
                
                const path = e.currentTarget.dataset.path;
                this.openFile(path);
            });
        });
    }

    // Handles expanding/collapsing all folders
    toggleExpandAll() {
        const currentlyExpanded = this.state.fileExplorer.expandedPaths.size > 1; // More than just root
        
        if (currentlyExpanded) {
            // Collapse all
            this.state.fileExplorer.expandedPaths.clear();
            this.state.fileExplorer.expandedPaths.add('/'); // Keep root expanded
        } else {
            // Expand all - load immediate children of root for now
            // In a full implementation, this would recursively expand all directories
            this.state.fileExplorer.expandedPaths.clear();
            this.state.fileExplorer.expandedPaths.add('/');
            // Load root directory contents to populate expanded state
            this.loadFileExplorer('/');
        }
        
        this.renderFileTree();
    }

    // Context menu handling
    setupContextMenus() {
        // Custom context menu container
        this.contextMenu = document.createElement('div');
        this.contextMenu.className = 'context-menu fixed z-50 hidden bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl p-1';
        this.contextMenu.innerHTML = `
            <div class="context-menu-content space-y-1">
                <!-- Menu items will be injected here -->
            </div>
        `;
        document.body.appendChild(this.contextMenu);
        
        // Hide context menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.contextMenu.contains(e.target) && !e.target.closest('.file-item')) {
                this.hideContextMenu();
            }
        });
        
        // Hide on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideContextMenu();
            }
        });
    }

    showContextMenu(options, x, y) {
        // Clear existing options
        this.contextMenu.querySelector('.context-menu-content').innerHTML = '';
        
        // Add options
        options.forEach(option => {
            if (option.divider) {
                this.contextMenu.querySelector('.context-menu-content').innerHTML += `
                    <div class="h-px bg-gray-700/my-1"></div>
                `;
            } else if (option.label) {
                const elementClass = option.disabled 
                    ? 'context-menu-item disabled cursor-not-allowed text-gray-500' 
                    : 'context-menu-item flex items-center space-x-2 rounded hover:bg-gray-700 transition-colors cursor-pointer px-3 py-1';
                
                this.contextMenu.querySelector('.context-menu-content').innerHTML += `
                    <div class="${elementClass}" data-action="${option.action}">
                        ${option.icon ? `<div class="flex-shrink-0">${option.icon}</div>` : ''}
                        <span>${option.label}</span>
                    </div>
                `;
            }
        });
        
        // Position and show
        this.contextMenu.style.left = `${x}px`;
        this.contextMenu.style.top = `${y}px`;
        this.contextMenu.classList.remove('hidden');
        
        // Add click handlers to menu items
        this.contextMenu.querySelectorAll('.context-menu-item:not(.disabled)').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleContextMenuAction(action, this.contextMenuItemData);
                this.hideContextMenu();
            });
        });
    }

    hideContextMenu() {
        this.contextMenu.classList.add('hidden');
    }

    // Folder context menu (right-click on folder)
    showFolderContextMenu(folderPath, x, y) {
        this.contextMenuItemData = { type: 'folder', path: folderPath };
        
        const options = [
            { label: 'New note', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v8m0 0l-4 4m4-4H4"/></svg>', action: 'newFile' },
            { label: 'New folder', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20h10M12 4v16"/></svg>', action: 'newFolder' },
            { divider: true },
            { label: 'Make a copy', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9z"/></svg>', action: 'copyFolder' },
            { label: 'Rename', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h5"/></svg>', action: 'renameFolder' },
            { label: 'Delete', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.867-3.142L5 13m14 0Vm-7 0h.01M8 13h4M12 13h4M16 13h4M6 9h12M6 5h12a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/></svg>', action: 'deleteFolder' },
            { divider: true },
            // Future features - disabled/commented
            // { label: 'Move to...', icon: '', action: 'moveFolder', disabled: true },
            // { label: 'Bookmark', icon: '', action: 'bookmarkFolder', disabled: true },
            // { label: 'Change icon', icon: '', action: 'changeIconFolder', disabled: true },
            // { label: 'Pin folder', icon: '', action: 'pinFolder', disabled: true },
            // { label: 'Set color', icon: '', action: 'setColorFolder', disabled: true }
        ];
        
        this.showContextMenu(options, x, y);
    }

    // File context menu (right-click on file) - ADAPTED FOR SLIDING PANES
    showFileContextMenu(filePath, x, y) {
        this.contextMenuItemData = { type: 'file', path: filePath };
        
        const options = [
            { label: 'Open in adjacent pane', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H3a2 2 0 00-2 2v6a2 2 0 002 2h5m14 0V5a2 2 0 00-2-2H8a2 2 0 00-2-2v2m0 6h6"/></svg>', action: 'openAdjacent' },
            { divider: true },
            { label: 'Make a copy', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9z"/></svg>', action: 'copyFile' },
            { label: 'Rename', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h5"/></svg>', action: 'renameFile' },
            { label: 'Delete', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.867-3.142L5 13m14 0Vm-7 0h.01M8 13h4M12 13h4M16 13h4M6 9h12M6 5h12a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/></svg>', action: 'deleteFile' },
            { divider: true },
            // Future features - disabled/commented
            // { label: 'Move to...', icon: '', action: 'moveFile', disabled: true },
            // { label: 'Bookmark', icon: '', action: 'bookmarkFile', disabled: true },
            // { label: 'Change icon', icon: '', action: 'changeIconFile', disabled: true },
            // { label: 'Pin file', icon: '', action: 'pinFile', disabled: true },
            // { label: 'Set color', icon: '', action: 'setColorFile', disabled: true }
        ];
        
        this.showContextMenu(options, x, y);
    }

    // Context menu action handlers
    handleContextMenuAction(action, data) {
        const { type, path } = data;
        
        switch (action) {
            case 'newFile':
                this.promptForNewFile(path);
                break;
            case 'newFolder':
                this.promptForNewFolder(path);
                break;
            case 'copyFolder':
                this.copyFolder(path);
                break;
            case 'renameFolder':
                this.renameFolder(path);
                break;
            case 'deleteFolder':
                this.deleteFolder(path);
                break;
            case 'openAdjacent':
                this.openFileInAdjacentPane(path);
                break;
            case 'copyFile':
                this.copyFile(path);
                break;
            case 'renameFile':
                this.renameFile(path);
                break;
            case 'deleteFile':
                this.deleteFile(path);
                break;
            default:
                console.warn(`Unhandled context menu action: ${action}`);
        }
    }

    // Placeholder implementations for context menu actions
    promptForNewFile(currentPath) {
        puter.ui.prompt('Enter file name (with extension):').then((name) => {
            if (name && name.trim()) {
                const filePath = `${currentPath}/${name.trim()}`.replace(/\/{2,}/g, '/');
                this.createFile(filePath);
            }
        });
    }

    promptForNewFolder(currentPath) {
        puter.ui.prompt('Enter folder name:').then((name) => {
            if (name && name.trim()) {
                const folderPath = `${currentPath}/${name.trim()}`.replace(/\/{2,}/g, '/');
                this.createFolder(folderPath);
            }
        });
    }

    copyFolder(folderPath) {
        // Implementation would go here
        puter.ui.alert('Copy folder functionality coming soon!');
    }

    renameFolder(folderPath) {
        // Implementation would go here
        puter.ui.alert('Rename folder functionality coming soon!');
    }

    deleteFolder(folderPath) {
        // Implementation would go here
        puter.ui.alert('Delete folder functionality coming soon!');
    }

    openFileInAdjacentPane(filePath) {
        // Open file in a new panel to the right (adjacent pane)
        this.openFile(filePath);
        // In a full implementation, this would create a new panel instance
        // For now, we just open it and note that sliding panes flow horizontally
        console.log(`Opening ${filePath} in adjacent pane (horizontal flow)`);
    }

    copyFile(filePath) {
        // Implementation would go here
        puter.ui.alert('Copy file functionality coming soon!');
    }

    renameFile(filePath) {
        // Implementation would go here
        puter.ui.alert('Rename file functionality coming soon!');
    }

    deleteFile(filePath) {
        // Implementation would go here
        puter.ui.alert('Delete file functionality coming soon!');
    }

    // File Explorer Events Setup
    setupFileExplorerEvents() {
        const newFileBtn = document.getElementById('newFileBtn');
        const newFolderBtn = document.getElementById('newFolderBtn');
        const expandCollapseAllBtn = document.getElementById('expandCollapseAllBtn');
        
        if (newFileBtn) {
            newFileBtn.addEventListener('click', () => this.promptForNewFile('/'));
        }
        if (newFolderBtn) {
            newFolderBtn.addEventListener('click', () => this.promptForNewFolder('/'));
        }
        if (expandCollapseAllBtn) {
            expandCollapseAllBtn.addEventListener('click', () => this.toggleExpandAll());
        }
        
        // Setup context menus
        this.setupContextMenus();
    }

    // Placeholder methods for file operations (to be implemented)
    loadDirectoryContents(path) {
        // Implementation would go here
        console.log(`Loading contents for ${path}`);
    }

    openFile(filePath) {
        // Implementation would go here
        console.log(`Opening file: ${filePath}`);
        // This would load the file content into the editor
    }

    createFile(filePath) {
        // Implementation would go here
        puter.ui.alert('Create file functionality coming soon!');
    }

    createFolder(folderPath) {
        // Implementation would go here
        puter.ui.alert('Create folder functionality coming soon!');
    }

    // Editor Initialization and Event Handling
    setupEditor() {
        this.editorElement = document.getElementById('editor');
        this.previewContainer = document.getElementById('previewContainer');
        this.previewToggle = document.getElementById('previewToggle');
        this.fileTitle = document.getElementById('fileTitle');
        this.saveBtn = document.getElementById('saveBtn');
        
        // Set initial content
        if (this.state.file.content) {
            this.editorElement.value = this.state.file.content;
            this.updatePreview();
        }
        
        // Editor input with debounce for auto-save
        this.editorElement.addEventListener('input', (e) => {
            this.state.file.content = e.target.value;
            clearTimeout(this.state.editor.debounceTimer);
            this.state.editor.debounceTimer = setTimeout(() => {
                this.saveFile();
            }, 2000); // 2 second debounce
            
            // Update preview in real-time (or with a shorter debounce for performance)
            clearTimeout(this.previewDebounceTimer);
            this.previewDebounceTimer = setTimeout(() => {
                this.updatePreview();
            }, 300);
        });
        
        // Preview toggle
        this.previewToggle.addEventListener('click', () => {
            this.previewContainer.classList.toggle('hidden');
            this.editorElement.classList.toggle('flex-1');
            this.editorElement.classList.toggle('w-full');
            // When showing preview, editor takes half space; when hiding, editor takes full
            if (this.previewContainer.classList.contains('hidden')) {
                this.editorElement.classList.remove('w-1/2');
                this.editorElement.classList.add('flex-1');
            } else {
                this.editorElement.classList.remove('flex-1');
                this.editorElement.classList.add('w-1/2');
            }
        });
        
        // Save button
        this.saveBtn.addEventListener('click', () => {
            this.saveFile();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+S to save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveFile();
            }
            // Ctrl+N for new file (handled in file explorer)
            // Alt for radial menu (handled separately)
        });
    }

    async saveFile() {
        if (!this.state.file.currentPath) {
            // If no file is open, we might want to prompt for a name
            // For now, we'll just return or show a message
            return;
        }
        
        try {
            await puter.fs.write(this.state.file.currentPath, this.state.file.content);
            // Update UI to show saved status
            this.saveBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
            setTimeout(() => {
                this.saveBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 012-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /></svg>';
            }, 2000);
        } catch (error) {
            console.error('Failed to save file:', error);
            puter.ui.alert('Could not save file');
        }
    }

    updatePreview() {
        if (this.previewContainer.classList.contains('hidden')) {
            return; // Don't update if hidden
        }
        
        try {
            const html = this.markdownIt.render(this.state.file.content);
            this.previewContainer.innerHTML = html;
        } catch (error) {
            console.error('Failed to render markdown:', error);
            this.previewContainer.innerHTML = `<p class="text-red-400">Error rendering preview</p>`;
        }
    }

    // Radial Menu System
    setupRadialMenu() {
        this.radialMenu = document.getElementById('radialMenu');
        this.radialMenuContent = document.getElementById('radialMenuContent');
        
        // Event listeners for Alt key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Alt' || e.key === 'AltGraph') {
                e.preventDefault(); // Prevent browser menu from opening
                this.showRadialMenu(e.clientX, e.clientY);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Alt' || e.key === 'AltGraph') {
                this.hideRadialMenu();
            }
        });
        
        // For touch devices: long press to show menu
        let touchStartTime = 0;
        const LONG_PRESS_THRESHOLD = 500; // ms
        
        document.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration >= LONG_PRESS_THRESHOLD) {
                const touch = e.changedTouches[0];
                this.showRadialMenu(touch.clientX, touch.clientY);
            }
        }, { passive: true });
        
        // Add click handlers to static menu items
        document.getElementById('menuExplorer').addEventListener('click', () => {
            this.switchToPanel(0);
            this.hideRadialMenu();
        });
        
        document.getElementById('menuEditor').addEventListener('click', () => {
            this.switchToPanel(1);
            this.hideRadialMenu();
        });
        
        document.getElementById('menuNewFile').addEventListener('click', () => {
            this.promptForNewFile();
            this.hideRadialMenu();
        });
        
        document.getElementById('menuNewFolder').addEventListener('click', () => {
            this.promptForNewFolder();
            this.hideRadialMenu();
        });
        
        document.getElementById('menuSettings').addEventListener('click', () => {
            this.openSettings();
            this.hideRadialMenu();
        });
    }
    
    showRadialMenu(x, y) {
        this.radialMenu.classList.remove('hidden');
        // Position the menu content under the cursor/finger (centered on the point)
        this.radialMenuContent.style.transform = `translate(${x}px, ${y}px)`;
        // Add a slight delay to allow for CSS transition
        requestAnimationFrame(() => {
            this.radialMenuContent.classList.add('opacity-100');
            this.radialMenuContent.classList.remove('opacity-0');
        });
    }
    
    hideRadialMenu() {
        this.radialMenuContent.classList.add('opacity-0');
        this.radialMenuContent.classList.remove('opacity-100');
        // Wait for transition to end before hiding
        setTimeout(() => {
            this.radialMenu.classList.add('hidden');
        }, 200);
    }
    
    switchToPanel(panelIndex) {
        this.state.ui.activePanel = panelIndex;
        this.updatePanelVisibility();
        this.panesContainer.scrollTo({
            left: this.state.ui.activePanel * this.explorerPanel.offsetWidth,
            behavior: 'smooth'
        });
    }
    
    openSettings() {
        // Placeholder for settings functionality
        alert('Settings panel coming soon!');
    }
}