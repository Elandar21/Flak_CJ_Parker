#pragma strict
//Contains any global information

public var guiSkin : GUISkin;
public var inGame : boolean = false;
public var visor : Texture2D;

function Start (){
}

function Update (){
	
}

function OnGUI(){
	if(inGame){
		GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),visor,ScaleMode.ScaleToFit);
	}
}
//when the game starts the camera will parent to the mesh keeping the client script
//that is the idea at least
