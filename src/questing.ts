import { engine, Entity, InputAction, PointerEvents, pointerEventsSystem } from "@dcl/sdk/ecs"
import { LSCQuestAction, LSCQuestConnect, LSCQuestLeaderboard } from "lsc-questing-dcl"
import { Quaternion, Vector3 } from "@dcl/sdk/math"

//prod
/* Quest ID :  KsyZNX
Step ID: SksNfB 
Task ID:  3wBsK
*/

/*
quest FlKFGg
step 19yLR7
tesk 9vvv4


*/

// PROD SET
//export const QUEST_ID = "KsyZNX" // Change to your Quest ID
//export const STEP_ID = "SksNfB" // Change to your Step ID
//export const TASK_ID = "3wBsK" // Change to your Task ID


//export const QUEST_ID = "Xyq7Wk" // Change to your Quest ID
//export const STEP_ID = "Ld4H70" // Change to your Step ID
//export const TASK_ID = "pJYip" // Change to your Task ID


export const QUEST_ID = "FlKFGg" // Change to your Quest ID
export const STEP_ID = "19yLR7" // Change to your Step ID
export const TASK_ID = "9vvv4" // Change to your Task ID



export let taskDone: boolean = false;
export function LSCQuesting(){
    LSCQuestConnect( QUEST_ID)

	
  
	LSCQuestLeaderboard(
		QUEST_ID, // questId
		{position: Vector3.create(15.5,4.3,8), rotation: Quaternion.fromEulerDegrees(0,90,0), scale: Vector3.create(0.5,0.5,0.5)}, // position in Vector3
		5, // updateInterval in seconds
		10, // limit of users to show
		'asc', // order 'asc' or 'desc'
		'progress', // sortBy 'elapsedTime' or other quest field
		false, // completed users only
		true, // showBackground
		"Egg Hunt 2025" // title
	  )

}

export function AddQuestAction(box: Entity, sceneEgg: Entity | null){
	pointerEventsSystem.onPointerDown(
		{
			entity: box,
			opts: {
			button: InputAction.IA_POINTER,
			hoverText: 'Collect!'
			}
		},
		function (cmd: any) {

			
			LSCQuestAction(QUEST_ID, STEP_ID, TASK_ID)

			if (sceneEgg != null)
				engine.removeEntity(sceneEgg)
			PointerEvents.deleteFrom(box)

	})

}


/////////////////// LSC QUESTING FUNCTIONS AND OPTIONAL EVENT LISTENERS ///////////////////

//// Starting a Quest
// LSCQuestStart(QUEST_ID)

//// Running a Quest Action
// LSCQuestAction(QUEST_ID, STEP_ID, TASK_ID)


//// Listenting to Quest Events
 //lscQuestEvent.on(LSCQUEST_EVENTS.QUEST_STARTED, (eventInfo:any)=>{
 	//console.log('received a new quest event action', eventInfo)
 //})

// lscQuestEvent.on(LSCQUEST_EVENTS.QUEST_COMPLETE, (eventInfo:any)=>{
// 	console.log('received a quest complete', eventInfo)
// })

// lscQuestEvent.on(LSCQUEST_EVENTS.QUEST_STEP_COMPLETE, (eventInfo:any)=>{
// 	console.log('received a new quest step complete', eventInfo)
// })

// lscQuestEvent.on(LSCQUEST_EVENTS.QUEST_TASK_COMPLETE, (eventInfo:any)=>{
// 	console.log('received a new quest task complete', eventInfo)
// })

// lscQuestEvent.on(LSCQUEST_EVENTS.QUEST_END, (eventInfo:any)=>{
// 	console.log('received a quest end', eventInfo)
// })

// lscQuestEvent.on(LSCQUEST_EVENTS.QUEST_ERROR, (eventInfo:any)=>{
// 	console.log('received a quest error', eventInfo)
// })

 //lscQuestEvent.on(LSCQUEST_EVENTS.QUEST_DATA, (eventInfo:any)=>{
//	console.log('received a quest error', eventInfo)
 //})
