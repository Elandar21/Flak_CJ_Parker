
public class MainMenu extends MonoBehaviour{
	var windowRect : Rect = Rect (Screen.width/2-100,Screen.height/2-150, 300, 300);
	// Use this for initialization
	function Start () {
	}
	
	// Update is called once per frame
	function Update () {
	}
	
	function OnGUI(){
		GUI.skin = this.gameObject.GetComponent(Client).guiSkin;
		windowRect = GUI.Window (0, windowRect, WindowFunction, "Main Menu");
	}
	
	function WindowFunction (windowID : int) {
		if(GUI.Button(Rect(75,50,150,50),"Create Game")){
			this.gameObject.AddComponent("CreateGame");
			this.Transition("CreateGame");
		}
		if(GUI.Button(Rect(75,100,150,50),"Find Game")){
			MasterServer.RequestHostList("Flak");
			this.gameObject.AddComponent("FindGame");
			this.Transition("FindGame");
		}
		if(GUI.Button(Rect(75,150,150,50),"Customization")){
			this.gameObject.AddComponent("Customization");
			this.Transition("Customization");
		}
		if(GUI.Button(Rect(75,240,150,50),"Logout")){
			this.Transition("login");
			Destroy(this);
		}
	}
	
	function Transition(name : String){
		this.enabled = false;
		this.gameObject.GetComponent(name).enabled = true;
	}
}