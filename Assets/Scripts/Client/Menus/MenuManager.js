
public class MenuManager extends MonoBehaviour{
	private var windTitle : String = "FLAK";
	private var window = Login;
	private var curWindow = window;
	private var windowRect : Rect = Rect(Screen.width/2-320,Screen.height/2-240, 640, 480);
	
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
	private var startTime;
	private var data : HostData[];
	private var gameInstance : GameInstance;
	
	//Game Lobby
	private var playerList = [];
	private var mapTxtArray = ["Sewers.jpg","Warehouse.jpg"];
	public var sewersTexture : Texture2D;
	public var warehouseTexture : Texture2D;
	//customization
	public var charTexture : RenderTexture;
	private var character : int = 0;
	private var armor : int = 0;
	private var characterArray : String[] = ["Human","Robot"];
	private var armorArray : String[] = ["Light","Heavy"];
	
	function Start(){
		startTime = Time.time;
		charTexture.Create();
	}
	
	function Awake(){
		//see if I can prevent reset on reload
		startTime = Time.timeSinceLevelLoad;
		window = curWindow;
		if(window == FindGame)
			data = MasterServer.PollHostList();
	}
	
	function OnGUI(){
		GUI.skin = this.gameObject.GetComponent(Client).guiSkin;
		windowRect = GUI.Window (0, windowRect, window, windTitle);
	}
	
	function Update(){
		//get the list of players and update it to the gameLobby
		if(startTime != null){
			if(Time.timeSinceLevelLoad - startTime > 1000){
				data = MasterServer.PollHostList();
				startTime = Time.timeSinceLevelLoad;
			}
		}else{
			startTime = Time.timeSinceLevelLoad;
		}
		if(curWindow != window){
			curWindow = window;
		}
		if(windowRect.x != Screen.width/2-320 || windowRect.y != Screen.height/2-240){
			windowRect.x = Screen.width/2-320;
			windowRect.y = Screen.height/2-240;
		}
	}
	
	function Login(windowID : int) {
		user = initFields(Rect(220,100,100,30),"Username: ",user,false);
		pWord = initFields(Rect(220,140,100,30),"Password: ",pWord,true);
		if(GUI.Button(Rect(270,200,100,50),"Login")){
			this.checkLogin();
		}
		if(GUI.Button(Rect(270,260,100,50),"Register")){
			Application.OpenURL("http://rinehartworks.com/Flak%202.0/Flak.html");
		}
		var Style = GUI.skin.GetStyle("Label");
    	Style.alignment = TextAnchor.MiddleCenter;
		GUI.Label(Rect(170,310,300,50),message,Style);
	}
	
	function MainMenu (windowID : int) {
		windTitle = "Main Menu";
		message = "";
		if(GUI.Button(Rect(245,100,150,50),"Create Game")){
			window = CreateGame;
		}
		if(GUI.Button(Rect(245,160,150,50),"Find Game")){
			MasterServer.RequestHostList("Flak");
			window = FindGame;
		}
		if(GUI.Button(Rect(245,220,150,50),"Customization")){
			window = Customization;
		}
		if(GUI.Button(Rect(245,400,150,50),"Logout")){
			window = Login;
		}
	}
	
	function CreateGame(windowID : int){
		windTitle = "Create Game";
		gameName = initFields(Rect(75,100,150,30),"Game Name: ",gameName,false);
		playerCnt = ToolbarField(Rect(75,140,350,30),playerCnt,"Player Count:",playerNumArray);
		gameTime = ToolbarField(Rect(75,180,350,30),gameTime,"Time:",gameTimeArray);
		maxKills = ToolbarField(Rect(75,220,350,30),maxKills,"Kills:",gameMaxKillsArray);
		if(GUI.Button(Rect(245,280,150,50),"Create Game")){
			if(!gameName.Equals("")){
				MultiplayerManager.instance.CreateServer(gameName,playerNumArray[playerCnt],map);
				gameInstance = new GameInstance();
				gameInstance.name = gameName;
				gameInstance.map = map;
				gameInstance.gameTime = gameTime;
				gameInstance.maxKills = maxKills;
				gameInstance.playerCnt = playerCnt;
				window = GameLobby;
			}
			else{
				message = "Cannot create a game with no name.";
			}
		}
		var Style = GUI.skin.GetStyle("Label");
    	Style.alignment = TextAnchor.MiddleCenter;
		GUI.Label(Rect(170,400,300,30),message,Style);
		if(GUI.Button(Rect(245,340,150,50),"Back")){
			windTitle = "Main Menu";
			window = MainMenu;
		}
	}
	
	function GameLobby(windowID : int){
		windTitle = "Game Lobby";
		GUI.Label(Rect(0,50,100,30),"Players:");
		GUILayout.BeginArea(Rect(0,80,300,300));
		if(playerList != null){
			for (var element in MultiplayerManager.instance.playerList){
				GUILayout.BeginHorizontal();
				var string = element.name;
				GUILayout.Label(string);
				GUILayout.EndHorizontal();
			}
		}
		GUILayout.EndArea();
		if(map == 0)
			GUI.DrawTexture(Rect(340,50,200,200),sewersTexture);
		else if(map == 1)
			GUI.DrawTexture(Rect(340,50,200,200),warehouseTexture);
		
		if(GUI.Button(Rect(245,400,150,50),"Back")){
			Network.Disconnect();
			window = MainMenu;
		}
	}
	
	function FindGame(windowID : int){
		windTitle = "Find Game";
		if(GUI.Button(Rect(245,400,150,50),"Back")){
			window = MainMenu;
		}
		var Style = GUI.skin.GetStyle("Label");
    	Style.alignment = TextAnchor.MiddleCenter;
		GUI.Label(Rect(170,360,300,30),message,Style);
		GUILayout.BeginArea(Rect(0,50,400,400));
		if(data != null){
			for (var element in data){
				GUILayout.BeginHorizontal();
				var string = element.gameName+"\t";
				var com = element.comment;
				var coms = com.Split(" "[0]);
				string += element.connectedPlayers + " / " + (coms[0])+"\t\t"+coms[1];
				if(GUILayout.Button(string)){
					var error : NetworkConnectionError = Network.Connect(element);
					if(error != NetworkConnectionError.NoError)
						message = error.ToString();
					window = GameLobby;
				}
				GUILayout.EndHorizontal();	
			}
		}else{
			GUILayout.Label("No games currently exist");
		}
		GUILayout.EndArea();
	}
	
	function Customization(windowID : int){
		windTitle = "Customization";
		//middle is 320
		character = ToolbarField(Rect(0,70,150,30),character,"Player: ",characterArray);
		armor = ToolbarField(Rect(0,110,150,30),armor,"Armor Set: ",armorArray);
		GUI.Label(Rect(320,50,100,30),"Player");
		//charTexture.SetPixels(Color.black);
		if(charTexture.IsCreated()){
			GUI.DrawTexture(Rect(320,120,256,256),charTexture,ScaleMode.ScaleToFit);
		}
		else{
			GUI.Label(Rect(320,240,150,30),"RTT not Finished");
		}
		if(GUI.Button(Rect(245,400,150,50),"Back")){
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
				if(MultiplayerManager.instance != null)
					MultiplayerManager.instance.username = user;
				else{
					Debug.LogError("MultiplayerManager is Null");
				}
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
	
	//for find game updating the hostlist
	function OnMasterServerEvent (msEvent : MasterServerEvent){
		if(msEvent == MasterServerEvent.HostListReceived){
			data = MasterServer.PollHostList();
		}
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