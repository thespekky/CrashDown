
const Szin=["red","blue","green"];
class cube{
    x;
    y;
    type;
    size;
    time
    constructor( x, y, type, size, time){ 
        this.x=x;
        this.y=y;
        this.type=type;
        this.size=size;
        this.time=time;
    }
    static random(){
       return Szin[Math.floor(Math.random()*Szin.length)];
    }
    static is_bonus_time(){
        return Math.floor(Math.random()*bonus_time_value)==0;
    }
}

// elemek lekérése 

var container=document.getElementById("container");
var start_button=document.getElementById("start");
var ranglista_button=document.getElementById("ranglista");
var ranglista_table=document.getElementById("ranglista_table");
var reset_button=document.getElementById("reset");
var settings_button=document.getElementById("settings");
var player_name_input = document.getElementById("name");
var music_slider=document.getElementById("volume");
var click_div=document.getElementById("click_div");
var click_slider=document.getElementById("click_slider");
var time_slider=document.getElementById("time_slider");
var time_div=document.getElementById("time_div");
var sound=document.getElementById("sound");
var background_music=document.getElementById("background");
var timer=document.getElementById("time");
var timer_div=document.getElementById("timer");
var click_music=document.getElementById("click");
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var player_name;

var timecounter;
var bonus_time_value=30;
var pontok=0;
var cubes=[];
var cubesize=50;
var time=60;

var row_count;
var column_count;
var can_click=true;


// indításkor az ranglista és beállítások elemeinek eltüntesése

click_div.style.display="none";
sound.style.display="none";
reset_button.style.display="none";
canvas.style.display="none";
timer_div.style.display="none";
time_div.style.display="none";


background_music.volume=music_slider.value/100;
click_music.volume=click_slider.value/100;

//hangerő beállításaihoz tartotó kódrészlet

function playmusic(){
background_music.play();
}

time_slider.addEventListener("input",function(){
    bonus_time_value=100-time_slider.value;
});

document.addEventListener("click",function(){
    playmusic();
    click_music.play();
});

click_slider.addEventListener("input",function(){
    click_music.volume=click_slider.value/100;
});

music_slider.addEventListener("input",function(){
    background_music.volume=music_slider.value/100;
});

//függvények

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
    var new_player=
    {
       name:player_name,
       score:pontok,
       time:time
    }
    ranglista.push(new_player);
    sessionStorage.setItem("ranglista",JSON.stringify(ranglista));
};

async function raise_cubes_height(){
    if(cubes.length==0)return;
    for(let i=0;i<cubes.length;i++){
        cubes[i].y-=cubesize;
        if(cubes[i].y<=0){
           gamelost("a plafonra értek a nyégyzetek");
        }
    }

};

async function fillrows(rows){
    if(rows==0)return;
    await raise_cubes_height();
    var xpos=0;
    var ypos=canvas.height-cubesize;
    for(let i=0;i<row_count;i++){
        var new_cube=new cube(xpos,ypos,cube.random(),cubesize,cube.is_bonus_time());
        xpos+=cubesize;
        cubes.push(new_cube);
    }
    fillrows(rows-1);
};

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
};

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
};

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
};

function reset_function(){
    clearInterval(timecounter);
    start_button.style.display="block";
    reset_button.style.display="none";
    player_name_input.style.display="block";
    ranglista_table.innerHTML="";
    ranglista_button.style.display="block";
    canvas.style.display="none";
    click_div.style.display="none";
    sound.style.display="none";
    settings_button.style.display="block";
    timer_div.style.display="none";
    time_div.style.display="none";
    cubes=[];
    container.classList.add("container");
    container.classList.remove("settings");
};

function timer_start(){
    timecounter = setInterval(() => {
        if(time>=60)
        {
            if(time%60<10)
            {
                timer.innerHTML=`${Math.floor(time/60)}:0${ time%60}`;
            }
            else
            {   
                timer.innerHTML=`${Math.floor(time/60)}:${ time%60}`;
            }
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
    time-=1;
    }, 1000);
};
function animate()
{
    draw()
    requestAnimationFrame(animate);
};

function draw()
{
    ctx.save();
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    cubes.forEach(cube => {
        ctx.strokeStyle="black";
        ctx.fillStyle=cube.type;
        ctx.fillRect(cube.x,cube.y,cube.size,cube.size);
        ctx.strokeRect(cube.x,cube.y,cube.size,cube.size);
        if(cube.time)
        {
            ctx.beginPath();
            ctx.strokeStyle="yellow";
             ctx.fillStyle="yellow";
            ctx.arc(cube.x+cube.size/2,cube.y+cube.size/2,cube.size/4,45,180);
            ctx.stroke();
            ctx.fill();
        }
    });
    ctx.restore();
};

// eventlistenerek

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
    var pluszpontok=0;
    var szorzo=1+neighbours.length/10;
    cubes=cubes.filter(cube=>{ 
    if (neighbours.includes(cube))
    {
        if(cube.time)
        {
            time+=10;
        }
       pluszpontok+=1*szorzo;
        return false;
    }
    else
    { 
        return true;
    }
    });
    pontok+=Math.floor(pluszpontok);
    await fall_cubes();

})



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
    timer_div.style.display="block";
    time=60;
    pontok=0;
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    animate();
    timer_start();
});

ranglista_button.addEventListener("click",function(){
    player_name_input.style.display="none";
    ranglista_button.style.display="none";
    start_button.style.display="none";
    reset_button.style.display="block";
    settings_button.style.display="none";
    sound.style.display="none";
    var ranglista=JSON.parse(sessionStorage.getItem("ranglista"));
    ranglista.sort( (a, b) => b.score - a.score);
    ranglista_table.innerHTML=`<thead> <tr><th>nevek</th><th>pontok</th> <th>maradék idő</th> </tr></thead> <tbody>`;
    ranglista.forEach(player => {
        var string_time;
        if (player.time>60)
        {
            string_time=`${Math.floor(player.time/60)}:${player.time%60}`;
        }
        else if(player.time>=10)
        {
            string_time='00:'+player.time; 
        }
        else
        {
            string_time='00:0'+player.time;
        }
        ranglista_table.innerHTML+=`<tr><td>${player.name}</td><td>${player.score}</td> <td>${string_time}</td></tr>`;
    });
    ranglista_table.innerHTML+=`</tbody>`;
});

reset_button.addEventListener("click",function(){
    reset_function();

});
settings_button.addEventListener("click",function(){
    sound.style.display="block";
    reset_button.style.display="block";
    ranglista_button.style.display="none";
    start_button.style.display="none";
    player_name_input.style.display="none";
    settings_button.style.display="none";
    click_div.style.display="block";
    time_div.style.display="block";
    container.classList.remove("container");
    container.classList.add("settings");
})