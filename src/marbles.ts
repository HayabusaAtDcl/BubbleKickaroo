import { engine, pointerEventsSystem, InputAction, inputSystem, PointerEventType, Transform, TextShape, AudioSource, RealmInfo, TextAlignMode } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"
import { Ball } from "./ball"
import { MiniMe } from "./miniMe"
import { loadColliders } from "./wallCollidersSetup"
import * as utils from '@dcl-sdk/utils' 
import { popSound, winSound } from "./resource"
import CANNON from "cannon"

let realMeIndex = 0;
let foundMe = false;
let gameOver = false;

export function addMarbles(userData: any, numberOfMarbles: number, modelPath: string) {
    let balls: Ball[] = [] // Store balls
    let miniMes: MiniMe[] = [];
    let ballBodies: CANNON.Body[] = [] // Store ball bodies
    let currentLevel = 0;

    realMeIndex =  Math.floor(Math.random() * numberOfMarbles);

    let ballHeight = 12 // Start height for the balls
    let forwardVector: Vector3 = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation) // Camera's forward vector
    const vectorScale: number = 25
  
    let randomPositions: any = []
    // Create random balls and positions
    
    let addBall = (index: number) => {
      const randomPositionX: number = Math.floor(Math.random() * 3) + 16
      const randomPositionY: number = ballHeight
      const randomPositionZ: number = Math.floor(Math.random() * 3) + 21
      randomPositions.push({ x: randomPositionX, y: randomPositionY, z: randomPositionZ })
  
      const ball = new Ball(modelPath, {
        position: randomPositions[index],
        rotation: Quaternion.Zero(),
        scale: Vector3.One()
      })
      balls.push(ball)
      ballHeight += 2 // To ensure the colliders aren't intersecting when the simulation starts
  
      const miniMe = new MiniMe(userData, randomPositions[index], index*1000, realMeIndex === index)
      miniMes.push(miniMe)

      // Allow the user to interact with the ball
      pointerEventsSystem.onPointerDown(
        {
          entity: ball.entity,
          opts: {
            button: InputAction.IA_POINTER,
            hoverText: 'kick'
          }
        },
        function (cmd: any) {
          // Apply impulse based on the direction of the camera
          ballBodies[index].applyImpulse(
            new CANNON.Vec3(forwardVector.x * vectorScale, forwardVector.y * vectorScale, forwardVector.z * vectorScale),
            // Applies impulse based on the player's position and where they click on the ball
            new CANNON.Vec3(cmd.hit?.position?.x, cmd.hit?.position?.y, cmd.hit?.position?.z)
          )
        }
      )
    }

    for (let i = 0; i < numberOfMarbles; i++) {
      addBall(i)
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
  
    let addBallsBody = (index: number) => {
      const ballTransform = Transform.get(balls[index].entity)
  
      const ballBody: CANNON.Body = new CANNON.Body({
        mass: 5, // kg
        position: new CANNON.Vec3(ballTransform.position.x, ballTransform.position.y, ballTransform.position.z), // m
        shape: new CANNON.Sphere(1) // m (Create sphere shaped body with a radius of 1)
      })
  
      ballBody.material = ballPhysicsMaterial // Add bouncy material to ball body
      ballBody.linearDamping = 0.4 // Round will keep translating even with friction so you need linearDamping
      ballBody.angularDamping = 0.4 // Round bodies will keep rotating even with friction so you need angularDamping
  
      world.addBody(ballBody) // Add body to the world
      ballBodies.push(ballBody)
    }
    // Create bodies to represent each of the balls
    for (let i = 0; i < balls.length; i++) {
      addBallsBody(i);
    }
  

    const fixedTimeStep: number = 1.0 / 60.0 // seconds
    const maxSubSteps: number = 3
  
    function updateSystem(dt: number): void {
      // Instruct the world to perform a single step of simulation.
      // It is generally best to keep the time step and iterations fixed.
      world.step(fixedTimeStep, dt, maxSubSteps)
  
      // Position and rotate the balls in the scene to match their cannon world counterparts
      for (let i = 0; i < balls.length; i++) {
  
        if (!balls[i].isHidden) {
          const ballTransform = Transform.getMutable(balls[i].entity)
          ballTransform.position = ballBodies[i].position
          ballTransform.rotation = ballBodies[i].quaternion
    
          const miniMeTransform = Transform.getMutable(miniMes[i].entity)
          miniMeTransform.position = ballBodies[i].position
          miniMeTransform.rotation = ballBodies[i].quaternion
          
    
          const marbleInArea = ballBodies[i].position.x >= 8.67 && ballBodies[i].position.x <= 12.5 
          && ballBodies[i].position.z >= 13 && ballBodies[i].position.z <= 15.5;
    
    
          if (marbleInArea){
            balls[i].isHidden = true;
           
            ballTransform.position = Vector3.create(8,12, 8)
            miniMeTransform.position = Vector3.create(8,12, 8)
            
            if (i === realMeIndex){
              foundMe = true;
            }
          } 
        }
      }
  
      // Update forward vector
      forwardVector = Vector3.rotate(Vector3.Forward(), Transform.get(engine.CameraEntity).rotation)
      // console.log('Forward Vector: ', forwardVector)
    }
  
    engine.addSystem(updateSystem)
  
    // Input system
    engine.addSystem(() => {
      // Reset with the E key
      const primaryDown = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
      if (primaryDown) {
        
        
        if (foundMe === true) {
          //add more marbles? TODO: set level display? and marble count??

          let currentBallsLength = balls.length;
          realMeIndex =  Math.floor(Math.random() * currentBallsLength*2);


          for (let i = 0; i < ballBodies.length; i++) {
            balls[i].isHidden = false;


            const previousIsRealMe = miniMes[i].isRealMe;
           
            miniMes[i].isRealMe = i === realMeIndex;
            if (previousIsRealMe !== miniMes[i].isRealMe) {
              miniMes[i].updateMiniMeHintInterval()
            }
            
            ballBodies[i].position.set(randomPositions[i].x, randomPositions[i].y, randomPositions[i].z)
            
            const miniMeTransform = Transform.getMutable(miniMes[i].entity)
            miniMeTransform.scale = Vector3.create(0.5,.5,.5)
          }

          
          for (let i = currentBallsLength; i < currentBallsLength*2; i++) {
            addBall(i)
            addBallsBody(i)
          }

            
          foundMe = false;
          currentLevel = currentLevel + 1;

         
          const mutableLevelSignText = TextShape.getMutable(levelSign)
          mutableLevelSignText.text = "Level "+ (currentLevel + 1).toString()


          
        } else if (gameOver ){

        
          realMeIndex =  Math.floor(Math.random() * numberOfMarbles);
          for (let i = 0; i < numberOfMarbles; i++) {
            addBall(i)
            addBallsBody(i)
          }
          engine.addSystem(updateSystem)
          gameOver = false;
          currentLevel = 1;
        } else {
          for (let i = 0; i < ballBodies.length; i++) {
            balls[i].isHidden = false;

            
            ballBodies[i].position.set(randomPositions[i].x, randomPositions[i].y, randomPositions[i].z)
            
            const miniMeTransform = Transform.getMutable(miniMes[i].entity)
            miniMeTransform.scale = Vector3.create(0.5,.5,.5)
          }
        }
        
        timer = startingTimer + 1;
        setTimer();
      }
    })


    // Set up count down
    const startingTimer = 120;
    let timer = startingTimer;

    const countDown = engine.addEntity()
    Transform.create(countDown, {
        position: Vector3.create(4, 5, 17),
        rotation: Quaternion.fromEulerDegrees(0, 200, 0),
        scale: Vector3.create(1, 1, 1)
    })
    TextShape.create(countDown, {
      text: timer.toString(),
      textColor: { r: 102, g: 0, b: 102, a: 1 },
      textAlign: TextAlignMode.TAM_TOP_CENTER
    })
  
    let setTimer = () => {
      let intervalId = utils.timers.setInterval(function () {
  
        timer = timer-1;
        const mutableText = TextShape.getMutable(countDown)

        let resetMarbles = () => {
          utils.timers.clearInterval(intervalId)
          engine.removeSystem(updateSystem)

          for (let i = 0; i < balls.length; i++) {
              Transform.getMutable(popSound).position = Transform.get(engine.PlayerEntity).position
              AudioSource.getMutable(popSound).playing = true

              utils.timers.clearInterval(miniMes[i].hintInterval);
              engine.removeEntity(balls[i].entity)
              engine.removeEntity(miniMes[i].entity)
              world.remove(ballBodies[i])

          }

          balls = [];
          miniMes = [];
          ballBodies = [];
          randomPositions = [];
          currentLevel = 1;

        }


        if (timer <= 0) {
          utils.timers.clearInterval(intervalId)
          engine.removeSystem(updateSystem)

          resetMarbles();
    
          mutableText.text = "GAME\nOVER!"
         
          gameOver = true;
    
        } else {
    
            if (foundMe) {

              if (currentLevel === 3) {
                mutableText.text = "You won!";

                resetMarbles();
                currentLevel = 0;
                gameOver = true;
                foundMe = false;
              } else {
                mutableText.text = "Super!\n E to \n continue";
              }
              
              utils.timers.clearInterval(intervalId)
  
              Transform.getMutable(winSound).position = Transform.get(engine.PlayerEntity).position
              AudioSource.getMutable(winSound).playing = true
            
              
            } else {
              mutableText.text = timer.toString();
            }
        }
      
      }, 1000)
    }
  
    setTimer();


    const levelSign = engine.addEntity()
    Transform.create(levelSign, {
        position: Vector3.create(4, 8, 17),
        rotation: Quaternion.fromEulerDegrees(0, 200, 0),
        scale: Vector3.create(1,1,1)
    })
    TextShape.create(levelSign, {
      text: "Level " + (currentLevel + 1).toString(),
      textColor: { r: 255, g: 0, b: 255, a: 1 },
    })
}
