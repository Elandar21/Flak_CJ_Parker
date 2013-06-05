
public class login extends MonoBehaviour{
	private var user : String = '';
	private var pWord : String = '';
	
	var maskChar : String = '*';
	var formText : String = "";
	var URL : String = "http://rinehartworks.com/Flak 2.0/userInfo.php";
	var hash : String = "0x4F290DF";
	
	function menu(){
		this.enabled = false;
		this.gameObject.AddComponent("MainMenu");
	}
	
	function OnGUI(){
		GUILayout.BeginArea(Rect((Screen.width/2)-150,(Screen.height/2)-50,100,100));
		//right aligns the text
		GUI.skin.label.alignment = TextAnchor.UpperRight;
		GUILayout.Label("Name:");
		GUILayout.Label("Password:");
		GUILayout.EndArea();
		GUILayout.BeginArea(Rect((Screen.width/2)-25,(Screen.height/2)-50,100,200));
		user = GUILayout.TextField(user, 50);
		pWord = GUILayout.PasswordField(pWord,maskChar[0],50);
		GUILayout.Space(50);
		if(GUILayout.Button("Login")){
			this.checkLogin();
			GUILayout.Label("Invalid Login please try again");
		}
		if(GUILayout.Button("Register")){
			Application.OpenURL("http://rinehartworks.com/Flak%202.0/Flak.html");
		}
		GUILayout.EndArea();
	}

	function checkLogin(){
		//pulls the login data down from the php page
		var form = new WWWForm();
		form.AddField("myform_hash", hash);
		form.AddField("myform_nick", user);
		form.AddField("myform_pass", pWord);
		
		var w = WWW(URL, form);
		yield w;
		if(w.error != null){
			print(w.error);
		}else{
			formText = w.text;
			print(formText);
			if(!this.loginFinished(formText)){
				this.gameObject.GetComponent(Client).username = user;
				this.menu();
			}
			else{
				user = '';
				pWord = '';
			}
		}
		w.Dispose();
	}
	//database info
	//_Flak@2!
	//elandar_21
	//june2014_lacie
	function loginFinished(text : String){
		if(text != "Connected successfully")
			return true;
		return false;
	}
}