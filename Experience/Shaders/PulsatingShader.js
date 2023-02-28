import * as THREE from 'three';
export default class PulsatingShader{
    constructor(r,g,b){
        this.startTime = Date.now();
        this.uniformData = {
            u_time:{
              type:"f",
              value:Date.now()-this.startTime
            }
        };
        this.vertexShader = `
        void main() {
            gl_Position = projectionMatrix 
            * modelViewMatrix 
            * vec4(position.x,position.y,position.z, 1.0);
        }
        `;
        this.fragmentShader= `
        uniform float u_time;
        void main() {
            gl_FragColor = vec4(${r},${g},${b},abs(sin(u_time)));
        }
        `;
        this.shader = new THREE.ShaderMaterial({
            uniforms:this.uniformData,
            vertexShader:this.vertexShader,
            fragmentShader:this.fragmentShader
        })
    }
    update(){
        this.uniformData.u_time.value = (Date.now() - this.startTime)/400;
    }
}