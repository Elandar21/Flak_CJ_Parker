public class GameStats{
	public var playerList = new Array();
	
	function Death(killer: NetworkPlayer, victim : NetworkPlayer){
		for(pl in playerList){
			if(pl.network == killer){
				pl.Kills++;
			}
			if(pl.network == victim){
				pl.Deaths++;
			}
		}
	}
	
	function ReportStats(){
		
	}
	
	function AddPlayer(username : String, npPlayer: NetworkPlayer){
		
	}
	
	public class player{
		public var name : String;
		public var network : NetworkPlayer;
		public var Deaths : int = 0;
		public var Kills : int = 0;
	}
}

