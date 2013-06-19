#pragma strict
//Contains any global information

public var username : String = '';
public var GameMap : String = '';
public var TotalGameTime : int = -1;
public var GameMaxKills : int = -1;
public var data : HostData[];

function Start (){
	this.gameObject.AddComponent(login);
}

function Update () {

}

@RPC
function whoAreYou( ){
	
}
