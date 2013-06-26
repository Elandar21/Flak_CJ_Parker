
public class MenuManager extends MonoBehaviour{
	private var windTitle : String = "FLAK";
	private var window = Login;
	//For changing the size of the window
	private var oldWindRect : Rect;
	private var LargeWindRect : Rect = Rect(Screen.width/2-320,Screen.height/2-240, 640, 480);
	private var smallWindRect : Rect = Rect(Screen.width/2-100,Screen.height/2-150, 300, 300);
	private var windowRect : Rect = smallWindRect;
	
	//login variables
	private var user : String = '';
	private var pWord : String = '';
	private var maskChar : String = '*';
	private var URL : String = "http://rinehartworks.com/Flak 2.0/php/userInfo.php";
	private var hash : String = "0x4F290DF";
	private var message : String = "";
	
	//Create Game variables
	private var gameName = "";
	private var playerCnt = 0;
	private var map = 0;
	private var gameTime = 0;
	private var maxKills = 0;
	private var mapNameArray : String[] = ["Sewer","Warehouse"];
	private var playerNumArray : String[] = ['2','4','8','16','32'];
	private var gameTimeArray : String[] = ["Infinity","5","10","15","25"];
	private var gameMaxKillsArray : String[] = ["Infinity","5","10","15","25"];
	
	//Find Game variables
	private var startTime = Time.time;
	private var data : HostData[];
	private var gameInstance : GameInstance;
	
	//Game Lobby
	private var playerList = [];
	private var mapTxtArray = ["Sewers.jpg","Warehouse.jpg"];
	public var sewersTexture : Texture2D;
	public var warehouseTexture : Texture2D;
	
	function Awake(){
		//see if I can prevent reset on reload
	}
	
	function OnGUI(){
		GUI.skin = this.gameObject.GetComponent(Client).guiSkin;
		windowRect = GUI.Window (0, windowRect, window, windTitle);
	}
	
	function Update(){
		//get the list of players and update it to the gameLobby
		if(Time.time - startTime > 1000){
			playerList = this.gameObject.GetComponent(Client).MPMngr.returnPlayerList();
		}
	}
	
	function Login(windowID : int) {
		user = initFields(Rect(50,50,100,30),"Username: ",user,false);
		pWord = initFields(Rect(50,90,100,30),"Password: ",pWord,true);
		if(GUI.Button(Rect(100,150,100,50),"Login")){
			this.checkLogin();
		}
		if(GUI.Button(Rect(100,210,100,50),"Register")){
			Application.OpenURL("http://rinehartworks.com/Flak%202.0/Flak.html");
		}
		var Style = GUI.skin.GetStyle("Label");
    	Style.alignment = TextAnchor.MiddleCenter;
		GUI.Label(Rect(0,250,300,50),message,Style);
	}
	
	function MainMenu (windowID : int) {
		windTitle = "Main Menu";
		if(GUI.Button(Rect(75,50,150,50),"Create Game")){
			window = CreateGame;
		}
		if(GUI.Button(Rect(75,100,150,50),"Find Game")){
			MasterServer.RequestHostList("Flak");
			window = FindGame;
		}
		if(GUI.Button(Rect(75,150,150,50),"Customization")){
			window = Customization;
		}
		if(GUI.Button(Rect(75,240,150,50),"Logout")){
			window = Login;
		}
	}
	
	function CreateGame(windowID : int){
		windTitle = "Create Game";
		windowRect = LargeWindRect; //middle is 320
		gameName = initFields(Rect(75,125,150,30),"Game Name: ",gameName,false);
		playerCnt = ToolbarField(Rect(75,155,350,30),playerCnt,"Player Count:",playerNumArray);
		gameTime = ToolbarField(Rect(75,185,350,30),gameTime,"Time:",gameTimeArray);
		maxKills = ToolbarField(Rect(75,215,350,30),maxKills,"Kills:",gameMaxKillsArray);
		if(GUI.Button(Rect(245,300,150,50),"Create Game")){
			if(!gameName.Equals("")){
				MultiplayerManager.instance.CreateServer(gameName,playerCnt,map);
				gameInstance = new GameInstance();
				gameInstance.name = gameName;
				gameInstance.map = map;
				gameInstance.gameTime = gameTime;
				gameInstance.maxKills = maxKills;
				gameInstance.playerCnt = playerCnt;
				window = GameLobby;
			}
			else{
				GUI.Label(Rect(245,465,300,50),"Game has no name");
			}
		}
		if(GUI.Button(Rect(245,350,150,50),"Back")){
			windowRect = smallWindRect;
			windTitle = "Main Menu";
			window = MainMenu;
		}
	}
	
	function GameLobby(windowID : int){
		windTitle = "Game Lobby";
		GUI.Label(Rect(0,0,100,30),"Players:");
		GUILayout.BeginArea(Rect(0,30,300,300));
		if(playerList != null){
			for (var element in playerList){
				GUILayout.BeginHorizontal();
				var string = element.name;
				GUILayout.Label(string);
				GUILayout.EndHorizontal();
			}
		}
		GUILayout.EndArea();
		//mapTexture
		//GUI.DrawTexture(Rect(300,0,200,200),mapTexture);
		if(GUI.Button(Rect(245,430,150,50),"Back")){
			windowRect = smallWindRect;
			window = MainMenu;
		}
	}
	
	function FindGame(windowID : int){
		windTitle = "Find Game";
		GUILayout.BeginArea(Rect(0,0,640,300));
		if(data != null){
			for (var element in data){
				GUILayout.BeginHorizontal();
				var string = element.gameName+"\t";
				var com = element.com.Split(" ");
				string += element.connectedPlayers + " / " + (com[0])+"\t\t"+com[1];
				if(GUILayout.Button(string)){
					Network.Connect(element);
					window = GameLobby;
				}
				GUILayout.EndHorizontal();	
			}
		}
		GUILayout.EndArea();
		if(GUI.Button(Rect(75,300,150,50),"Back")){
			windowRect = smallWindRect;
			window = MainMenu;
		}
	}
	
	function Customization(windowID : int){
		windTitle = "Customization";
		//middle is 320
		if(GUI.Button(Rect(245,430,150,50),"Back")){
			windowRect = smallWindRect;
			window = MainMenu;
		}
	}
	
	function initFields(screenRect: Rect,labelName: String,text: String,pWord : boolean){
		GUI.Label (screenRect, labelName);
		screenRect.x += screenRect.width;
		var fieldValue = "";
		if(!pWord){
			fieldValue = GUI.TextField(screenRect,text);
		}
		else{
			fieldValue = GUI.PasswordField(screenRect,text,'*'.ToCharArray()[0]);
		}
		return fieldValue;
	}
	
	function LabelSlider(screenRect : Rect,sliderValue : float,sliderMaxValue : float,labelText : String) : float {
		GUI.Label (screenRect, labelText);
		screenRect.x += screenRect.width;
		sliderValue = GUI.HorizontalSlider (screenRect, sliderValue, 0.0, sliderMaxValue);
		return sliderValue;
	}
	
	function ToolbarField(screenRect : Rect,curSelection : int, labelName : String,dataArray : String[]){
		var width = screenRect.width;
		screenRect.width = 150;
		GUI.Label (screenRect, labelName);
		screenRect.x += screenRect.width;
		screenRect.width = width;
		var index = GUI.Toolbar(screenRect,curSelection,dataArray);
		return index;
	}
	
	function ToolbarField(screenRect : Rect,curSelection : int, labelName : String,dataArray : Texture[]){
		var width = screenRect.width;
		screenRect.width = 150;
		GUI.Label (screenRect, labelName);
		screenRect.x += screenRect.width;
		screenRect.width = width;
		var index = GUI.Toolbar(screenRect,curSelection,dataArray);
		return index;
	}

	function checkLogin(){
		//pulls the login data down from the php page
		var form = new WWWForm();
		form.AddField("myform_hash", hash);
		form.AddField("myform_nick", user);
		form.AddField("myform_pass", pWord);
		message = "Logging in.";
		var w = WWW(URL, form);
		yield w;
		if(w.error != null){
			print(w.error);
		}else{
			if(loginFinished(w.text)){
				MultiplayerManager.instance.username = user;
				window = MainMenu;
				message = "";
			}
			else{
				user = '';
				pWord = '';
			}
		}
		w.Dispose();
	}

	function loginFinished(text : String){
		if(text != "SUCCESS"){
			message = text.Trim();
			return false;
		}
		return true;
	}
	
	public class GameInstance{
		public var name : String;
		public var map : int;
		public var playerCnt : int;
		public var gameTime : int;
		public var maxKills : int;
		public var teamBased : boolean = false;
		public var teamCount : int;
	}
}