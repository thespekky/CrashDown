
var start_button=document.getElementById("start");
var ranglista_button=document.getElementById("ranglista");
var ranglista_table=document.getElementById("ranglista_table");
var reset_button=document.getElementById("reset");
var player_name_input = document.getElementById("name");
var player_name;
reset_button.style.display="none";
var pontok=3200;

start_button.addEventListener("click",function(){
    player_name=document.getElementById("name").value;
    player_name_input.style.display="none";
    ranglista_button.style.display="none";
    reset_button.style.display="block";
    this.style.display="none";
})
ranglista_button.addEventListener("click",function(){
    player_name_input.style.display="none";
    ranglista_button.style.display="none";
    start_button.style.display="none";
    reset_button.style.display="block";
    ranglista_table.innerHTML=`<tr><th>nevek</th><th>pontok</th></tr> <tr><td>${player_name}</td><td>${pontok}</td></tr>`;
})
reset_button.addEventListener("click",function(){
    start_button.style.display="block";
    reset_button.style.display="none";
    player_name_input.style.display="block";
    ranglista_table.innerHTML="";
    ranglista_button.style.display="block";
})