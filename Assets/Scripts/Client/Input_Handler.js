#pragma strict

private var player : Transform;
private var vertRot : float;
private var speed : float = 5.0f;
private var gravity : float = 20f;
private var controller : CharacterController;
private var moveDirection : Vector3 = Vector3.zero;
private var jumpSpeed : float = 8.0;

function Start(){
	player = this.gameObject.transform;
	controller = this.gameObject.GetComponent(CharacterController);
	vertRot = 0.0f;
}

function Update () {
	//INPUT
	//BE ABLE TO HANDLE DIFFERENT PRESET LAYOUTS
    var rotationOnY : float = Input.GetAxis("Mouse X") * 300.0f;
    var rotationOnX : float = Input.GetAxis("Mouse Y") * -300.0f;
    
    rotationOnX *= Time.deltaTime;
    rotationOnY *= Time.deltaTime;
  	
  	if (controller.isGrounded) {
		// We are grounded, so recalculate
		// move direction directly from axes
		moveDirection = Vector3(Input.GetAxis("Horizontal"), 0,
		                        Input.GetAxis("Vertical"));
		moveDirection = transform.TransformDirection(moveDirection);
		//Put in bonuses to speed and other factors  prevent player from going through the level.
		moveDirection *= speed;
		
		if (Input.GetButton ("Jump")) {
			moveDirection.y = jumpSpeed;
		}
	}
  	
    player.Rotate(0, rotationOnY, 0);
    //Rotates just the Camera
    rotationOnX = Mathf.Clamp (rotationOnX, -40.0f,60.0f);
    Camera.mainCamera.transform.Rotate(rotationOnX,0,0);
    
    //Player Shoot
    if(Input.GetMouseButton(0)){
    	
    }
    
    Motor();
}

function Motor(){
		// Apply gravity
	moveDirection.y -= gravity * Time.deltaTime;
	
	// Move the controller
	controller.Move(moveDirection * Time.deltaTime);
}