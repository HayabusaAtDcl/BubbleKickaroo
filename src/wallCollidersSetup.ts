import * as CANNON from 'cannon/build/cannon'

export function loadColliders(world: CANNON.World): void {
  const parcelSize = 16
  const wallThickness = 0.5
  const wallHeight = 20

  // NORTH and SOUTH walls (facing Z direction, width along X)
  const wallNSShape = new CANNON.Box(new CANNON.Vec3(parcelSize / 2, wallHeight / 2, wallThickness / 2))

  // EAST and WEST walls (facing X direction, width along Z)
  const wallEWShape = new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, parcelSize / 2))

  // NORTH wall
  const wallNorth = new CANNON.Body({
    mass: 0,
    shape: wallNSShape,
    position: new CANNON.Vec3(8, wallHeight / 2, 16 + wallThickness / 2)
  })
  world.addBody(wallNorth)

  // SOUTH wall
  const wallSouth = new CANNON.Body({
    mass: 0,
    shape: wallNSShape,
    position: new CANNON.Vec3(8, wallHeight / 2, 0 - wallThickness / 2)
  })
  world.addBody(wallSouth)

  // WEST wall
  const wallWest = new CANNON.Body({
    mass: 0,
    shape: wallEWShape,
    position: new CANNON.Vec3(0 - wallThickness / 2, wallHeight / 2, 8)
  })
  world.addBody(wallWest)

  // EAST wall
  const wallEast = new CANNON.Body({
    mass: 0,
    shape: wallEWShape,
    position: new CANNON.Vec3(16 + wallThickness / 2, wallHeight / 2, 8)
  })
  world.addBody(wallEast)






  
}
