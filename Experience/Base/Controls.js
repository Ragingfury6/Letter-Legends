import Experience from "./Experience";
import * as THREE from "three";
import gsap from "gsap";
export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.time = this.experience.time;

    this.progress = 0;
    this.animationEnabled = false;
    this.moveVector = new THREE.Vector3();
    this.lookVector = new THREE.Vector3();

    this.curve = {};
    this.points = {};
    this.geometry = {};
    this.material = {};
    this.curveObject = {};
  }

  updateCurve(curveArray, type) {
    this.curve[type] = new THREE.CatmullRomCurve3(curveArray);
    this.points[type] = this.curve[type].getPoints(50);
    this.geometry[type] = new THREE.BufferGeometry().setFromPoints(this.points[type]);
    this.material[type] = new THREE.LineBasicMaterial({ color: 0xff0000 });
    this.curveObject[type] = new THREE.Line(this.geometry[type], this.material[type]);
  }

  beginAnimationFromCamera(to, enableControlsOnComplete = false){
    // this.updateCurve([this.camera.perspectiveCamera.position.clone(), to.move], 'position');
    // this.updateCurve([this.camera.controls.target, to.look], 'look');
    this.camera.controls.enabled=false;
    gsap.to(this.camera.perspectiveCamera.position, {x:to.move.x,y:to.move.y,z:to.move.z, duration:0.5 ,onComplete: () => {
        this.camera.controls.enabled = enableControlsOnComplete;
    }});
    gsap.to(this.camera.controls.target, {x:to.look.x, y:to.look.y, z:to.look.z, duration:0.5});
    // this.animationEnabled = true;
  }

//   update(){
//     if(this.progress < 1 && this.animationEnabled){
//         this.curve['position'].getPointAt(this.progress, this.moveVector);
//         // this.curve['look'].getPointAt(this.progress, this.lookVector);
//         // console.log(this.lookVector)
//         this.camera.perspectiveCamera.position.copy(this.moveVector);
//         // this.camera.controls.target = this.lookVector;

//         this.progress+=0.01;
//     } else if(this.progress > 1 && this.animationEnabled){
//         this.animationEnabled = false;
//         this.progress =0;
//         this.camera.controls.enabled=true;
//     }
//   }
}
