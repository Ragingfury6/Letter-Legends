import { io } from "socket.io-client";
export default class Socket{
    constructor(){
        this.socket = io("http://localhost:3000",{withCredentials:true});
        this.onEvents();
        this.emitHello();
    }
    onEvents(){
        this.socket.on("hello from server", () =>{
            console.log("Got hello from server");
        })
    }
    emitHello(){
        this.socket.emit("hello from client");
    }
}