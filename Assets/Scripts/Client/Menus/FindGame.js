
public class FindGame extends MonoBehaviour{
	var startTime = Time.time;
	private var data : HostData[];			 //list of host data to find server

	// Use this for initialization
	function Start () {
		data = MasterServer.PollHostList();
	}
	
	// Update is called once per frame
	function Update () {
		if(Time.time - startTime > 1000){
			data = MasterServer.PollHostList();
		}
	}
	
	function OnMasterServerEvent (msEvent : MasterServerEvent){
		if(msEvent == MasterServerEvent.HostListReceived){
			data = MasterServer.PollHostList();
		}
	}
	
	function OnGUI() {
		GUI.skin = this.gameObject.GetComponent(Client).guiSkin;
		GUI.Box (Rect (0,0,Screen.width,Screen.height),"Find a Game");
		GUILayout.BeginArea(Rect(0,0,1200,300));
		
		if(data != null){
			for (var element in data){
				GUILayout.BeginHorizontal();
				var name = element.gameName;
				var com = element.com.Split(" ");
				GUILayout.Label(name);
				var count = element.connectedPlayers + " / " + (com[0]);
				GUILayout.Space(25);
				GUILayout.Label(count);
				GUILayout.Space(25);
				GUILayout.Label(com[1]);
				GUILayout.Space(25);
				GUILayout.FlexibleSpace();
				if (GUILayout.Button("Connect")){
					Network.Connect(element);
					//add any info needed here
					this.Transition(GameLobby);		
				}
				GUILayout.EndHorizontal();	
			}
		}
		GUILayout.EndArea();
		if(GUILayout.Button("Back",GUILayout.Width(100))){
			this.Transition(MainMenu);
		}
	}
	
	function Transition(name : System.Type){
		this.enabled = false;
		this.gameObject.GetComponent(name).enabled = true;
		Destroy(this);
	}
}
