export default function calculateDirectionOfPlay(tiles){
    return tiles.every(t=>t.object.position.x === tiles[0].object.position.x) ? "z" : "x";
}