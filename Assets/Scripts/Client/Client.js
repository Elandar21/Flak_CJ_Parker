#pragma strict
//Contains any global information

//GUI
public var guiSkin : GUISkin;
public var inGame : boolean = false;
public var visorArray : Texture2D[];
//Player
public var species : int = 0;
private var player : Transform;
private var charArmor : Transform[];
public var Health : int = 100;
public var Shield : int = 100;
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
}

function Awak(){
	instance = this;
}

function Update (){

}

function OnGUI(){
	if(inGame){
		GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),visorArray[species],ScaleMode.StretchToFill);
	}
}

function gameStart(){
	charArmor = gameObject.GetComponent(MenuManager).charArmor;
	var spwnPnt : GameObject = SpawnPnt();
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
 	player.gameObject.AddComponent(Input_Handler);
 	inGame = true;
}

function SpawnPnt(){
	var spwnID : int;
	var spwnPnts : GameObject[] = GameObject.FindGameObjectsWithTag("Respawn");
	if(spwnPnts.Length == 0){
		return null;
	}
	spwnID = Random.Range(0,spwnPnts.Length);
	return spwnPnts[spwnID];
}
//Rework game creation and seperate Game events from Mulitplayer Manager
