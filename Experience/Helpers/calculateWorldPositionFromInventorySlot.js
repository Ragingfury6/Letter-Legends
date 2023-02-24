import * as THREE from 'three';
export default function calculateWorldPositionFromInventorySlot(
  slot,
  posX,
  posZ,
  totalX,
  totalZ,
  arrangement
) {
  const xSlot = slot % arrangement.x;
  const zSlot = (slot - xSlot) / arrangement.x;
  return new THREE.Vector3(
    // total / arrangement * slot gives the basic value
    // Adding posX sets the value relative to the holder
    // Adding totalX / arrangement / 2 centers the tiles within the holder
    (totalX / arrangement.x) * xSlot + posX + totalX / arrangement.x / 2,
    0.2,
    (totalZ / arrangement.z) * zSlot + posZ + totalZ / arrangement.z / 2
  );
}
