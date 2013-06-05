
public class MainMenu extends MonoBehaviour{
	
	// Use this for initialization
	function Start () {
	}
	
	// Update is called once per frame
	function Update () {
	}
	
	function OnGUI(){
		GUILayout.BeginArea(Rect((Screen.width/2)-50,(Screen.height/2)-50,100,200));
		if(GUILayout.Button("Create Game",GUILayout.Width(100))){
			this.gameObject.AddComponent("CreateGame");
			this.Transition("CreateGame");
		}
		if(GUILayout.Button("Find Game",GUILayout.Width(100))){
			MasterServer.RequestHostList("Flak");
			this.gameObject.AddComponent("FindGame");
			this.Transition("FindGame");
		}
		if(GUILayout.Button("Customization",GUILayout.Width(100))){
			this.gameObject.AddComponent("Customization");
			this.Transition("Customization");
		}
		GUILayout.Space(50);
		if(GUILayout.Button("Logout",GUILayout.Width(100))){
			this.Transition("login");
			Destroy(this);
		}
		GUILayout.EndArea();
	}
	
	function Transition(name : String){
		this.enabled = false;
		this.gameObject.GetComponent(name).enabled = true;
	}
}