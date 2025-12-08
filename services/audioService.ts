class AudioService {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.value = 0.3; // Master volume
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : 0.3;
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
    this.init();
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(this.gainNode);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  public playJump() {
    this.playTone(400, 'square', 0.1);
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  public playMorph() {
    this.playTone(800, 'sawtooth', 0.1);
    this.playTone(1200, 'sine', 0.2, 0.05);
  }

  public playDie() {
    this.playTone(200, 'sawtooth', 0.3);
    this.playTone(150, 'square', 0.3, 0.1);
    this.playTone(100, 'sawtooth', 0.4, 0.2);
  }

  public playWin() {
    this.playTone(523.25, 'triangle', 0.1, 0); // C5
    this.playTone(659.25, 'triangle', 0.1, 0.1); // E5
    this.playTone(783.99, 'triangle', 0.2, 0.2); // G5
    this.playTone(1046.50, 'triangle', 0.4, 0.3); // C6
  }

  public playStep() {
    // Very quiet step sound
    this.init();
    if (!this.ctx || !this.gainNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = 100;
    osc.type = 'triangle';
    gain.gain.value = 0.05;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

export const audioService = new AudioService();
