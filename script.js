let sonuc;

let gorevlistesi = [];

if(localStorage.getItem("gorevListesi") !== null){
    gorevlistesi = JSON.parse(localStorage.getItem("gorevListesi"));
}

let editId;
let isEditTask = false;
const newInput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters =document.querySelectorAll(".filters span");

displayTask(document.querySelector("span.active").id);

function displayTask(filter){
    ul = document.getElementById("task-list");
    ul.innerHTML="";

    if(gorevlistesi.length == 0){
        ul.innerHTML="<p class='p-3 m-0'>Görev Listeniz Boş.</p>"
    }
    else{
        for(let gorev of gorevlistesi ){
            
            let completed = gorev.durum == "completed" ? "checked" :"";

            if(filter == gorev.durum || filter == "all"){
                let li = `
                    <li class="task list-group-item"> 
                        <div class="form-check">
                            <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}>
                            <label for="${gorev.id}" class="form-check-label ${completed}"> ${gorev.gorevAdi}</label>
                        </div>  
                        <div class="dropdown">
    
                        <div class="dropdown">
                            <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                             <i class="fa-solid fa-ellipsis"></i>
                         </button>
                         <ul class="dropdown-menu">
                             <li><a onclick="deletTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Sil </a></li>
                             <li><a onclick='editTask(${gorev.id},"${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle </a></li>
                          </ul>
                        </div>                     
                    </li>
                `
                ul.insertAdjacentHTML("beforeend", li)
            }
        }
    }
}

document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
document.querySelector("#btnAddNewTask").addEventListener("keypress", function(){
    if(event.key == "Enter"){
        document.getElementById("#btnAddNewTask").click;
    }
});

for(let span of filters){
    span.addEventListener("click", function(){
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTask(span.id);
    })
}

function newTask(event){

   if(newInput.value ==""){
        alert ("Görev girmelisiniz!");
    }else{
        if(!isEditTask){
            gorevlistesi.push({"id": parseInt(Math.random()*100+1), "gorevAdi":newInput.value, "durum":"pending"});
        }else{
            for(let editGorev of gorevlistesi){
                if(editGorev.id == editId){
                    editGorev.gorevAdi = newInput.value;
                }
            }
            isEditTask = false;
        }
        newInput.value="";
        displayTask(document.querySelector("span.active").id);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevlistesi));
    }   
    event.preventDefault();
}

function deletTask(id){

    let silId;
     for(let index in gorevlistesi){
       if(gorevlistesi[index].id == id){
            silId = index;
        }
    }
    gorevlistesi.splice(silId , 1);
    displayTask(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevlistesi));
}

function editTask(taskId, taskName){

    editId = taskId;
    isEditTask = true;
    newInput.value = taskName;
    newInput.focus();
    newInput.classList.add("active");
}

btnClear.addEventListener("click", function(){
    gorevlistesi.splice(0, gorevlistesi.length);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevlistesi));
    displayTask();
});

function updateStatus(selectedTask){

    let label = selectedTask.nextElementSibling;
    let durum;
    if(selectedTask.checked){
        label.classList.add("checked");
        durum = "completed";
    }else{
        label.classList.remove("checked");
        durum = "pending";
    }

    for(let grv of gorevlistesi){
        if(grv.id == selectedTask.id){
            grv.durum = durum;
        }
    }

    displayTask(document.querySelector("span.active").id);
    localStorage.setItem("gorevListesi", JSON.stringify(gorevlistesi));
}
