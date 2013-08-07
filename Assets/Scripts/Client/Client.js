#pragma strict
//Contains any global information

//GUI
public var guiSkin : GUISkin;
public var inGame : boolean = false;
public var visorArray : Texture2D[];
public var crossHairs : Texture2D;

//Player
public var species : int = 0;
private var player : Transform;
private var charArmor : Transform[];
private var Health : int = 100;
private var Shield : int = 100;
private var lastDamage : int;
private var gunList : int[];
private var gunIdx : int;
//Abilities
public var armor : int = 0;
public var healAb : int = 0;
public var shieldAb : int = 0;
public var prmAb : int = 0;
public var sndAb : int = 0;
//Instance
static public var instance : Client = null;

function Start (){
	instance = this;
	lastDamage = Time.timeSinceLevelLoad;
	gunIdx = 0;
}

function Awake(){
	instance = this;
}

function Update (){
	if((Time.timeSinceLevelLoad - lastDamage) > 3.0f){
		Shield += 1;  //add the bonus recharge rate in
		if(Shield > 100)
			Shield = 100;
	} 
}

function TakeDamage(Damage : int,Alleged : NetworkPlayer){
	if(Shield <= 0.0f){
		Health -= Damage;
		if(Health < 0.0f){
			Health = 0;
			networkView.RPC("Death",RPCMode.All,Alleged,Network.player);
		}
	}
	else{
		Shield -= Damage;
		if(Shield < 0.0f)
			Shield = 0;
	}
	lastDamage = Time.timeSinceLevelLoad;
}

function OnGUI(){
	if(inGame){
		GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),visorArray[species],ScaleMode.StretchToFill);
		GUI.DrawTexture(Rect(Screen.width/2-(crossHairs.width/2),Screen.height/2-(crossHairs.height/2),crossHairs.width,crossHairs.height),crossHairs);
	}
}

function Spawn(){
	charArmor = gameObject.GetComponent(MenuManager).charArmor;
	var spwnPnt : GameObject = GameManager.inst.SpawnPnt();
	if(spwnPnt != null)
		player = Network.Instantiate(charArmor[(species*2+(armor))],spwnPnt.transform.position,spwnPnt.transform.rotation,0);
	else
		Debug.LogError("Could not find Respawn Points, Check Tags");
		
	var cameraTransform = Camera.main.transform;
    cameraTransform.parent = player;
    //then adjust accordingly
    switch((species*2+armor)){
    	case 0:
    	case 1:
 			cameraTransform.localPosition = Vector3(0.0f,1.8f,0.0f);
 			break;
 		case 2:
 			cameraTransform.localPosition = Vector3(0.0f,2f,0.1f);
 			break;
 		case 3:
 			cameraTransform.localPosition = Vector3(0.0f,2f,0.0f);
 	}
 	DontDestroyOnLoad(player.gameObject);
 	//create gun and parent to arm
 	//arm rotation parent to camera
 	
 	
 	player.gameObject.AddComponent(Input_Handler);
}
