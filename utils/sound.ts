class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private enabled: boolean = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error("Web Audio API is not supported in this browser");
      this.enabled = false;
    }
  }

  async loadSound(name: string, url: string) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds[name] = audioBuffer;
    } catch (error) {
      console.error(`Failed to load sound ${name}:`, error);
    }
  }

  playSound(name: string) {
    if (!this.enabled || !this.audioContext || !this.sounds[name]) return;

    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.sounds[name];
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error(`Failed to play sound ${name}:`, error);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundManager = new SoundManager();
