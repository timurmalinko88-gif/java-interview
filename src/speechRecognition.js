/**
 * Speech-to-Text Voice Dictation Wrapper
 * Uses standard in-browser Web Speech API (Chrome, Edge, Safari)
 */

export class SpeechRecognizer {
  constructor({ onTranscript, onStateChange, lang = 'ru-RU' }) {
    this.onTranscript = onTranscript || (() => {});
    this.onStateChange = onStateChange || (() => {});
    this.lang = lang;
    this.recognition = null;
    this.isListening = false;
    this.finalTranscript = '';

    this.init();
  }

  static isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.lang;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onStateChange(true);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onStateChange(false);
    };

    this.recognition.onerror = (event) => {
      console.warn('[SpeechRecognizer] Error:', event.error);
      this.isListening = false;
      this.onStateChange(false);
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += (this.finalTranscript ? ' ' : '') + transcript.trim();
        } else {
          interim += transcript;
        }
      }
      const combined = (this.finalTranscript + (interim ? ' ' + interim : '')).trim();
      this.onTranscript(combined);
    };
  }

  start() {
    if (!this.recognition) return false;
    try {
      this.finalTranscript = '';
      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('[SpeechRecognizer] Start failed:', err);
      return false;
    }
  }

  stop() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch (err) {
      // Ignored
    }
  }

  toggle() {
    if (this.isListening) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }
}
