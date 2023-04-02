import EventEmitter from "events";
import * as THREE from "three";
import Experience from "./Experience";
export default class AudioController extends EventEmitter{
  constructor() {
    super();
    this.experience = new Experience();
    this.camera = this.experience.camera.perspectiveCamera;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    document.addEventListener("click", () => this.loadSounds(), {once:true})
  }
  async loadSounds(){
    this.listener = new THREE.AudioListener();
    this.SFXlistener = new THREE.AudioListener();
    this.camera.add(this.listener);
    this.camera.add(this.SFXlistener);
    this.sound = new THREE.Audio(this.listener);
    this.SFXsound = new THREE.Audio(this.SFXlistener);
    this.audioLoader = new THREE.AudioLoader();
  
    this.soundsToLoad = ['Background','Money','TilePlayed'];
    this.soundsToPlay = [];
    await this.soundsToLoad.forEach((sound)=>{
        this.audioLoader.load( `sounds/${sound}.ogg`, ( buffer )=>{
          this.soundsToPlay.push({sound, buffer});
        });
      });
      this.emit("loaded");
    }
    playSound(soundName, isBackground=false){
      const sound = this.soundsToPlay.find(s=>s.sound===soundName);
      if(isBackground) {
        this.SFXsound.setBuffer(sound.buffer);
        this.SFXsound.setLoop(true);
        this.SFXsound.setVolume( 0.05 );
        this.SFXsound.play();
      }else{
        this.sound.setBuffer(sound.buffer);
        this.sound.setVolume( 0.5 );
      this.sound.play();
    }
    this.currentlyPlaying = soundName;
  }
}
