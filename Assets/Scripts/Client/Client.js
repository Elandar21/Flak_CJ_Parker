#pragma strict
//Contains any global information

public var guiSkin : GUISkin;
public var inGame : boolean = false;
public var visorArray : Texture2D[];
public var species : int = 0;
public var armor : int = 0;
public var heal : int = 0;
public var shield : int = 0;
public var prmAb : int = 0;
public var sndAb : int = 0;
private var charArmor : Transform[];
private var player : Transform;
static public var instance : Client = null;


function Start (){
	instance = this;
}

function Update (){
	instance = this;
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
//when the game starts the camera will parent to the mesh keeping the client script
