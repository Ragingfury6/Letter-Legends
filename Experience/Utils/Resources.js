import EventEmitter from 'events';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { TextureLoader, WrapAroundEnding } from 'three';
import Experience from '../Base/Experience';
export default class Resources extends EventEmitter {
  constructor(assets) {
    super();
    this.experience = new Experience();
    this.renderer = this.experience.renderer;

    this.assets = assets;

    this.items = {};
    this.queue = this.assets.length;
    this.loaded = 0;

    this.setLoaders();
    this.load();
  }
  setLoaders() {
    this.loaders = {};
    this.loaders.GLTFLoader = new GLTFLoader();
    this.loaders.DRACOLoader = new DRACOLoader();
    this.loaders.TextureLoader = new TextureLoader();
    this.loaders.DRACOLoader.setDecoderPath('/draco/');
    this.loaders.GLTFLoader.setDRACOLoader(this.loaders.DRACOLoader);
  }
  load() {
    for (const asset of this.assets) {
      if (asset.type === 'glbModel') {
        this.loaders.GLTFLoader.load(asset.path, (file) => {
          this.singleAssetLoaded(asset, file);
        });
      } else if (asset.type === 'texture') {
        this.loaders.TextureLoader.load(asset.path, (file) => {
          file.wrapS = file.wrapT = WrapAroundEnding;
          // file.repeat.set(2, 2);
          this.singleAssetLoaded(asset, file);
        });
      }
    }
  }
  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file;
    this.loaded++;
    if (this.loaded === this.queue) {
      this.emit('ready');
    }
  }
}
