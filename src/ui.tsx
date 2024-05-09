  import { Color4 } from '@dcl/sdk/math'
  import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

export function addClues(){
  let showHint = false 
 
  ReactEcsRenderer.setUiRenderer(() => (
   
    <UiEntity
      uiTransform={{ 
        alignItems: 'flex-start',
        flexDirection: 'column',
       
			justifyContent: 'space-between',
			positionType: 'absolute',
			position: { right: "0%", bottom: '0%' }
        }}
    >

      <UiEntity
        uiTransform={{ 
          flexDirection: 'row'
          }}
          >
    
        <Button
          value= {showHint?"Close":"Instructions"}
          fontSize={ 15}
          variant= 'primary'
          uiTransform={{
            width: 120, 
            height: 40,
            margin: '0px 0px 0px 0px' 
          }}
          uiBackground={{ color: Color4.create(0, 0, 0, 0.8) }}
          onMouseDown={() => {
            console.log("Clicked on the UI")
            showHint = !showHint
            } }
        />

       
      </UiEntity>

      <UiEntity 
        uiBackground={{
          color: Color4.create(0, 0, 0, 0.6)
        }}
        
        uiTransform={{
        
          width: '500',
          height: '380',
          display: showHint ? 'flex': 'none',
          margin: '0px 0px 0px 0px' 
        }}>
        
          <Label
          
            textAlign="top-left"
            fontSize={15}
            value="
            Find the bubble that contains the real you! Kick it to 
            Glow Ball to check.
            
            Find it before time runs out to get to the next level.

            One with keen eyes will see hints of the right bubble.
            One with dull eyes, well bad luck! Just try them all!

            You win if you complete level 4.

            Press E to:
            Reset level if midway.
            
            Start next level if level has been completed.
            
            Restart game if GameOver!"
          />
      </UiEntity>
    </UiEntity>
  ))
}


