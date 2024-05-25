import { engine, pointerEventsSystem, InputAction, inputSystem, PointerEventType, Transform, TextShape, AudioSource, TextAlignMode, MeshRenderer, Material, Billboard } from "@dcl/sdk/ecs"
import { Vector3, Quaternion, Color3 } from "@dcl/sdk/math"
import { loadColliders } from "./wallCollidersSetup"
import * as utils from '@dcl-sdk/utils' 
import { carnivalSound, clapSound, dingSound, generateRandomNumber, popSound, waoSound, winSound } from "./resource"
import CANNON from "cannon"
import { triggerEmote, triggerSceneEmote } from "~system/RestrictedActions"
import { Bubble } from "./bubble"
import { TimerOrb } from "./definition"


export function addBubbles(userData: any, numberOfBubbles: number, modelPath: string) {
    const startingTimer = 180;
    let realMeIndex = generateRandomNumber(0, numberOfBubbles-1);
    let foundMe = false;
    let gameOver = false;
    let currentLevel = 0;
    
    let bubbles: Bubble[] = [] 
    let bubbleBodies: CANNON.Body[] = [] 

    let ballHeight = 10 // Start height for the balls
    let forwardVector: Vector3 = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation) // Camera's forward vector
    const vectorScale: number = 25
  
    let randomPositions: any = []
    let addBubble = (index: number) => {
      const randomPositionX: number = Math.floor(Math.random() * 3) + 32
      const randomPositionY: number = ballHeight
      const randomPositionZ: number = Math.floor(Math.random() * 3) + 32
      randomPositions.push({ x: randomPositionX, y: randomPositionY, z: randomPositionZ })
  
      const bubble = new Bubble(modelPath, 
        {
          position: randomPositions[index],
          rotation: Quaternion.Zero(),
          scale: Vector3.One()
        }, userData, index*1000, realMeIndex === index)

      bubbles.push(bubble)
      ballHeight += 2 // To ensure the colliders aren't intersecting when the simulation starts
  
    
      
      // Allow the user to interact with the ball
      pointerEventsSystem.onPointerDown(
        {
          entity: bubble.bubbleEntity,
          opts: {
            button: InputAction.IA_POINTER,
            hoverText: 'kick'
          }
        },
        function (cmd: any) {
          // Apply impulse based on the direction of the camera
          bubbleBodies[index].applyImpulse(
            new CANNON.Vec3(forwardVector.x * vectorScale, forwardVector.y * vectorScale, forwardVector.z * vectorScale),
            // Applies impulse based on the player's position and where they click on the ball
            new CANNON.Vec3(cmd.hit?.position?.x, cmd.hit?.position?.y, cmd.hit?.position?.z)
          )
        }
      )
    }

    for (let i = 0; i < numberOfBubbles; i++) {
      addBubble(i)
    }


    //set up moving glowing orb
    const glowingOrb = engine.addEntity();
    Transform.create(glowingOrb, {
      position: Vector3.create(28, 1, 28),
    })
    
    MeshRenderer.setSphere(glowingOrb)
    Material.setPbrMaterial(glowingOrb, {
      albedoColor: {r: 15, g: 0, b: 0, a:1}
    })

    utils.timers.setInterval( () => {
      const randomxLocation = generateRandomNumber(20, 40)
      const randomzLocation = generateRandomNumber(20, 40)
      const targetTransform =Transform.getMutable(glowingOrb);
      targetTransform.position.x = randomxLocation
      targetTransform.position.z = randomzLocation
    }, 15000)


    //set up timer orbs
    const addTimeOrbs = (numberOfOrbs: number) => {
      for (let i = 0; i < numberOfOrbs; i++) {
        addTimerOrb()
      }
    }


    let orbTimerIntervals: number[] = [];
    const addTimerOrb = () => {

      const randomxLocation = generateRandomNumber(20, 40)
      const randomzLocation = generateRandomNumber(20, 40)

      const timerOrb = engine.addEntity();
      Transform.create(timerOrb, {
        position: Vector3.create(randomxLocation, 1, randomzLocation),
        scale: Vector3.create(.2,.2, .2 )
      })
      
      MeshRenderer.setSphere(timerOrb)
      Material.setPbrMaterial(timerOrb, {
        albedoColor: {r: 15, g: 15, b: 25, a:1}
      })

      TimerOrb.create(timerOrb, {})

      let timerOrbInterval = utils.timers.setInterval( () => {
        const randomxLocation = generateRandomNumber(20, 40)
        const randomzLocation = generateRandomNumber(20, 40)
        const targetTransform =Transform.getMutable(timerOrb);
        targetTransform.position.x = randomxLocation
        targetTransform.position.z = randomzLocation
      }, 1000)

      orbTimerIntervals.push(timerOrbInterval)

      utils.triggers.addTrigger(
        timerOrb,
        utils.LAYER_1,
        utils.LAYER_1,
        [{ type: 'sphere' }],
        () => {
          timer = timer + 10;
          utils.timers.clearInterval(timerOrbInterval)
          engine.removeEntity(timerOrb)

          Transform.getMutable(dingSound).position = Transform.get(engine.PlayerEntity).position
          AudioSource.getMutable(dingSound).playing = true
        }, undefined, Color3.Yellow()) 

    }

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
  
        if (!bubbles[i].isHidden) {
          const bubbleTransform = Transform.getMutable(bubbles[i].bubbleEntity)
          bubbleTransform.position = bubbleBodies[i].position
          bubbleTransform.rotation = bubbleBodies[i].quaternion
    
          const miniMeTransform = Transform.getMutable(bubbles[i].miniMeEntity)
          miniMeTransform.position = bubbleBodies[i].position
          miniMeTransform.rotation = bubbleBodies[i].quaternion
          
          const glowingOrbTransform = Transform.getMutable(glowingOrb);
    
          const bubbleInArea = (bubbleBodies[i].position.x >= (glowingOrbTransform.position.x - 1)) 
                                  && (bubbleBodies[i].position.x <= (glowingOrbTransform.position.x + 1))
                                  && (bubbleBodies[i].position.z >= (glowingOrbTransform.position.z - 1))  
                                  && (bubbleBodies[i].position.z <= (glowingOrbTransform.position.z + 1))
                                  && (bubbleBodies[i].position.y <= (glowingOrbTransform.position.y + 1))
                                  && (bubbleBodies[i].position.y >= (glowingOrbTransform.position.y - 1))

          if (bubbleInArea) {
            bubbles[i].isHidden = true;
            bubbleTransform.position = Vector3.create(33, 11, 33)
            miniMeTransform.position = Vector3.create(33, 10.9, 33)
            
            if (i === realMeIndex) {
              foundMe = true;
            }
          } 
        }
      }
  
      // Update forward vector
      forwardVector = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation)
    }
  
    engine.addSystem(updateSystem)
  
    // Input system
    engine.addSystem(() => {
      // Reset with the E key
      const primaryDown = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
      if (primaryDown) {

        if (foundMe === true) {

          foundMe = false;

          let currentNumberOfBubbles = bubbles.length;

          let newNumberOfBubbles = currentNumberOfBubbles
          if (currentLevel < 3){
            newNumberOfBubbles = currentNumberOfBubbles + 6  
          } else {
            addTimeOrbs(10)
          }
          realMeIndex = Math.floor(Math.random() * newNumberOfBubbles);

          
          for (let i = 0; i < bubbleBodies.length; i++) {
            bubbles[i].isHidden = false;

            const previousIsRealMe = bubbles[i].isRealMe;
           
            bubbles[i].isRealMe = i === realMeIndex;
            if (previousIsRealMe !== bubbles[i].isRealMe) {
              bubbles[i].updateMiniMeHintInterval()
            }
            
            bubbleBodies[i].position.set(randomPositions[i].x, randomPositions[i].y, randomPositions[i].z)
          }

          
          for (let i = currentNumberOfBubbles; i < newNumberOfBubbles; i++) {
            addBubble(i)
            addBubblesBody(i)
          }

            
          
          currentLevel = currentLevel + 1;
         
          const mutableLevelSignText = TextShape.getMutable(levelSign)
          mutableLevelSignText.text = "Level "+ (currentLevel + 1).toString()

        } else if (gameOver) {
          gameOver = false;
          realMeIndex =  Math.floor(Math.random() * numberOfBubbles);
          for (let i = 0; i < numberOfBubbles; i++) {
            addBubble(i)
            addBubblesBody(i)
          }
          engine.addSystem(updateSystem)
          
          currentLevel = 0;
          const mutableLevelSignText = TextShape.getMutable(levelSign)
          mutableLevelSignText.text = "Level "+ (currentLevel + 1).toString()

        } else {

          utils.timers.clearInterval(countDownIntervalId)
          for (let i = 0; i < bubbleBodies.length; i++) {
            bubbles[i].isHidden = false;
            bubbleBodies[i].position.set(randomPositions[i].x, randomPositions[i].y, randomPositions[i].z)
          }


          orbTimerIntervals.map(o => utils.timers.clearInterval(o));
          for (const [entity] of engine.getEntitiesWith(TimerOrb)) {
            engine.removeEntity(entity)
          }
          if (currentLevel > 3) {
            addTimeOrbs(10)
          }
        }
        
        timer = (currentLevel <= 3 ? startingTimer : 60) + 1;
        setTimer();
      }
    })


    // Set up count down
    let timer = startingTimer;

    const countDown = engine.addEntity()
    Transform.create(countDown, {
        position: Vector3.create(21, 8, 33),
        rotation: Quaternion.fromEulerDegrees(0, 200, 0),
        scale: Vector3.create(0.9,.9,.9)
    })
    TextShape.create(countDown, {
      text: timer.toString(),
      textColor: { r: 102, g: 0, b: 102, a: 1 },
      textAlign: TextAlignMode.TAM_TOP_CENTER
    })
    Billboard.create(countDown, {})
  
    const affirmations = ['Super', 'Yay', 'Grand', 'Wow', 'Yes']
    let countDownIntervalId = -1;
    let setTimer = () => {
      countDownIntervalId = utils.timers.setInterval(function () {
  
        timer = timer-1;
        const mutableText = TextShape.getMutable(countDown)

        let resetBubbles = () => {
          utils.timers.clearInterval(countDownIntervalId)
          engine.removeSystem(updateSystem)

          for (let i = 0; i < bubbles.length; i++) {
              Transform.getMutable(popSound).position = Transform.get(engine.PlayerEntity).position
              AudioSource.getMutable(popSound).playing = true

              utils.timers.clearInterval(bubbles[i].hintInterval);
              pointerEventsSystem.removeOnPointerDown(bubbles[i].bubbleEntity)
              engine.removeEntity(bubbles[i].bubbleEntity)
              engine.removeEntity(bubbles[i].miniMeEntity)
              world.remove(bubbleBodies[i])
          }

          orbTimerIntervals.map(o => utils.timers.clearInterval(o));
          for (const [entity] of engine.getEntitiesWith(TimerOrb)) {
            engine.removeEntity(entity)
          }

          bubbles = [];
          bubbleBodies = [];
          randomPositions = [];
          currentLevel = 1;
          ballHeight = 10;
        }


        if (timer <= 0) {
          utils.timers.clearInterval(countDownIntervalId)
          engine.removeSystem(updateSystem)

          resetBubbles();
    
          mutableText.text = "GAME\nOVER!"
          triggerSceneEmote({ src: 'animations/loser.glb', loop: true })
          gameOver = true;
        } else {
    
            if (foundMe) {
              utils.timers.clearInterval(countDownIntervalId)
              if (currentLevel >= 4) {
                triggerEmote({ predefinedEmote: 'handsair' })
                mutableText.text = "BRAVO!\n You won";

                AudioSource.getMutable(carnivalSound).playing = false;

                Transform.getMutable(waoSound).position = Transform.get(engine.PlayerEntity).position
                AudioSource.getMutable(waoSound).playing = true

                utils.timers.setTimeout(()=>{
                  Transform.getMutable(clapSound).position = Transform.get(engine.PlayerEntity).position
                  AudioSource.getMutable(clapSound).playing = true
                  AudioSource.getMutable(carnivalSound).playing = true;
                }, 1500);

                
              
                resetBubbles();
                currentLevel = 0;
                gameOver = true;
                foundMe = false;
                
              } else {

                Transform.getMutable(winSound).position = Transform.get(engine.PlayerEntity).position
                AudioSource.getMutable(winSound).playing = true
                const affirmRand = generateRandomNumber(0,affirmations.length-1)
                mutableText.text = affirmations[affirmRand] + "!\n E to \n continue";
                
              }
            } else {
              mutableText.text = timer.toString();
            }
        }
      
      }, 1000)
    }
  
    setTimer();

    const levelSign = engine.addEntity()
    Transform.create(levelSign, {
        position: Vector3.create(21, 10, 33),
        rotation: Quaternion.fromEulerDegrees(0, 200, 0),
        scale: Vector3.create(1,1,1)
    })
    TextShape.create(levelSign, {
      text: "Level " + (currentLevel + 1).toString(),
      textColor: { r: 0, g: 255, b: 0, a: 1 },
      textAlign:  TextAlignMode.TAM_TOP_CENTER
    })

    Billboard.create(levelSign, {})

    const levelPlane = engine.addEntity()
    Transform.create(levelPlane, {
        position: Vector3.create(21, 8, 33),
        rotation: Quaternion.fromEulerDegrees(0, 200, 0),
        scale: Vector3.create(4,8,4)
    })
    
    MeshRenderer.setPlane(levelPlane)
    Material.setPbrMaterial(levelPlane, {
      albedoColor: {r: 0, g: 0, b: 0, a:.5}
    })

    Billboard.create(levelPlane, {})


    
    
}
