
public class MenuManager extends MonoBehaviour{
	private var windTitle : String = "FLAK";
	private var window = Login;
	private var curWindow = window;
	private var windowRect : Rect = Rect(Screen.width/2-320,Screen.height/2-240, 640, 480);
	public var menuImg : Texture2D;
	
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
	public var charAltImg : Texture2D;
	private var character : int = 0;
	private var armor : int = 0;
	private var heal : int = 0;
	private var shield : int = 0;
	private var prmAb : int = 0;
	private var sndAb : int = 0;
	private var oldChar : int;
	private var oldArmor : int;
	private var characterArray : String[] = ["Human","Robot"];
	private var armorArray : String[] = ["Light","Heavy"];
	public var charArmor : Transform[];
	public var menuRTTSpawn : Transform;
	public var healTextures : Texture2D[];
	public var shieldTextures : Texture2D[];
	public var prmAbility : Texture2D[];
	public var sndAbility : Texture2D[];
	private var healContent : GUIContent[];
	private var shieldContent : GUIContent[];
	private var prmAbContent : GUIContent[];
	private var sndAbContent : GUIContent[];
	private var object : Transform;
	
	
	function Start(){
		startTime = Time.time;
		charTexture.Create();
		if(charArmor.Length != 0)
			object = Instantiate(charArmor[(character*2+(armor))],menuRTTSpawn.position,Quaternion.identity);
		if(healTextures.Length == 3)
			healContent = [GUIContent(healTextures[0],"Health Regen"),GUIContent(healTextures[1],"Heal"),GUIContent(healTextures[2],"Health Endurance")];
		if(shieldTextures.Length == 3)
			shieldContent = [GUIContent(shieldTextures[0],"Shield Regen"),GUIContent(shieldTextures[1],"Shield Charge"),GUIContent(shieldTextures[2],"Shield Capacity")];
		if(prmAbility.Length == 5){
			prmAbContent = [GUIContent(prmAbility[0],"Bubble"),GUIContent(prmAbility[1],"Cloak"),GUIContent(prmAbility[2],"Radar Jam"),
							GUIContent(prmAbility[3],"Overcharge"),GUIContent(prmAbility[4],"Smoke Bomb")];
		}
		if(sndAbility.Length == 6){
			sndAbContent = [GUIContent(sndAbility[0],"Armor Plating"),GUIContent(sndAbility[1],"Reality Check"),GUIContent(sndAbility[2],"Sprint"),
							GUIContent(sndAbility[3],"Crouch Radar"),GUIContent(sndAbility[4],"Infared"),GUIContent(sndAbility[5],"Servo-mechanics")];
		}
	}
	
	function Awake(){
		//see if I can prevent reset on reload
		startTime = Time.timeSinceLevelLoad;
		window = curWindow;
		if(window == FindGame)
			data = MasterServer.PollHostList();
		character = oldChar;
		armor = oldArmor;
	}
	
	function OnGUI(){
		if(!this.gameObject.GetComponent(Client).inGame){
			GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),menuImg,ScaleMode.ScaleToFit);
			GUI.skin = this.gameObject.GetComponent(Client).guiSkin;
			windowRect = GUI.Window (0, windowRect, window, windTitle);
		}
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
		
		//updates RTT
		if(character != oldChar || armor != oldArmor){
			if(object)
				Destroy(object.gameObject);
			object = Instantiate(charArmor[(character*2+(armor))],menuRTTSpawn.position,Quaternion.identity);
			oldChar = character;
			oldArmor = armor;
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
		if(GUI.Button(Rect(20,100,150,50),"Create Game")){
			window = CreateGame;
		}
		if(GUI.Button(Rect(20,160,150,50),"Find Game")){
			MasterServer.RequestHostList("Flak");
			window = FindGame;
		}
		if(GUI.Button(Rect(20,220,150,50),"Customization")){
			window = Customization;
		}
		if(GUI.Button(Rect(20,280,150,50),"Credits")){
			window = Credits;
		}
		GUI.Label(Rect(320,50,100,30),"Player");
		if(charTexture.IsCreated()){
			GUI.DrawTexture(Rect(320,80,256,256),charTexture,ScaleMode.ScaleToFit);
		}
		else{
			GUI.DrawTexture(Rect(320,80,256,256),charAltImg,ScaleMode.ScaleToFit);
			GUI.Label(Rect(320,240,150,30),"RTT not Finished");
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
				gameInstance = new GameInstance();
				gameInstance.name = gameName;
				gameInstance.map = map;
				gameInstance.gameTime = gameTime;
				gameInstance.maxKills = maxKills;
				gameInstance.playerCnt = playerCnt;
				MultiplayerManager.instance.CreateServer(gameInstance);
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
		character = ToolbarField(Rect(0,60,150,30),character,"Player: ",characterArray);
		armor = ToolbarField(Rect(0,100,150,30),armor,"Armor Set: ",armorArray);
		if((healContent.Length != 0 || shieldContent.Length != 0) || (prmAbContent.Length != 0 || sndAbContent.Length != 0)){
			heal = ToolbarField(Rect(0,140,150,30),heal,"Health: ",healContent);
			shield = ToolbarField(Rect(0,180,150,30),shield,"Shield: ",shieldContent);
			GUI.Label(Rect(0,210,100,30),"Abilities:");
			prmAb = SelGridField(Rect(0,250, 150, 90),prmAb,"Primary:",prmAbContent,3);
			sndAb = SelGridField(Rect(0,360, 150, 90),sndAb,"Secondary:",sndAbContent,3);
		}else{
			Debug.LogError("Content for toolbars is empty");
		} 
		GUI.Label(Rect(320,50,100,30),"Player");
		if(charTexture.IsCreated()){
			GUI.DrawTexture(Rect(320,80,256,256),charTexture,ScaleMode.ScaleToFit);
		}
		else{
			GUI.DrawTexture(Rect(320,80,256,256),charAltImg,ScaleMode.ScaleToFit);
			GUI.Label(Rect(320,240,150,30),"RTT not Finished");
		}
		if(GUI.Button(Rect(245,340,150,50),"Save")){
			//Save the data to the player
		}
		if(GUI.Button(Rect(245,400,150,50),"Back")){
			window = MainMenu;
		}
	}
	
	function Credits(windowID : int){
		windTitle = "Credits";
		var creditStr = "Programmers:\nParker Gosline\nChristopher Rinehart\n\n";
		creditStr += "Artists:\nEmily Blaske\nSara Blaske\nClinton Carr\nJanette Goering\n";
		creditStr += "Kelly Hetke\nWesley Paquette\nCorey Roth\nJacob Strahler\nScott Wardell";
		GUI.Label(Rect(170,20,300,380),creditStr);
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
	
	function ToolbarField(screenRect : Rect,curSelection : int, labelName : String,dataArray : GUIContent[]){
		var width = screenRect.width;
		screenRect.width = 150;
		GUI.Label (screenRect, labelName);
		screenRect.x += screenRect.width;
		screenRect.width = width;
		var index = GUI.Toolbar(screenRect,curSelection,dataArray);
		return index;
	}

	function SelGridField(screenRect : Rect,curSelection : int, labelName : String,dataArray : GUIContent[],rows){
		var width = screenRect.width;
		screenRect.width = 150;
		GUI.Label (screenRect, labelName);
		screenRect.x += screenRect.width;
		screenRect.width = width;
		var index = GUI.SelectionGrid(screenRect,curSelection,dataArray,rows);
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
}