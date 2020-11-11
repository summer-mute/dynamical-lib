import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';

import { TrackballControls } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'https://cdn.jsdelivr.net/npm/three@0.122.0/examples/jsm/renderers/CSS3DRenderer.js';


let camera, scene, renderer;
let controls;

//creates the element that displays the videos
function Element( id, x, y, z, ry ) {

    const div = document.createElement( 'div' );
    div.style.width = '480px';
    div.style.height = '360px';
    div.style.backgroundColor = '#000';

    const iframe = document.createElement( 'iframe' );
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';
    iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
    div.appendChild( iframe );

    const object = new CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;

    return object;

};


//initial videos in the animation
const videoIdArr = ['ea2WoUtbzuw','PWgvGjAhvIw','L9l8zCOwEII','oRdxUFDoQe0'];
const videosName = ['Clair de Lune (Extended)', 'OutKast - Hey Ya! (Official Music Video)', 'Clairo - Sofia', 'Michael Jackson - Beat It (Official Video)'];



function init(array) {
    

    const container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( 500, 350, 750 );

    scene = new THREE.Scene();

    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    const group = new THREE.Group();
    group.add( new Element( array[0], 0, 0, 240, 0 ) );
    group.add( new Element( array[1], 240, 0, 0, Math.PI / 2 ) );
    group.add( new Element( array[2], 0, 0, - 240, Math.PI ) );
    group.add( new Element( array[3], - 240, 0, 0, - Math.PI / 2 ) );
    scene.add( group );

    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 4;

    window.addEventListener( 'resize', onWindowResize, false );

    // Block iframe events when dragging camera

    const blocker = document.getElementById( 'blocker' );
    blocker.style.display = 'none';

    controls.addEventListener( 'start', function () {

        blocker.style.display = '';

    } );
    controls.addEventListener( 'end', function () {

        blocker.style.display = 'none';

    } );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );

}

//renders buttons of saved videos
function renderButtons() {

    // clearing buttons area before creating new ones
    $("#buttons-area").empty();

    //this will call the database for the name of the first four videos saved
    for (var i = 0; i < videosName.length; i++) {

      // Then dynamicaly generating buttons for each video in the array
      var a = $("<button>");
      a.addClass("video-btn btn btn-outline-secondary btn-block");
      // Adding a data-attribute
      a.attr("data-name", videoIdArr[i]);
      // Providing the text
      a.text(videosName[i]);
      // Adding the button to the buttons-area div
      $("#buttons-area").append(a);      
    }
  }


function saveVideo(video){
    $.post("/api/video", video, function(){
        console.log(video)
    })
}

 //searching for a video and adding it to the animation 
$("#searchbtn").on("click", function(event){
    event.preventDefault();
    const searchTerm = $("#searchtext").val().trim();
    //call to the video api that gets data
    $.get("/api/video/"+searchTerm).then(data=>{
        $("#searchtext").val("");
        //clearing the container for the new animation
        $("#container").html("<div id=\"blocker\"></div>")

        //saving the title and data as an object
        const newVideo = {
            title: data.items[0].snippet.title,
            videoId: data.items[0].id.videoId,
        }
        //save the video in the database
        saveVideo(newVideo)
        //push into the arrays used to display
        videosName.unshift(newVideo.title);
        videoIdArr.unshift(newVideo.videoId);

        init(videoIdArr);
        animate();
        renderButtons();
    })
    
   

})

//this function gets the saved videos from the database for the user
//it them adds it to the array that displays the videos and button
function retrieveVideos(){
    $.get("/api/videos").then(data=>{
        for (let i=0; i<data.length; i++){
            console.log(data[i].title)
            videosName.unshift(data[i].title);
            videoIdArr.unshift(data[i].videoId);
        }
        console.log(videosName);
        $("#container").html("<div id=\"blocker\"></div>")
        init(videoIdArr);
        animate();
        renderButtons();
    })
}

 //when the save button is clicked the saved videos appear
 $("#savedbtn").on("click", function(event){
    event.preventDefault();
    //calls the fuction to retrieve the information
    retrieveVideos()
    })

//event listener for buttons already created
$(document).on("click", ".video-btn", function() {
    var id = $(this).attr("data-name");
    var title = $(this).text();
    videoIdArr.unshift(id);
    videosName.unshift(title);
    $("#container").html("<div id=\"blocker\"></div>")
    init(videoIdArr);
    animate();

});

init(videoIdArr);

animate();
renderButtons()