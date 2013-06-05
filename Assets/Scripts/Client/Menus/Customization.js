
public class Customization extends MonoBehaviour{
	var GameName : String = '';

	// Use this for initialization
	function Start () {
	}
	
	// Update is called once per frame
	function Update () {
	}
	
	function OnGUI() {
		GUILayout.BeginArea(Rect((Screen.width/2)-50,(Screen.height/2)-50,200,100));
		//Customization options will be added here
		if(GUILayout.Button("Back",GUILayout.Width(100))){
			this.Transition("MainMenu");
		}
		GUILayout.EndArea();
	}
	
	function Transition(name : String){
		this.enabled = false;
		this.gameObject.GetComponent(name).enabled = true;
		Destroy(this);
	}
}
