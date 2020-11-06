import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { TrackballControls } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/renderers/CSS3DRenderer.js';

$(document).ready(function() {
    let saveProfile = $("#save-button");
    let profileName = $("input#profile-name");
    let lengthInput = $("input#length-input");
    let widthInput = $("input#width-input");
    let heigthInput = $("input#height-input");
    let hexInput = $("input#hex-input");
    let xInput = $("input#x-input");
    let yInput = $("input#y-input");
    //need to add button listner when they hit save 
    saveProfile.on("click",function(event){
        event.preventDefault();
        let profileData = {
            name:profileName.val().trim(),
            length:lengthInput.val().trim(),
            width: widthInput.val().trim(),
            height: heigthInput.val().trim(),
            hexColor: hexInput.val().trim(),
            yRotation: yInput.val().trim(),
            xRotation: xInput.val().trim()
        }
        if(!profileData.name||!profileData.length||!profileData.width||!profileData.height||!profileData.hexColor||!profileData.xRotation||!profileData.yRotation){
            alert("Please enter all parameters before submitting");
        }

        sendProfile(profileData);
    });

    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function(data) {
      $(".member-name").text(data.email);
    });
  });

function sendProfile(data){
    $.post("/api/boxSim",{
        name:data.name,
        length: data.length,
        width: data.width,
        height: data.height,
        hexColor: data.hexColor,
        yRotation: data.yRotation,
        xRotation: data.xRotation
    })
    .then(function(data){
        alert("You have successfully saved the profile: "+data.name);
    });
}

function main(){
    //create canvas and renderer for animation
    const canvas = document.querySelector('#animation');
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
    renderer.setPixelRatio(window.devicePixelRatio);
    //add render to dom
    $("#animation").append(renderer.domElement);

    //create secene and camera 
    //could decide to customize camera depending on 
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, 2, 0.1, 1000 );

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    camera.position.z = 4;
    const geometry = new THREE.BoxGeometry( 2, 2, 2 );
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
    const cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
    renderer.render(scene,camera);


    // $("#animation").append(renderer.domElement);
    // document.body.appendChild( renderer.domElement );

    var render = function () {
    requestAnimationFrame( render );
    
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.01;

    // Render the scene
    renderer.render(scene, camera);
    
    }
    render();
}

main();

//need to add script to autopopulate dropdown based on profiles saved to user 
