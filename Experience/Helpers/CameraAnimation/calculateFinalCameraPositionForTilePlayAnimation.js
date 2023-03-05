import * as THREE from 'three';
export default function calculateFinalCameraPositionForTilePlayAnimation(lastPlayedTile){
    if(!lastPlayedTile) return {move:new THREE.Vector3(0,100,20), look: new THREE.Vector3(0,0,0)};
    return {move:new THREE.Vector3(lastPlayedTile.position.x, 100, lastPlayedTile.position.z + 20), look:lastPlayedTile.position.clone()};
}