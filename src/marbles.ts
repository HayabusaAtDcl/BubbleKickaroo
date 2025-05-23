import { engine, pointerEventsSystem, InputAction, Material, PointerEventType, Transform, Animator, ColliderLayer, GltfContainer, PointerEvents, AudioSource, MeshRenderer, Billboard, TextAlignMode, TextShape, Entity } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"
import { loadColliders } from "./wallCollidersSetup"
import { generateRandomNumber, noSound, popSound, tickTockSound, waoSound, yaySound } from "./resource"
import CANNON from "cannon"
import { Bubble } from "./bubble"
import * as utils from '@dcl-sdk/utils' 
import { AddQuestAction, LSCQuesting, taskDone } from "./questing"
import { movePlayerTo, triggerSceneEmote } from "~system/RestrictedActions"


export function addBubbles(numberOfBubbles: number, modelPath: string) {
    let intervalId = -1;
    let timerIntervalId = -1;
    let inPrison = false;
    let resetTime = 60
    let time = resetTime;
    let hasEggIndex = generateRandomNumber(0, numberOfBubbles-1);



    const getUniqueRandomNumbers = (count: number, max: number) =>  {
      const result = new Set();
      while (result.size < count) {
          result.add(generateRandomNumber(0, max));
      }
      return Array.from(result);
    }
  
    // Example usage:
    const boobyIndexes = getUniqueRandomNumbers(10, numberOfBubbles - 1);
    
   
    let bubbles: Bubble[] = [] 
    let bubbleBodies: CANNON.Body[] = [] 

    let ballHeight = 0 // Start height for the balls
    let forwardVector: Vector3 = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation) // Camera's forward vector
    const vectorScale: number = 25
  
    let randomPositions: any = []
    
    let lockSign: Entity
    let addTimer = () => {
      
      lockSign = engine.addEntity();
      Transform.create(lockSign, {
        position: Vector3.create(8,6,8),
        rotation: Quaternion.fromEulerDegrees(0, 200, 0),
        scale: Vector3.create(1,1,1)
      })
      TextShape.create(lockSign, {
        text:  time.toString(),
        textColor: { r: 255, g: 255, b: 255, a: .8 },
        textAlign:  TextAlignMode.TAM_TOP_CENTER
      })

      Billboard.create(lockSign, {})
    }

    let addBubble = (index: number, withEgg: boolean) => {
      const randomPositionX: number = Math.random() * 16
      const randomPositionY: number = ballHeight
      const randomPositionZ: number = Math.random() * 16
      randomPositions.push({ x: randomPositionX, y: randomPositionY, z: randomPositionZ })
  
      const bubble = new Bubble(modelPath, 
        {
          position: randomPositions[index],
          rotation: Quaternion.Zero(),
          scale: Vector3.create(.05,.05,.05)
        }, hasEggIndex === index && withEgg,
         boobyIndexes.includes(index) && (index != hasEggIndex))
      
      bubbles.push(bubble)
      ballHeight += 2 // To ensure the colliders aren't intersecting when the simulation starts
  
      // Allow the user to interact with the ball
      pointerEventsSystem.onPointerDown(
        {
          entity: bubble.bubbleEntity,
          opts: {
            button: InputAction.IA_POINTER,
            hoverText: 'Pick me!'
          }
        },
        function (cmd: any) {

          if (inPrison) {
            movePlayerTo({
              newRelativePosition: Vector3.create(8, 3.7, 8) ,
              cameraTarget: Vector3.create(0, 4, 0)
            })

           
              triggerSceneEmote({ src: 'animations/cry_emote.glb', loop: true })
           
            return
          }


          //if bubble has egg and task has not been done TODO;
          if (bubble.hasEgg) {
            
            if(!bubble.isOpen) {

              const bubbleTransform = Transform.getMutable(bubbles[index].bubbleEntity)
              bubbleTransform.rotation = Quaternion.Zero()
              bubbleBodies[index].quaternion.set(0, 0, 0, 0)
              
              Animator.playSingleAnimation(bubble.bubbleEntity, 'Take 001_Object_6')
              bubble.isOpen = true
              utils.timers.clearInterval(intervalId);

              utils.timers.setTimeout(()=>{

                Transform.getMutable(yaySound).position = Transform.get(engine.PlayerEntity).position
                AudioSource.getMutable(yaySound).playing = true
          
                Transform.getMutable(waoSound).position = Transform.get(engine.PlayerEntity).position
                AudioSource.getMutable(waoSound).playing = true

                AddQuestAction(bubble.bubbleEntity, bubble.egg)
              }, 1000);
            }

           

          } else {
            // Apply impulse based on the direction of the camera
            bubbleBodies[index].applyImpulse(
              new CANNON.Vec3(forwardVector.x * vectorScale, forwardVector.y * vectorScale, forwardVector.z * vectorScale),
              // Applies impulse based on the player's position and where they click on the ball
              new CANNON.Vec3(cmd.hit?.position?.x, cmd.hit?.position?.y, cmd.hit?.position?.z)
            )

           
            Animator.playSingleAnimation(bubble.bubbleEntity, 'Take 001_Object_6')

            utils.timers.setTimeout(()=>{
            Transform.getMutable(popSound).position = Transform.get(engine.PlayerEntity).position
            AudioSource.getMutable(popSound).playing = true
            }, 500)

              bubble.isOpen = true
              PointerEvents.deleteFrom(bubble.bubbleEntity)


              if (bubble.isBooby) {
                inPrison = true;
                time = resetTime
    
                addTimer()
    
                Transform.getMutable(noSound).position = Transform.get(engine.PlayerEntity).position
                    AudioSource.getMutable(noSound).playing = true
    
                  movePlayerTo({
                      newRelativePosition: Vector3.create(8, 5.5, 8) ,
                      cameraTarget: Vector3.create(0, 1.18, 0)
                    }) 
    
                    
                   
                    Transform.getMutable(tickTockSound).position = Transform.get(engine.PlayerEntity).position
                    AudioSource.getMutable(tickTockSound).playing = true
                    AudioSource.getMutable(tickTockSound).loop = true
    
    
                    timerIntervalId = utils.timers.setInterval( () => {
                      time = time - 1
    
                      const mutableLevelSignText = TextShape.getMutable(lockSign)
                      mutableLevelSignText.text = time.toString()
    
                    }, 1000)
    
                  utils.timers.setTimeout(()=>  {
                    movePlayerTo({
                      newRelativePosition: Vector3.create(8, 0, 8) ,
                      cameraTarget: Vector3.create(8, 4, 8)
    
                     
                    }) 
    
                    inPrison = false;
                    utils.timers.clearInterval(timerIntervalId);
                    engine.removeEntity(lockSign)
                    AudioSource.getMutable(tickTockSound).playing = false
    
                  }, time * 1000)
                }
          }

         
        }
      )
    }

    for (let i = 0; i < numberOfBubbles; i++) {
        addBubble(i, true)
    }

    
    intervalId = utils.timers.setInterval( () => {
      for (let i = numberOfBubbles; i < numberOfBubbles + 10; i++) {
        addBubble(i, false)
        addBubblesBody(i);

      }

      if (bubbles.length > 100){
        utils.timers.clearInterval(intervalId);
      }
    }, 60000)

    //Set up jail
    const bubble = engine.addEntity()

    GltfContainer.create(bubble, {
        src: 'models/marble2.glb',
      
        visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
        invisibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS
    })
            
    Transform.create(bubble, {
      position: Vector3.create(8,5.5,8),
      scale: Vector3.create(2,2,2),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })


    // Setup our world
    const world: CANNON.World = new CANNON.World()
    world.gravity.set(0, -9.82, 0) // m/s²
  
    // Add invisible colliders
    loadColliders(world)
  
    const groundPhysicsMaterial = new CANNON.Material('groundMaterial')
    const groundPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, groundPhysicsMaterial, {
      friction: 0.5,
      restitution: 0.33
    })
    world.addContactMaterial(groundPhysicsContactMaterial)
  
    // Create a ground plane and apply physics material
    const groundBody: CANNON.Body = new CANNON.Body({
      mass: 0 // mass === 0 makes the body static
    })
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) // Reorient ground plane to be in the y-axis
  
    const groundShape: CANNON.Plane = new CANNON.Plane()
    groundBody.addShape(groundShape)
    groundBody.material = groundPhysicsMaterial
    world.addBody(groundBody)
  
    const ballPhysicsMaterial: CANNON.Material = new CANNON.Material('ballMaterial')
    const ballPhysicsContactMaterial = new CANNON.ContactMaterial(groundPhysicsMaterial, ballPhysicsMaterial, {
      friction: 0.4,
      restitution: 0.75
    })
    world.addContactMaterial(ballPhysicsContactMaterial)
  
    let addBubblesBody = (index: number) => {
      const bubbleTransform = Transform.get(bubbles[index].bubbleEntity)
  
      const bubbleBody: CANNON.Body = new CANNON.Body({
        mass: 5, // kg
        position: new CANNON.Vec3(bubbleTransform.position.x, bubbleTransform.position.y, bubbleTransform.position.z), // m
        shape: new CANNON.Sphere(1) // m (Create sphere shaped body with a radius of 1)
      })
  
      bubbleBody.material = ballPhysicsMaterial // Add bouncy material to ball body
      bubbleBody.linearDamping = 0.4 // Round will keep translating even with friction so you need linearDamping
      bubbleBody.angularDamping = 0.4 // Round bodies will keep rotating even with friction so you need angularDamping
  
      world.addBody(bubbleBody) // Add body to the world
      bubbleBodies.push(bubbleBody)
    }
    // Create bodies to represent each of the balls
    for (let i = 0; i < bubbles.length; i++) {
      addBubblesBody(i);
    }
  

    const fixedTimeStep: number = 1.0 / 60.0 // seconds
    const maxSubSteps: number = 3
  
    
    function updateSystem(dt: number): void {
      // Instruct the world to perform a single step of simulation.
      // It is generally best to keep the time step and iterations fixed.
      world.step(fixedTimeStep, dt, maxSubSteps)
  
      // Position and rotate the balls in the scene to match their cannon world counterparts
      for (let i = 0; i < bubbles.length; i++) {
  
          const bubbleTransform = Transform.getMutable(bubbles[i].bubbleEntity)
          bubbleTransform.position = bubbleBodies[i].position
          bubbleTransform.rotation = bubbleBodies[i].quaternion
      }
  
      // Update forward vector
      forwardVector = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation)
    }
  
    engine.addSystem(updateSystem)
  
   

}
