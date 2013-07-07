
class MultiplayerManager extends MonoBehaviour{
	static public var instance : MultiplayerManager = null;
	
	public var username : String = '';
	private var mapNameArray : String[] = ["Sewer","Warehouse"];
	public var playerList = new Array();
	public var gameInst : GameInstance;
	
	function Start(){
		instance = this;
		var conTest : ConnectionTesterStatus;
		conTest = Network.TestConnection(true);
	}
	function Awake(){
		instance = this;
	}
	
	public function CreateServer(gameInstance : GameInstance){
		var port : int = 25000;
		var error : NetworkConnectionError;
		Network.Disconnect();
		Network.InitializeSecurity();
		do{
			error = Network.InitializeServer(2550, port, !Network.HavePublicAddress());
			port++;
		}
		while(error != NetworkConnectionError.NoError);
		this.gameInst = gameInstance;
		MasterServer.RegisterHost("Flak",gameInst.name,gameInst.playerCnt.ToString()+" "+mapNameArray[gameInst.map]);
	}
	
	//adds the connecting player to all the clients
	function OnServerInitialized(){
		Server_PlayerJoin(username, Network.player);
	}
	
	function OnConnectedToServer (){
		this.gameObject.networkView.RPC("Server_PlayerJoin",RPCMode.All,username, Network.player);
	}
	
	@RPC
	function Server_PlayerJoin(username : String, npPlayer : NetworkPlayer){
		this.gameObject.networkView.RPC("Client_AddPlayer",RPCMode.All, username,npPlayer);
	}
	
	@RPC
	function Client_AddPlayer(username : String, npPlayer: NetworkPlayer){
		var tempPlayer = new player();
		tempPlayer.name = username;
		tempPlayer.network = npPlayer;
		playerList.push(tempPlayer);
	}
	
	//removes the disconnected player from all the clients
	function OnPlayerDisconnected(id: NetworkPlayer){
		this.gameObject.networkView.RPC("Client_RemovePlayer", RPCMode.All, id);
	}
	
	@RPC
	function Client_RemovePlayer(view: NetworkPlayer){
		var tempPlayer : player = null;
		for(pl in playerList){
			if(pl.network == view){
				tempPlayer = pl;
			}
			if(tempPlayer != null){
				playerList.remove(tempPlayer);
			}
		}
	}
	
	public class player{
		public var name : String;
		public var network : NetworkPlayer;
	}
}
