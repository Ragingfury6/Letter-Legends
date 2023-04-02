import * as THREE from "three";
import Sizes from "../Utils/Sizes";
import Time from "../Utils/Time";
import Resources from "../Utils/Resources";

import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "../World/World";
import assets from "../Utils/assets";
import Controls from "./Controls";

import { GroundProjectedEnv } from "three/examples/jsm/objects/GroundProjectedEnv";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import AudioController from "./AudioController";

export default class Experience {
  static instance;
  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.time = new Time();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resources = new Resources(assets);
    this.world = new World();
    this.controls = new Controls();
    this.audioController = new AudioController();
    this.audioController.on("loaded", () =>
      setTimeout(() => {
        this.audioController.playSound("Background", true);
      }, 1000)
    );

    // const hdrLoader = new RGBELoader();
    // const envMap = hdrLoader.load('test.hdr');
    // envMap.mapping = THREE.EquirectangularReflectionMapping;

    // let env = new GroundProjectedEnv(envMap);
    // env.scale.setScalar(500);
    // this.scene.add(env);
    // env.radius = 200;
    // env.height = 20;
    // this.scene.environment = envMap;

    // this.scene.add(mesh);

    this.time.on("update", () => {
      this.update();
    });

    this.sizes.on("resize", () => {
      this.resize();
    });
  }
  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update();
    // this.controls.update();
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
}
