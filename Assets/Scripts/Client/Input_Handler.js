#pragma strict

private var player : Transform;
private var vertRot : float;

function Start(){
	player = this.gameObject.transform;
	vertRot = 0.0f;
}

function Update () {
	//INPUT
	//BE ABLE TO HANDLE DIFFERENT PRESET LAYOUTS
	//Put in bonuses to speed and other factors  prevent player from going through the level.
	var translationZ : float = Input.GetAxis("Vertical") * 5.0f;
	var translationX : float = Input.GetAxis("Horizontal") * 5.0f;
    var rotationOnY : float = Input.GetAxis("Mouse X") * 300.0f;
    var rotationOnX : float = Input.GetAxis("Mouse Y") * -300.0f;
    
    translationZ *= Time.deltaTime;
    translationX *= Time.deltaTime;
    rotationOnX *= Time.deltaTime;
    rotationOnY *= Time.deltaTime;
    //Moves just the player
  	player.Translate(translationX, 0, translationZ);
    player.Rotate(0, rotationOnY, 0);
    //Rotates just the Camera
    rotationOnX = Mathf.Clamp (rotationOnX, -40.0f,60.0f);
    Camera.mainCamera.transform.Rotate(rotationOnX,0,0);
}