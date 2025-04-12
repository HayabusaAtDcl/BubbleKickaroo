import { Entity, GltfContainer, Material, MeshRenderer, Transform, engine } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import * as utils from '@dcl-sdk/utils'
import { createQuestUI, questUI } from 'lsc-questing-dcl'


export let showHint = false
export function addUi(){
  
  ReactEcsRenderer.setUiRenderer(uiComponent)

  createQuestUI()
}

export const uiComponent:any = () => [
  
  UIHelp(),
  questUI()
]



export function UIHelp() {
  
  return (
    <UiEntity
      uiTransform={{ 
        alignItems: 'flex-start',
        flexDirection: 'row',
       
        alignContent: 'flex-end',
			positionType: 'absolute',
			position: { right: "0%", top: '100px' }
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


       
      </UiEntity>

      <UiEntity 
        
        uiTransform={{
        
          width: '400',
          height: '160',
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
            One of these boxes contain the egg!
            
            Just click until you find the right one.
            Don't delay. More boxes will be added 
            every minute.

            Happy Hunting!
            
            "
          />
      </UiEntity>

      
    </UiEntity>

  )
}

