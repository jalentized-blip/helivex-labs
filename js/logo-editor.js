document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const STORAGE_KEY = 'helivex_logo_settings';
    const logoImage = document.querySelector('.logo-image');
    
    if (!logoImage) return;

    // Apply saved settings immediately
    applySavedSettings();

    // Create Editor UI
    createEditorUI();

    function applySavedSettings() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const settings = JSON.parse(saved);
            if (settings.top) logoImage.style.top = settings.top;
            if (settings.left) logoImage.style.left = settings.left;
            if (settings.height) logoImage.style.height = settings.height;
        }
    }

    function createEditorUI() {
        // Create pencil icon
        const editBtn = document.createElement('button');
        editBtn.className = 'logo-edit-btn';
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editBtn.title = 'Edit Logo Position & Size';
        
        // Append to body or header (absolute position)
        document.body.appendChild(editBtn);

        // Create Controls Panel (hidden by default)
        const panel = document.createElement('div');
        panel.className = 'logo-editor-panel';
        panel.innerHTML = `
            <h4>Logo Editor</h4>
            <div class="editor-control">
                <label>Size (px)</label>
                <input type="range" id="logo-size" min="50" max="300" step="1">
            </div>
            <div class="editor-control">
                <label>Top Position (px)</label>
                <input type="range" id="logo-top" min="-50" max="100" step="1">
            </div>
            <div class="editor-control">
                <label>Left Position (px)</label>
                <input type="range" id="logo-left" min="0" max="100" step="1">
            </div>
            <div class="editor-actions">
                <button id="logo-save" class="btn-save">Save</button>
                <button id="logo-reset" class="btn-reset">Reset</button>
                <button id="logo-cancel" class="btn-cancel">Close</button>
            </div>
            <p class="editor-note">Drag logo to move freely</p>
        `;
        document.body.appendChild(panel);

        // Event Listeners
        editBtn.addEventListener('click', () => {
            panel.classList.toggle('active');
            toggleEditMode(panel.classList.contains('active'));
        });

        const saveBtn = panel.querySelector('#logo-save');
        const resetBtn = panel.querySelector('#logo-reset');
        const cancelBtn = panel.querySelector('#logo-cancel');
        const sizeInput = panel.querySelector('#logo-size');
        const topInput = panel.querySelector('#logo-top');
        const leftInput = panel.querySelector('#logo-left');

        // Initialize inputs with current computed values
        function updateInputs() {
            const style = window.getComputedStyle(logoImage);
            sizeInput.value = parseInt(style.height);
            topInput.value = parseInt(style.top);
            leftInput.value = parseInt(style.left) || 0;
        }

        // Live Preview from Sliders
        sizeInput.addEventListener('input', (e) => {
            logoImage.style.height = e.target.value + 'px';
        });

        topInput.addEventListener('input', (e) => {
            logoImage.style.top = e.target.value + 'px';
        });

        leftInput.addEventListener('input', (e) => {
            logoImage.style.left = e.target.value + 'px';
        });

        // Save
        saveBtn.addEventListener('click', () => {
            const settings = {
                height: logoImage.style.height,
                top: logoImage.style.top,
                left: logoImage.style.left
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            alert('Logo settings saved!');
            panel.classList.remove('active');
            toggleEditMode(false);
        });

        // Reset
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem(STORAGE_KEY);
            logoImage.style.top = '';
            logoImage.style.left = '';
            logoImage.style.height = '';
            updateInputs();
        });

        // Cancel
        cancelBtn.addEventListener('click', () => {
            panel.classList.remove('active');
            toggleEditMode(false);
            applySavedSettings(); // Revert to saved
        });

        // Dragging Logic
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        function onMouseDown(e) {
            if (!panel.classList.contains('active')) return;
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const style = window.getComputedStyle(logoImage);
            startLeft = parseInt(style.left) || 0;
            startTop = parseInt(style.top) || 0;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            logoImage.style.cursor = 'grabbing';
        }

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            logoImage.style.left = (startLeft + dx) + 'px';
            logoImage.style.top = (startTop + dy) + 'px';
            
            // Update sliders
            leftInput.value = startLeft + dx;
            topInput.value = startTop + dy;
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            logoImage.style.cursor = 'grab';
        }

        logoImage.addEventListener('mousedown', onMouseDown);
        
        function toggleEditMode(active) {
            if (active) {
                logoImage.style.border = '2px dashed #DC143C';
                logoImage.style.cursor = 'grab';
                updateInputs();
            } else {
                logoImage.style.border = 'none';
                logoImage.style.cursor = 'pointer';
            }
        }
    }
});
