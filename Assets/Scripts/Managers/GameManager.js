#pragma strict
static var inst : GameManager = null;

public var gameInst : GameInstance;
private var mapNameArray : String[] = ["Sewer","Warehouse"];
private var stats : GameStats;

function Start(){
	inst = this;
}

function Awake(){
	inst = this;
}

function Update(){

}

function SpawnPnt(){
	var spwnID : int;
	var spwnPnts : GameObject[] = GameObject.FindGameObjectsWithTag("Respawn");
	if(spwnPnts.Length == 0){
		return null;
	}
	spwnID = Random.Range(0,spwnPnts.Length);
	return spwnPnts[spwnID];
}

@RPC
function StartGame(){
	MenuManager.inst.startTime = Time.timeSinceLevelLoad+5;
	MenuManager.inst.countDown = true;
	MenuManager.inst.level.allowSceneActivation = true;
	Client.instance.Spawn();
	if(Network.isServer){
 		MasterServer.UnregisterHost();
 		stats = GameStats();
 	}
}

//Ready Check
@RPC
function ReadyCheck(view: NetworkPlayer){
	var ready = true;
	for(pl in MultiplayerManager.instance.playerList){
		var tmp = pl as MultiplayerManager.player;
		if(tmp.network == view){
			tmp.ready = true;
		}
		if(!tmp.ready)
			ready = false;
	}
	if(ready)
		networkView.RPC("StartGame",RPCMode.All);
}

//called when a player dies
@RPC
function Death(killer: NetworkPlayer, victim : NetworkPlayer){
	stats.Death(killer,victim);
}