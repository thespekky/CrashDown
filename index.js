
const Szin=["red","blue","green"];
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
    static random(){
       return Szin[Math.floor(Math.random()*Szin.length)];
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
var timer=document.getElementById("time");
var timer_div=document.getElementById("timer");
var click_music=document.getElementById("click");
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var player_name;

music_slider.style.display="none";
sound.style.display="none";
reset_button.style.display="none";
canvas.style.display="none";
timer_div.style.display="none";

var pontok=0;
var cubes=[];
var cubesize=50;
var time=60;
cubes.push(new cube(0,0,cube.random(),cubesize));

var row_count;
var column_count;
var can_click=true;


 background_music.volume=music_slider.value/100;
function playmusic(){
background_music.play();
}

document.addEventListener("click",function(){
    playmusic();
    click_music.play();
});

function gamelost(string){
    alert(string);
   reset_function();
   var ranglista=[];
   ranglista=JSON.parse(sessionStorage.getItem("ranglista"));
    if(ranglista==null)
    {
        ranglista=[];
    }
   if(player_name===undefined||player_name=="")
    {
        player_name="Anonymus";
    }
   var new_player={
       name:player_name,
       score:pontok
   }
   ranglista.push(new_player);
   sessionStorage.setItem("ranglista",JSON.stringify(ranglista));
}
async function raise_cubes_height(){
    if(cubes.length==0)return;
    for(let i=0;i<cubes.length;i++){
        cubes[i].y-=cubesize;
        if(cubes[i].y<=0){
           gamelost("a plafonra értek a nyégyzetek");
        }
    }

}
async function fillrows(rows){
    if(rows==0)return;
   await raise_cubes_height();
    var xpos=0;
    var ypos=canvas.height-cubesize;
    for(let i=0;i<row_count;i++){
        var new_cube=new cube(xpos,ypos,cube.random(),cubesize);
        xpos+=cubesize;
        cubes.push(new_cube);
    }
    fillrows(rows-1);
    /*for(let i=0;i<rows;i++){
        cubes.push(new cube(Math.floor(Math.random()*(canvas.width-cubesize)),Math.floor(Math.random()*(canvas.height-cubesize)),cube.random(),cubesize));
    }*/
}

function find_neighbours(clicked_cube,neighbours){
    var found=false;
    var same_cubes=[];
    for (let i=0;i<cubes.length;i++)
    {
        var cube=cubes[i];
        if (cube.x+cubesize==clicked_cube.x && cube.y==clicked_cube.y && cube.type==clicked_cube.type && neighbours.includes(cube)==false)
        {
            found=true;
            same_cubes.push(cube);
            neighbours.push(cube);
        }
        else if (cube.x-cubesize==clicked_cube.x && cube.y==clicked_cube.y && cube.type==clicked_cube.type && neighbours.includes(cube)==false)
        {
            found=true;
            same_cubes.push(cube);
            neighbours.push(cube);
        }
        else if (cube.x==clicked_cube.x && cube.y+cubesize==clicked_cube.y && cube.type==clicked_cube.type && neighbours.includes(cube)==false)
        {
            found=true;
            same_cubes.push(cube);
            neighbours.push(cube);
        }
        else if (cube.x==clicked_cube.x && cube.y-cubesize==clicked_cube.y && cube.type==clicked_cube.type && neighbours.includes(cube)==false)
        {
            found=true;
            same_cubes.push(cube);
            neighbours.push(cube);
        }
    }
    if (found)
    {
        same_cubes.forEach(cube => {
            find_neighbours(cube,neighbours);
        });
    }
}
function find_cube(c)
{
    var found=false;
   var found_cube=cubes.find(cube=>{
       return cube.x==c.x && cube.y==c.y+cubesize;
   })
   if(found_cube===undefined)
   {
        found=true;
   }
    return found;
}

function get_floating_cubes()
{
    var floating_cubes=[];
    for (let i=0;i<cubes.length;i++)
    {
        var cube=cubes[i];
        if (cube.y+cubesize<=canvas.height-cubesize)
        {
            if(find_cube(cube)&&floating_cubes.includes(cube)==false)
            {
                floating_cubes.push(cube);
            }
            
        }
    }
    return floating_cubes;
}

async function fall_cubes(){
    var floating_cubes=get_floating_cubes();
    if(floating_cubes.length==0)
    {
        can_click=true;
        fillrows(1);
         return;
    }
    setTimeout(() => {
        
    }, 50);
    floating_cubes.forEach(cube => {
        cube.y+=cubesize;
    });
    setTimeout(fall_cubes,50);
}
function reset_function(){
    start_button.style.display="block";
    reset_button.style.display="none";
    player_name_input.style.display="block";
    ranglista_table.innerHTML="";
    ranglista_button.style.display="block";
    canvas.style.display="none";
    music_slider.style.display="none";
    sound.style.display="none";
    settings_button.style.display="block";
    timer_div.style.display="none";
    cubes=[];
}

function timer_start(){
    time=10;
    timecounter = setInterval(() => {
        time-=1;
        if(time>=60)
        {
            timer.innerHTML=`${Math.floor(time/60)}:${time%60}`;
        }
        else if(time>=10)
        {
            timer.innerHTML='00:'+time; 
        }
        else
        {
            timer.innerHTML='00:0'+time;
        }

        if(time<=0)
        {
            gamelost("lejárt az idő");
            clearInterval(timecounter);
        }
    }, 1000);
}
canvas.addEventListener("click",async function(event){
    if(!can_click)return;
    can_click=false;
    var x=event.offsetX;
    var y=event.offsetY;
    var clicked_cube=cubes.find(cube=>{
        return (cube.x<=x && cube.x+cubesize>=x) && (cube.y<=y && cube.y+cubesize>=y);
    });
    if(clicked_cube==undefined)
    {
        can_click=true; 
        return;
    }

    var neighbours=[];
    find_neighbours(clicked_cube,neighbours);
    if (neighbours.length<3)
    {
        can_click=true;
        return;
    }
    cubes=cubes.filter(cube=>{ 
    if (neighbours.includes(cube))
    {
        pontok++;
        return false;
    }
    else
    { 
        return true;
    }
    });
    await fall_cubes();

})

music_slider.addEventListener("input",function(){
    background_music.volume=music_slider.value/100;
});

start_button.addEventListener("click",async function(){
    cubes=[];
    canvas.width=Math.floor((window.innerWidth-30)/cubesize)*cubesize;
    canvas.height=Math.floor((window.innerHeight-100)/cubesize)*cubesize;
    row_count=Math.floor(canvas.width/cubesize);
    column_count=Math.floor(canvas.height/cubesize);
    await fillrows(3);
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
    timer_div.style.display="block";
    
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    animate();
    timer_start();
})
ranglista_button.addEventListener("click",function(){
    player_name_input.style.display="none";
    ranglista_button.style.display="none";
    start_button.style.display="none";
    reset_button.style.display="block";
    settings_button.style.display="none";
    sound.style.display="none";
    music_slider.style.display="none";
    var ranglista=JSON.parse(sessionStorage.getItem("ranglista")); 
    ranglista_table.innerHTML=`<thead> <tr><th>nevek</th><th>pontok</th></tr></thead> <tbody>`;
    ranglista.forEach(player => {
        ranglista_table.innerHTML+=`<tr><td>${player.name}</td><td>${player.score}</td></tr>`;
    });
    ranglista_table.innerHTML+=`</tbody>`;
})
reset_button.addEventListener("click",function(){
    reset_function();

})
settings_button.addEventListener("click",function(){
    sound.style.display="block";
    music_slider.style.display="block";
    reset_button.style.display="block";
    ranglista_button.style.display="none";
    start_button.style.display="none";
    player_name_input.style.display="none";
    settings_button.style.display="none";
})


function animate()
{
    draw()
    requestAnimationFrame(animate);
}
function draw()
{
    ctx.save();
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    cubes.forEach(cube => {
       /*if(cube.y>0)
        {
            cube.y-=0.1;
        }*/
        ctx.strokeStyle="black";
        ctx.fillStyle=cube.type;
        ctx.fillRect(cube.x,cube.y,cube.size,cube.size);
        ctx.strokeRect(cube.x,cube.y,cube.size,cube.size);
    });
    ctx.restore();
}