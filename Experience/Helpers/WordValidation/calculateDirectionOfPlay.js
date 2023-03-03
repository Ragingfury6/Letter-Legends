export default function calculateDirectionOfPlay(tiles){
    return tiles.every(t=>t.position.x === tiles[0].position.x) ? "z" : "x";
}