class cube{
    x;
    y;
    type;
    size;
    constructor( x, y, type, size) {
        this.x=x;
        this.y=y;
        this.type=type;
        this.size=size;
    }
     RandomBlock(x,y,type,size){
        this.x=x;
        this.y=y;
        this.type=type;
        this.size=size;
    }
}


var start_button=document.getElementById("start");
var ranglista_button=document.getElementById("ranglista");
var ranglista_table=document.getElementById("ranglista_table");
var reset_button=document.getElementById("reset");
var settings_button=document.getElementById("settings");
var player_name_input = document.getElementById("name");
var music_slider=document.getElementById("volume");
var sound=document.getElementById("sound");
var background_music=document.getElementById("background");
var click_music=document.getElementById("click");
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var player_name;

music_slider.style.display="none";
sound.style.display="none";
reset_button.style.display="none";
canvas.style.display="none";

var pontok=3200;
var cubes=[];
var cubesize=20;


 background_music.volume=music_slider.value/100;
function playmusic(){
background_music.play();
}

document.addEventListener("click",function(){
    playmusic();
    click_music.play();
});


music_slider.addEventListener("input",function(){
    background_music.volume=music_slider.value/100;
});

start_button.addEventListener("click",function(){
    player_name=document.getElementById("name").value;
    player_name_input.style.display="none";
    ranglista_button.style.display="none";
    reset_button.style.display="block";
    start_button.style.display="none";
    this.style.display="none";
    canvas.style.display="block";
    settings_button.style.display="none";
    sound.style.display="none";
    music_slider.style.display="none";
    canvas.width=window.innerWidth-30;
    canvas.height=window.innerHeight-100;
    
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    animate();

})
ranglista_button.addEventListener("click",function(){
    player_name_input.style.display="none";
    ranglista_button.style.display="none";
    start_button.style.display="none";
    reset_button.style.display="block";
    settings_button.style.display="none";
    sound.style.display="none";
    music_slider.style.display="none";
    ranglista_table.innerHTML=`<tr><th>nevek</th><th>pontok</th></tr> <tr><td>${player_name}</td><td>${pontok}</td></tr>`;
})
reset_button.addEventListener("click",function(){
    start_button.style.display="block";
    reset_button.style.display="none";
    player_name_input.style.display="block";
    ranglista_table.innerHTML="";
    ranglista_button.style.display="block";
    canvas.style.display="none";
    music_slider.style.display="none";
    sound.style.display="none";
    settings_button.style.display="block";
})
settings_button.addEventListener("click",function(){
    sound.style.display="block";
    music_slider.style.display="block";
    reset_button.style.display="block";
})


function animate()
{
    requestAnimationFrame(draw);
    
    setInterval(animate,20);
}
function draw()
{
    ctx.save();
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    cubes.forEach(cube => {
        ctx.strokeStyle="black";
        ctx.fillStyle=cube.type;
        ctx.fillRect(cube.x,cube.y,cube.size,cube.size);
    });
    ctx.restore();
}