import { Entity, GltfContainer, Material, MeshRenderer, Transform, engine } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { Ceiling } from './definition'
import * as utils from '@dcl-sdk/utils'

export function addUi(){
  let showHint = false 
  let hideGlobe = false 
  let ceilingInterval = -1;

  ReactEcsRenderer.setUiRenderer(() => (
   
    <UiEntity
      uiTransform={{ 
        alignItems: 'flex-start',
        flexDirection: 'row',
       
        alignContent: 'flex-end',
			positionType: 'absolute',
			position: { right: "0%", top: '20px' }
        }}
    >

      <UiEntity
        uiTransform={{ 
          alignContent: 'flex-start',
          flexDirection: 'column'
          }}
          >
    
        <Button
          value= ""
          fontSize={ 15}
          variant= 'primary'
          uiTransform={{
            display: 'flex',
            width: 60, 
            height: 60,
            margin: '80 10 10px 0px' 
          }}
          uiBackground={{ 
            textureMode: 'stretch',
            texture: {
              src: "images/help.png"
  
            },
            color: Color4.create(1,1,1)
        }}
          onMouseDown={() => {
            console.log("Clicked on the UI")
            showHint = !showHint
            } }
        />

    <Button
        value= ""
        variant= 'primary'
        uiTransform={{
          display: hideGlobe ? 'flex': 'none',
          width: 60, 
          height: 60,
          margin: '10 10 10px 0px' 
        }}
        
        uiBackground={{ 
          textureMode: 'stretch',
		      texture: {
            src: "images/withoutneon.png"

		      },
          color: Color4.create(1,1,1)
      }}

        onMouseDown={() => {
          toggleExperience()
        }}
      />

<Button
        value= ""
        variant= 'primary'
        uiTransform={{
          display: hideGlobe ? 'none': 'flex',
          width: 60, 
          height: 60,
          margin: '10 10  10px 0px' 
        }}
        
        uiBackground={{ 
          textureMode: 'stretch',
		      texture: {
			      src: "images/withneon.png"
		      },
          color: Color4.create(1,1,1)
      }}

        onMouseDown={() => {
          toggleExperience()
        }}
      />

       
      </UiEntity>

      <UiEntity 
        
        uiTransform={{
        
          width: '500',
          height: '360',
          display: showHint ? 'flex': 'none',
          margin: '60px 0px 0px 0px' 
        }}
        uiBackground={{
          color: Color4.create(0, 0, 0, 0.6)
        }}
        
        >
        
          <Label
          
            textAlign="top-left"
            fontSize={15}
            value="
            Find the bubble that contains the real you! Kick it to 
            Glow Ball to check.
            
            Find it before time runs out to get to the next level.

            One with keen eyes will see hints of the right bubble.
            One with dull eyes, well bad luck! Just try them all!
            Add time to timer by collecting blue orbs.

            You win by completing all five levels.  

            Press E to:
            Reset level if midway.
            
            Start next level if level has been completed.
            
            Restart game if GameOver!"
          />
      </UiEntity>

      
    </UiEntity>

    
  ))

toggleExperience();


function toggleExperience(){
   const innerCeiling = engine.addEntity()
    GltfContainer.create(innerCeiling, {
        src: 'models/ceiling.glb'
    })
    Transform.createOrReplace(innerCeiling, {
        position: Vector3.create(32, 0, 32),
        scale: Vector3.create(16,18,16),
       
    }) 

  Ceiling.create(innerCeiling, {}) 

  hideGlobe = !hideGlobe
  
   const addGlowCeiling = () => {
    const ceiling = engine.addEntity()
    GltfContainer.create(ceiling, {
        src: 'models/ceiling.glb'
    })
    Transform.createOrReplace(ceiling, {
        position: Vector3.create(32, 0, 32),
        scale: Vector3.create(18,19,18),
       
    }) 

    Ceiling.create(ceiling, {})

    const glowCeiling = engine.addEntity();
    Transform.create(glowCeiling, {
      position: Vector3.create(32, 1, 32),
      //scale: Vector3.create(38,40,38)
      scale: Vector3.create(35,40,35)

    })
    
    MeshRenderer.setSphere(glowCeiling)
    Material.setPbrMaterial(glowCeiling, {
      albedoColor: {r: 15, g: 15, b: 25, a:1}
    })
    Ceiling.create(glowCeiling, {}) 
   }


   //"Harlequin_ Orb" (https://skfb.ly/oFtUt) by Egypt VR is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
   const addCircusCeiling = () => {
    const circusCeiling = engine.addEntity()
        GltfContainer.create(circusCeiling, {
            src: 'models/harlequin_orb.glb'
        })
        Transform.createOrReplace(circusCeiling, {
            position: Vector3.create(32, 0, 32),
            scale: Vector3.create(17,20,17),
           
        }) 
    
        Ceiling.create(circusCeiling, {}) 
   }


  if (hideGlobe) {

    addGlowCeiling();
    addCircusCeiling()


  } else {
  
    utils.timers.clearInterval(ceilingInterval)
    for (const [entity] of engine.getEntitiesWith(Ceiling)) {
      engine.removeEntity(entity)
    }
  }
}
}


