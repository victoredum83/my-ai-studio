// Track selected mode ('image' or 'video')
let currentMode = 'image';
let generatedMediaUrl = null;

// DOM Elements
const modeButtons = document.querySelectorAll('.mode-btn');
const promptInput = document.getElementById('prompt');
const generateBtn = document.getElementById('generate-btn');
const resultContainer = document.getElementById('result-container');
const downloadBtn = document.getElementById('download-btn');

// Handle Mode Toggle (IMAGE vs VIDEO)
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentMode = button.getAttribute('data-mode');
        
        // Update placeholder text dynamically based on mode
        if (!generatedMediaUrl) {
            resultContainer.innerHTML = `<span>Generated ${currentMode} result appears here</span>`;
        }
    });
});

// Handle Generate Button Click
generateBtn.addEventListener('click', async () => {
    const promptText = promptInput.value.trim();

    if (!promptText) {
        alert('Please enter a prompt first!');
        return;
    }

    // 1. Set UI to Loading State
    generateBtn.disabled = true;
    generateBtn.textContent = 'GENERATING...';
    resultContainer.innerHTML = `<span>AI is crafting your ${currentMode}... Please wait.</span>`;
    downloadBtn.classList.add('hidden');

    try {
        // =========================================================================
        // 🔌 FUTURE API HOOK-UP POINT
        // -------------------------------------------------------------------------
        // When your backend is ready, you will replace this simulated block with 
        // a fetch() call to your backend server/API route, like this:
        //
        // const response = await fetch('/api/generate', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ prompt: promptText, mode: currentMode })
        // });
        // const data = await response.json();
        // generatedMediaUrl = data.url;
        // =========================================================================

        // --- SIMULATION FOR NOW (Deletes when backend is connected) ---
        await new Promise(resolve => setTimeout(resolve, 3000)); // Fake 3-sec delay
        
        if (currentMode === 'image') {
            // Placeholder image for testing UI layout
            generatedMediaUrl = 'https://picsum.photos/500/500?random=' + Math.random();
            resultContainer.innerHTML = `<img src="${generatedMediaUrl}" alt="Generated AI Image">`;
        } else {
            // Placeholder video structure for testing UI layout
            generatedMediaUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
            resultContainer.innerHTML = `
                <video controls autoplay loop>
                    <source src="${generatedMediaUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
        }
        // -------------------------------------------------------------

        // Show download button once media is rendered
        downloadBtn.classList.remove('hidden');

    } catch (error) {
        console.error('Generation failed:', error);
        resultContainer.innerHTML = `<span style="color: #f87171;">Failed to generate. Please try again.</span>`;
    } finally {
        // Reset Generate Button
        generateBtn.disabled = false;
        generateBtn.textContent = 'GENERATE';
    }
});

// Handle Download Button Click
downloadBtn.addEventListener('click', () => {
    if (!generatedMediaUrl) return;

    // Create a temporary link element to trigger the download
    const a = document.createElement('a');
    a.href = generatedMediaUrl;
    a.download = `ai-generated-${currentMode}-${Date.now()}`;
    // target="_blank" helps prevent CORS download blocks on external placeholder URLs
    a.target = '_blank'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});