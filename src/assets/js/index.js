import * as THREE from 'three';

let camera, scene, renderer, object, currentHectorObject;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.y = 400;

  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
  scene.add( ambientLight );

  const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
  camera.add( pointLight );
  scene.add( camera );

  createHectorObject();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize );
}

function createHectorObject() {
  const map = new THREE.TextureLoader().load( 'assets/imgs/hector-texture.jpg' );
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 16;
  const material = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide } );

  // GET RID OF THE OLD HECTOR OBJECT
  if (object) {
    scene.remove(object)
  }

  // PICK A RANDOM NEW HECTOR OBJECT
  currentHectorObject = [
    "cube","sphere","cylinder","torus","tetrahedron","lathe"
  ].filter(obj => obj != currentHectorObject)[Math.floor(Math.random()*4)]
  switch (currentHectorObject) {
    case "cube":
      object = new THREE.Mesh( new THREE.BoxGeometry( 250, 250, 250 ), material );
      break
    case "sphere":
      object = new THREE.Mesh( new THREE.SphereGeometry( 150, 20, 10 ), material );
      break
    case "cylinder":
      object = new THREE.Mesh( new THREE.CylinderGeometry( 100, 200, 200, 40, 5 ), material );
      break
    case "torus":
      object = new THREE.Mesh( new THREE.TorusGeometry( 120, 70, 20, 20 ), material );
      break
    case "tetrahedron":
      object = new THREE.Mesh( new THREE.TetrahedronGeometry( 200 ), material );
      break
    case "lathe":
      const points = [];
      for ( let i = 0; i < 50; i ++ ) {
        points.push(
          new THREE.Vector2(
            Math.sin(i * 0.2) * Math.sin(i * 0.1) * 25 + 110,
            (i - 20) * 5
          )
        );
      }
      object = new THREE.Mesh( new THREE.LatheGeometry( points, 20 ), material );
      break
  }

  object.position.set( 0, 0, 0 );
  scene.add(object);
}
window.onclick = createHectorObject
window.onkeydown = createHectorObject

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  const timer = Date.now() * 0.0001;
  camera.position.x = Math.cos( timer ) * 800;
  camera.position.z = Math.sin( timer ) * 800;
  camera.lookAt( scene.position );
  scene.traverse( function ( object ) {
    if ( object.isMesh === true ) {
      object.rotation.x = timer * 5;
      object.rotation.y = timer * 2.5;
    }
  } );
  renderer.render( scene, camera );
}
