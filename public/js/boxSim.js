import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
var updateBtn = $("#updateSim");
var profiles = $("#profiles-menu");
var saveProfile = $("#save-button");
var profileName = $("input#profile-name");
var lengthInput = $("input#length-input");
var widthInput = $("input#width-input");
var heightInput = $("input#height-input");
var hexInput = $("input#hex-input");
var xInput = $("input#x-input");
var yInput = $("input#y-input");

$(document).ready(function() {
    
    
    //load saved profiles 
    $.get("/api/boxSim").then(function(data) {
        //update name of dropdown, also give an attribute for the profileID
        console.log(data);
        data.forEach(profile => {
            profiles.append($('<a class="dropdown-item" data-index="'+profile.id+'"href="#">'+profile.name+'</a>'));
        });

        //add event listener for any saved profile 
        $(".dropdown-item").on("click",function(){
            $.get("api/boxSim/"+$(this).attr("data-index")).then(function(data){
                //set values of form to that of data
                lengthInput.val(data.length);
                widthInput.val(data.width);
                heightInput.val(data.height);
                hexInput.val(data.hexColor);
                xInput.val(data.xRotation);
                yInput.val(data.yRotation);
            });
        });
    });

    
    //need to add button listner when they hit save 
    saveProfile.on("click",function(event){
        event.preventDefault();
        let profileData = {
            name:profileName.val().trim(),
            length:lengthInput.val().trim(),
            width: widthInput.val().trim(),
            height: heightInput.val().trim(),
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

    //post once profile is saved w/ unique name
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
});

let camera, scene, renderer;
function main(){
    //create canvas and renderer for animation
    const canvas = document.querySelector('#animation');
    renderer = new THREE.WebGLRenderer({canvas},{antialias:true});
    renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
    renderer.setAnimationLoop(render);
    renderer.setPixelRatio(window.devicePixelRatio);

    //add render to dom
    $("#animation").append(renderer.domElement);

    //create secene and camera 
    //could decide to customize camera depending on 
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //creates light for object
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    camera.position.z = 4;
    const geometry = new THREE.BoxGeometry( lengthInput.val(), widthInput.val(), heightInput.val());
    const material = new THREE.MeshPhongMaterial({color:hexInput.val()});
    const cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
    renderer.render(scene,camera);
    //event listeners to dynamically update the simulation 
    const cubeColor = document.getElementById("hex-input");
    cubeColor.addEventListener('input',function(){
        material.color.set(hexInput.val());
    });
    const cubeLength = document.getElementById("length-input");
    cubeLength.addEventListener('input',function(){
        let new_geometry = new THREE.CubeGeometry(lengthInput.val(),widthInput.val(),heightInput.val());
        geometry.dispose();
        cube.geometry = new_geometry;
    });
    const cubeWidth = document.getElementById("width-input");
    cubeWidth.addEventListener("input",function(){
        let new_geometry1 = new THREE.CubeGeometry(lengthInput.val(),widthInput.val(),heightInput.val());
        geometry.dispose();
        cube.geometry = new_geometry1;
    });
    const cubeHeight = document.getElementById("height-input");
    cubeHeight.addEventListener("input",function(){
        let new_geometry2 = new THREE.CubeGeometry(lengthInput.val(),widthInput.val(),heightInput.val());
        geometry.dispose();
        cube.geometry = new_geometry2;
    });
    const cubeX = document.getElementById("x-input");
    cubeX.addEventListener("input",function(){
        render();
    });
    const cubeY = document.getElementById("y-input");
    cubeY.addEventListener("input",function(){
        render();
    });
    updateBtn.on("click",function(event){
        let new_geometry2 = new THREE.CubeGeometry(2,2,2);
        geometry.dispose();
        cube.geometry = new_geometry2
        
    });

    var render = function () {
    requestAnimationFrame( render );
    cube.rotation.x += parseFloat(xInput.val());
    cube.rotation.y += parseFloat(yInput.val());

    // Render the scene
    renderer.render(scene, camera);
    }
    render();
}

main();
//need to add script to autopopulate dropdown based on profiles saved to user 
 //create listener to update the sim 
 