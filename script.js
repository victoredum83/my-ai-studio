let currentMode = 'image';
let generatedMediaUrl = null;

const modeButtons = document.querySelectorAll('.mode-btn');
const promptInput = document.getElementById('prompt');
const generateBtn = document.getElementById('generate-btn');
const resultContainer = document.getElementById('result-container');
const downloadBtn = document.getElementById('download-btn');

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentMode = button.getAttribute('data-mode');
        
        if (!generatedMediaUrl) {
            resultContainer.innerHTML = `<span>Generated ${currentMode} result appears here</span>`;
        }
    });
});

generateBtn.addEventListener('click', async () => {
    const promptText = promptInput.value.trim();

    if (!promptText) {
        alert('Please enter a prompt first!');
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = 'GENERATING...';
    resultContainer.innerHTML = `<span>AI is crafting your ${currentMode}... Please wait.</span>`;
    downloadBtn.classList.add('hidden');

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText, mode: currentMode })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate media');
        }

        generatedMediaUrl = data.url;

        if (currentMode === 'image') {
            resultContainer.innerHTML = `<img src="${generatedMediaUrl}" alt="Generated AI Image">`;
        } else {
            resultContainer.innerHTML = `
                <video controls autoplay loop>
                    <source src="${generatedMediaUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>`;
        }

        downloadBtn.classList.remove('hidden');

    } catch (error) {
        console.error('Generation failed:', error);
        resultContainer.innerHTML = `<span style="color: #f87171;">Error: ${error.message}</span>`;
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'GENERATE';
    }
});

downloadBtn.addEventListener('click', () => {
    if (!generatedMediaUrl) return;

    const a = document.createElement('a');
    a.href = generatedMediaUrl;
    a.download = `ai-generated-${currentMode}-${Date.now()}`;
    a.target = '_blank'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
