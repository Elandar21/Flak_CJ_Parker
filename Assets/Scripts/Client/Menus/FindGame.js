
public class FindGame extends MonoBehaviour{
	var GameName : String = '';
	var startTime = Time.time;

	// Use this for initialization
	function Start () {
		this.gameObject.GetComponent(Client).data = MasterServer.PollHostList();
	}
	
	// Update is called once per frame
	function Update () {
		if(Time.time - startTime > 1000){
			this.gameObject.GetComponent(Client).data = MasterServer.PollHostList();
		}
	}
	
	function OnMasterServerEvent (msEvent : MasterServerEvent){
		if(msEvent == MasterServerEvent.HostListReceived){
			this.gameObject.GetComponent(Client).data = MasterServer.PollHostList();
		}
	}
	
	function OnGUI() {
		//GUILayout.BeginArea(Rect((Screen.width/2)-50,(Screen.height/2)-50,200,100));
		if(this.gameObject.GetComponent(Client).data != null){
			for (var element in this.gameObject.GetComponent(Client).data){
				GUILayout.BeginHorizontal();
				var name = element.gameName + " " + element.connectedPlayers + " / " + element.playerLimit;
				GUILayout.Label(name);	
				GUILayout.Space(5);
				var hostInfo : String;
				hostInfo = "[";
				for (var host in element.ip)
					hostInfo = hostInfo + host + ":" + element.port + " ";
				hostInfo = hostInfo + "]";
				GUILayout.Label(hostInfo);
				GUILayout.Space(5);
				GUILayout.Label(element.comment);
				GUILayout.Space(5);
				GUILayout.FlexibleSpace();
				if (GUILayout.Button("Connect")){
					Network.Connect(element);		
				}
				GUILayout.EndHorizontal();	
			}
		}
		//if(GUILayout.Button("Join Game",GUILayout.Width(100))){
		//	this.gameObject.AddComponent("GameLobby");
		//	this.Transition("GameLobby");
		//}
		if(GUILayout.Button("Back",GUILayout.Width(100))){
			this.Transition("MainMenu");
		}
		//GUILayout.EndArea();
	}
	
	function Transition(name : String){
		this.enabled = false;
		this.gameObject.GetComponent(name).enabled = true;
		Destroy(this);
	}
}
