
public class GameLobby extends MonoBehaviour{
	var playerList = [];
	var startTime = Time.time;
	// Use this for initialization
	function Start (){
	}
	
	// Update is called once per frame
	function Update (){
		//get the list of players and update it to the gameLobby
		if(Time.time - startTime > 1000){
			playerList = this.gameObject.GetComponent(Client).MPMngr.returnPlayerList();
		}
	}
	
	function OnGUI() {
		GUI.skin = this.gameObject.GetComponent(Client).guiSkin;
		GUI.Box (Rect (0,0,Screen.width,Screen.height),"Game Lobby");
		GUILayout.BeginArea(Rect((Screen.width/2)-50,(Screen.height/2)-50,300,100));
		//show the list of players connected
		for(pl in playerList){
			GUILayout.Label(pl.username);
		}
		GUILayout.EndArea();
		if(GUILayout.Button("Back",GUILayout.Width(100))){
			Network.Disconnect();
			this.Transition("MainMenu");
		}
	}
	
	function Transition(name : String){
		this.enabled = false;
		this.gameObject.GetComponent(name).enabled = true;
		Destroy(this);
	}

}
