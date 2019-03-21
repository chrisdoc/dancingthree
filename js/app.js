const THREE = require('three');
const OrbitControls = require('three-orbitcontrols')
const {angry, doctor,hiker,soldier,woman} = require('../assets/video/*.mp4')
const videos = [angry, doctor ,hiker,soldier,woman]

ChromaKeyMaterial = function (url, width, height, keyColor) {
  console.log("loading video, "+url)
	THREE.ShaderMaterial.call(this);
	const video = document.createElement('video');
	video.loop = true;
  video.src = url;
  video.hidden=true;
	video.load();
	video.play().catch(console.error);  
	var videoImage = document.createElement('canvas');
	if (window["webkitURL"]) document.body.appendChild(videoImage);
	videoImage.width = width;
	videoImage.height = height;
	
	var keyColorObject = new THREE.Color(keyColor);
	var videoImageContext = videoImage.getContext('2d');
	// background color if no video present
	videoImageContext.fillStyle = '#' + keyColorObject.getHexString();
	videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
	var videoTexture = new THREE.Texture(videoImage);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	this.update = function () {
		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			videoImageContext.drawImage(video, 0, 0);
			if (videoTexture) {
				videoTexture.needsUpdate = true;
			}
		}
	}
	this.setValues({
		uniforms: {
			texture: {
				type: "t",
				value: videoTexture
			},
			color: {
				type: "c",
				value: keyColorObject
			}
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		transparent: true
	});
}
ChromaKeyMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
// Get a reference to the container element that will hold our scene
const container = document.querySelector("#scene-container");


// create a Scene
const scene = new THREE.Scene();

// Set the background color
scene.background = new THREE.Color("red");

// // Create a Camera
// const fov = 35; // AKA Field of View
// const aspect = container.clientWidth / container.clientHeight;
// const near = 0.1; // the near clipping plane
// const far = 100; // the far clipping plane

// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// // every object is initially created at ( 0, 0, 0 )
// // we'll move the camera back a bit so that we can view the scene
// camera.position.set(0, 0, 10);

var camera = new THREE.PerspectiveCamera();
	camera.position.set(0, 150, 900);
	camera.lookAt(scene.position);
	scene.add(camera);

var geometry = new THREE.PlaneGeometry( 1000, 1000, 10, 10 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
plane.rotation.x = Math.PI / 2;

scene.add( plane );

//0xd432 is the green screen color, insert yours, if different, below

var movieMaterials = videos.map(video => new ChromaKeyMaterial(video, 640, 360, 0xd400))
var movieGeometry = new THREE.PlaneGeometry(60, 105, 4, 4)
var movieMaterial = new ChromaKeyMaterial(videos[0], 640, 360, 0xd400);
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var doctors = []
	for (var i = 0; i < 5; i++)
		for (var j = 0; j < 5; j++)
			if ((i + j) % 2 == 0) {
				var movie = new THREE.Mesh(
          movieGeometry,movieMaterials[getRandomInt(videos.length )]
        );
				movie.position.set(0, 53, 0);
				var girl = new THREE.Object3D();
				girl.position.set(150 * (i - 2), 0, 150 * (j - 2));
				girl.add(movie);
				scene.add(girl);
				doctors.push(girl);
			}






// add the mesh to the scene
//scene.add(mesh);

// create the renderer
const renderer = new THREE.WebGLRenderer();

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// add the automatically created <canvas> element to the page
container.appendChild(renderer.domElement);

// controls = new THREE.OrbitControls( camera, container );
// render, or 'create a still image', of the scene
renderer.render(scene, camera);

var animate = function () {

  controls.update();
  doctors.forEach(doctor=> doctor.lookAt(camera.position))
  // movieMaterial.update()
  movieMaterials.forEach(m=>m.update())
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();


