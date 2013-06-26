
public class MultiplayerManager extends MonoBehaviour{
	static public var instance : MultiplayerManager = null;
	
	public var username : String = '';
	public var GameMap : String = '';
	public var TotalGameTime : int = -1;
	public var GameMaxKills : int = -1;
	
	private var mapNameArray : String[] = ["Sewer","Warehouse"];
	private var playerList = new Array();
	private var playerCnt;
	
	function Start(){
		instance = this;
	}
	
	public function CreateServer(gameName: String,playerTotal : int,mapId : int){
		var port : int = 25000;
		var error : NetworkConnectionError;
		Network.InitializeSecurity();
		do{
			error = Network.InitializeServer(2550, port, !Network.HavePublicAddress());
			port++;
		}
		while(error != NetworkConnectionError.NoError);
		playerCnt = playerTotal;
		MasterServer.RegisterHost("Flak", gameName,playerTotal.ToString()+" "+mapId.ToString());
		GameMap = mapNameArray[mapId];
	}
	
	//adds the connecting player to all the clients
	public function OnServerInitialize(){
		Server_PlayerJoinRequest(username, Network.player);
	}
	
	public function OnConnectedToServer(){
		this.gameObject.networkView.RPC("Server_PlayerJoinRequest",RPCMode.All,username);
	}
	
	@RPC
	public function Server_PlayerJoinRequest(username : String, npPlayer : NetworkPlayer){
		networkView.RPC("Client_AddPlayer",RPCMode.ALL, username,npPlayer);
	}
	
	@RPC
	public function Client_AddPlayer(username : String, npPlayer: NetworkPlayer){
		var tempPlayer = new player();
		tempPlayer.username = username;
		tempPlayer.network = npPlayer;
		playerList.push(tempPlayer);
	}
	
	//removes the disconnected player from all the clients
	public function OnPlayerDisconnected(id: NetworkPlayer){
		networkView.RPC("Client_RemovePlayer", RPCMode.All, id);
	}
	
	@RPC
	public function Client_RemovePlayer(view: NetworkPlayer){
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
	
	public function returnPlayerList(){
		return playerList;
	}
	
	public class player{
		public var name : String;
		public var network : NetworkPlayer;
	}
}
