
public class GameLobby extends MonoBehaviour{
	var playerList = [];
	// Use this for initialization
	function Start (){
	}
	
	// Update is called once per frame
	function Update (){
		
	}
	
	function OnGUI() {
		GUILayout.BeginArea(Rect((Screen.width/2)-50,(Screen.height/2)-50,100,100));
		
		if(GUILayout.Button("Back",GUILayout.Width(100))){
			Network.Disconnect();
			this.Transition("MainMenu");
		}
		GUILayout.EndArea();
	}
	
	function Transition(name : String){
		this.enabled = false;
		this.gameObject.GetComponent(name).enabled = true;
		Destroy(this);
	}
	
	function OnPlayerConnected(player: NetworkPlayer) {
		
	}

}
