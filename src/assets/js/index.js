import * as THREE from 'three';

let camera, scene, renderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.y = 400;

  scene = new THREE.Scene();

  let object;

  const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
  scene.add( ambientLight );

  const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
  camera.add( pointLight );
  scene.add( camera );

  const map = new THREE.TextureLoader().load( 'assets/imgs/hector-texture.jpg' );
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 16;
  const material = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide } );

  object = new THREE.Mesh( new THREE.BoxGeometry( 250, 250, 250 ), material );
  object.position.set( 0, 0, 0 );
  scene.add( object );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize );
}

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
