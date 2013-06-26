
public class CreateGame extends MonoBehaviour{
	var gameName : String = '';
	var map : int = 0;
	var playerCnt : int = 0;
	var gameTime : int = 0;
	var maxKills : int = 0;
	var mapNameArray : String[] = ["Sewer","Warehouse"];
	var playerNumArray : String[] = ['2','4','8','16','32'];
	var gameTimeArray : String[] = ["Infinity","5","10","15","25"];
	var gameMaxKillsArray : String[] = ["Infinity","5","10","15","25"];
	//team variables
	var teamBased : boolean = false;
	var teamCount : int = 0;
	
	// Use this for initialization
	function Start () {
	
	}
	
	// Update is called once per frame
	function Update () {
	}
	
	function OnGUI() {
		GUI.skin = this.gameObject.GetComponent(Client).guiSkin;
		GUI.Box (Rect (0,0,Screen.width,Screen.height),"Game Creation");
		GUILayout.BeginArea(Rect(50,(Screen.height/4),200,600));
		//Ask for name
		GUILayout.Label("Name:");
		GUILayout.Label("Map:");
		GUILayout.Label("Player Count:");
		GUILayout.Label("Time:");
		GUILayout.Label("Kills:");
		GUILayout.EndArea();
		
		GUILayout.BeginArea(Rect(275,(Screen.height/4),275,250));
		gameName = GUILayout.TextField(gameName, 50);
		
		//map
		map = GUILayout.Toolbar(map,mapNameArray);
		
		//player count
		playerCnt = GUILayout.Toolbar(playerCnt,playerNumArray);
		PlayerCnt = playerCnt;
		//ask for time
		gameTime = GUILayout.Toolbar(gameTime,gameTimeArray);
		if(gameTimeArray[gameTime] != "Infinity")
			this.gameObject.GetComponent(Client).TotalGameTime = int.Parse(gameTimeArray[gameTime]);
		else
			this.gameObject.GetComponent(Client).TotalGameTime = -1;
		//ask for kill count
		maxKills = GUILayout.Toolbar(maxKills,gameMaxKillsArray);
		if(gameMaxKillsArray[maxKills] != "Infinity")
			this.gameObject.GetComponent(Client).GameMaxKills = int.Parse(gameMaxKillsArray[maxKills]);
		else
			this.gameObject.GetComponent(Client).GameMaxKills = -1;
		//game types? teams?
		GUILayout.Space(50);
		if(GUILayout.Button("Create Game",GUILayout.Width(100))){
			if(!gameName.Equals("")){
				this.gameObject.GetComponent(Client).MPMngr.CreateServer(gameName,playerCnt,map);
				this.gameObject.AddComponent("GameLobby");
				this.Transition("GameLobby");
			}
			else{
				GUI.Label(Rect((Screen.width/2)-100,Screen.height-50,200,100),"Game has no name");
			}
		}
		if(GUILayout.Button("Back",GUILayout.Width(100))){
			this.Transition("MainMenu");
		}
		//let them choose the team count
		GUILayout.EndArea();
	}
	
	
	function Transition(name : String){
		this.enabled = false;
		this.gameObject.GetComponent(name).enabled = true;
		Destroy(this);
	}
}
