const UNDO = [];
const REDO = [];
const ELEMENTS = [];
const DATA = [];
const QUERIES = [];

const commandBox = document.querySelector("#command");
const content = document.querySelector("#main");
let viewName;
let view;
let query;

document.addEventListener('mousemove',function(){
    try{
        if(document.querySelector("#view")==null){
            document.querySelector("#save").style.display = "none";
        }else{
            document.querySelector("#save").style.display = "block";
        }
    }catch{

    }
    
})



function execQuery(){
    query = `insert into ${viewName}(`
    for(x in DATA){

        query +=`${DATA[x]},`
        if(x == DATA.length-1){
            query = query.substring(0,query.length-1)
            query += ")  values("
        }
    }
    for(x in DATA){
        
        query += document.querySelector(`#${DATA[x]}`).value+",";
        if(x == DATA.length-1){
            query = query.substring(0,query.length-1)
            query += ")"
        }
    }

    console.log(query)
}

commandBox.addEventListener('keyup',function(e){
    if(e.keyCode == 13){

       
        var Input = commandBox.value;
        commandBox.value = ""
        Input = Input.substring(0,Input.length-1)
        var Inputs = Input.split(" ");

        var command = Inputs[0]
        var element = Inputs[1]
        var name = Inputs[2];
        var args = Inputs.slice(3,Inputs.length)

        const CLEAR = "clear";
        const RD = "rd";
        const UD = "ud";
        const FI = "fi";
        const CB = "cb";
        const DD = "dd";
        const VIEW = "view";
        const CREATE = "create"

        if(command.toLowerCase() == CLEAR.toLowerCase()){
            document.querySelector("#main").innerHTML = ""
            console.log("view cleared")
            DATA.length = 0
            ELEMENTS.length = 0
            return
        }

            if(ELEMENTS.includes(`${name}`)){
                console.log("conflict - name already used")
               return
            } 

            if(element.toLowerCase() == "view"){
                if(document.querySelector("#view")!=null){
                    console.log("view already found")
                    console.log("use command 'clear' to reset the view")
                    return
                }
                content.innerHTML = `<section id="view">
                    <div id="view-name">
                    <h2>${name}</h2>
                    <input type="hidden" value="${name}">
                    </div>
                    <div id="elements"></div>
                    <div id="save-div">
                    <button id="save" onclick="execQuery()">Save</button>
                    </div>
                    </section>`;
                    ELEMENTS.push(`${name}`)
                    viewName = `${name}`
                    console.log("created view "+name)
                    query = `create table ${name} (varchar(255) s.no)`
                    
            }

            if(document.querySelector("#view") == null){
                console.log("no view found - create a view")
                return
            }

                if(element.toLowerCase() != "view"){
                    let div = document.createElement("div")
                    let labelElement = document.createElement("label")
                    labelElement.textContent = `${name}`
                    labelElement.setAttribute("for",`${name}`)
                    div.append(labelElement)
                    div.append(document.createElement("br"))

                    switch(element.toLowerCase()){
                        case "field" :
                            let inputElement1 = document.createElement("input")
                            inputElement1.setAttribute("type","text")
                            inputElement1.setAttribute("id",`${name}`)
                            div.append(inputElement1)
                            console.log("created field "+name)
                            query = `alter table ${viewName} add column ${name} varchar(255)`
                            break;
                        case "checkbox" :
                            args.forEach(ele => {
                                let inputElement2 = document.createElement("input")
                                inputElement2.setAttribute("type","checkbox")
                                inputElement2.setAttribute("id",`${name}`)
                                inputElement2.setAttribute("name",`${name}`)
                                inputElement2.setAttribute("value",`${ele}`)
                                let checkBoxLabel = document.createElement("label")
                                checkBoxLabel.setAttribute("for",`${name}`)
                                checkBoxLabel.textContent = ` ${ele}`
                                div.append(inputElement2)
                                div.append(checkBoxLabel)
                                div.append(document.createElement("br"))
                            });
                            console.log("created checkbox "+name)
                            break;
                        case "dropdown" :
                            let selectElement = document.createElement("select")
                            selectElement.setAttribute("for",`${name}`)
                            selectElement.setAttribute("id",`${name}`)
                            // let inputElement3 = document.createElement("option")
                            // inputElement3.textContent = "select an option"
                            // inputElement3.setAttribute("selected",true)
                            // inputElement3.setAttribute("disabled",true)
                            // selectElement.append(inputElement3)
                            args.forEach(ele => {
                                let inputElement3 = document.createElement("option")
                                inputElement3.textContent = ele
                                inputElement3.setAttribute("value",`${ele}`)
                                selectElement.append(inputElement3)
                            })
                            div.append(selectElement)
                            console.log("created dropdown "+name)
                            break;
                        case "date" :
                            let inputElement4 = document.createElement("input")
                            inputElement4.setAttribute("type","date")
                            inputElement4.setAttribute("id",`${name}`)
                            div.append(inputElement4)
                            console.log("created date "+name)
                            break;
                        case "radio" :

                    }
                    

                    document.querySelector("#elements").append(div)
                    ELEMENTS.push(`${name}`)
                    DATA.push(name)
                    
            }
            // doUpdate()
            console.log(query)
            query = ""
    }
    
})



function doUpdate(){

    fetch(url,{
         method:"POST",
         body: query
         })
}