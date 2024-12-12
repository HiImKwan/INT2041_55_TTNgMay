let voices = [];
let selectedVoice = null;

function populateVoiceOptions() {
    voices = window.speechSynthesis.getVoices();
    const voiceSelect = document.getElementById("voice-select");
    voiceSelect.innerHTML = "";

    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name}`;
        voiceSelect.appendChild(option);
    });

    // Set default voice
    voiceSelect.value = voices.findIndex(voice => voice.default);
    selectedVoice = voices[voiceSelect.value];
}

if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = populateVoiceOptions;
} else {
    populateVoiceOptions();
}

document.getElementById("voice-select").addEventListener("change", (event) => {
    selectedVoice = voices[event.target.value];
});

function readAloud(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedVoice?.lang || 'en-US';
    utterance.voice = selectedVoice || null;
    utterance.rate = readingSpeed;
    utterance.onend = () => {
        if (currentLineIndex < sentences.length - 1) {
            currentLineIndex++;
            renderArticleContent();
            if (isReading) {
                readAloud(sentences[currentLineIndex]);
            }
        }
    };
    window.speechSynthesis.speak(utterance);
}
