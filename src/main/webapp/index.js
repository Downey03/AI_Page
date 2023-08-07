const UNDO = [];
const REDO = [];
const ELEMENTS = [];
const DATA = [];
const QUERIES = [];
const OBJECTS = {};


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

    console.log(DATA)
    for(x in DATA){

        query +=`${DATA[x]},`
        if(x == DATA.length-1){
            query = query.substring(0,query.length-1)
            query += ")  values("
        }
    }
    for(x in DATA){
        
        let elem = document.querySelector(`#${DATA[x]}`).children;
        console.log(DATA[x], elem)

        let element ;
        if(elem.length==1){
            element = elem[0];
        }else{

        }
        // if(clas == "field"){
        //     query += elem.value+",";
        // }else if(clas == "dropdown"){
        //     let ele = elem.children
        //     console.log(ele)
        //     let arr = elem.filter(n => n.getAttribute("selected"))
        //     console.log(arr)
        //     console.log(parseInt(elem.value))
        //     query += ""+parseInt(elem.value)
        // }

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
                    <div id="view-name" class="view">
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
                    query = `create table ${name} (sno int AUTO_INCREMENT primary key);`
                    QUERIES.push(query)
                    
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
                            inputElement1.setAttribute("class","field")
                            div.append(inputElement1)
                            console.log("created field "+name)
                            query = `alter table ${viewName} add column ${name} varchar(255);`
                            QUERIES.push(query)
                            break;
                        case "checkbox" :

                            args.forEach(ele => {
                                let inputElement2 = document.createElement("input")
                                inputElement2.setAttribute("type","checkbox")
                                inputElement2.setAttribute("id",`${name}`)
                                inputElement2.setAttribute("name",`${name}`)
                                inputElement2.setAttribute("value",`${ele}`)
                                query = `alter table ${viewName} add column ${name} boolean;`
                                let checkBoxLabel = document.createElement("label")
                                checkBoxLabel.setAttribute("for",`${name}`)
                                checkBoxLabel.textContent = ` ${ele}`
                                div.append(inputElement2)
                                div.append(checkBoxLabel)
                                div.append(document.createElement("br"))
                                QUERIES.push(query)
                            });
                            console.log("created checkbox "+name)
                            query = "alter"
                            break;
                        case "dropdown" :
                            let selectElement = document.createElement("select")
                            selectElement.setAttribute("for",`${name}`)
                            selectElement.setAttribute("id",`${name}`)
                            selectElement.setAttribute("class","dropdown")
                            // let inputElement3 = document.createElement("option")
                            // inputElement3.textContent = "select an option"
                            // inputElement3.setAttribute("selected",true)
                            // inputElement3.setAttribute("disabled",true)
                            // selectElement.append(inputElement3)
                            query = `create table ${name} (sno int primary key,${name} varchar(255));`;
                            QUERIES.push(query)
                            query = `alter table ${viewName} add column ${name} int;`
                            QUERIES.push(query)
                            query = `alter table ${viewName} add foreign key (${name}) references ${name}(sno);`
                            QUERIES.push(query)
                            query = `insert into ${name}(sno,${name}) values `;
                            var obj = {}
                            for(x in args){
                                let inputElement3 = document.createElement("option")
                                inputElement3.textContent = args[x]
                                inputElement3.setAttribute("value",parseInt(x)+1)
                                selectElement.append(inputElement3)
                                query += "("+(parseInt(x)+1)+`,\'${args[x]}\'),`
                                if(x == args.length-1){
                                    query = query.substring(0,query.length-1)
                                }
                                obj[x] = inputElement3;
                            }
                            OBJECTS[name] = obj
                            query +=";"
                            QUERIES.push(query)
                            div.append(selectElement)
                            console.log("created dropdown "+name)
                            
                            break;
                        case "date" :
                            let inputElement4 = document.createElement("input")
                            inputElement4.setAttribute("type","date")
                            inputElement4.setAttribute("id",`${name}`)
                            inputElement4.setAttribute("class","date")
                            div.append(inputElement4)
                            console.log("created date "+name)
                            break;
                        case "radio" :
                            let divElement = document.createElement("div")
                            divElement.setAttribute("id",`${name}`)
                            query = `create table ${name} (sno int primary key,${name} varchar(255));`;
                            QUERIES.push(query)
                            query = `alter table ${viewName} add column ${name} int;`
                            QUERIES.push(query)
                            query = `alter table ${viewName} add foreign key (${name}) references ${name}(sno);`
                            QUERIES.push(query)
                            query = `insert into ${name}(sno,${name}) values `;
                
                            var obj ={}
                            for(x in args){
                                let divE = document.createElement("section")
                                let label = document.createElement("label")
                                label.textContent = "  "+args[x]
                                label.setAttribute("for",args[x])

                                let inputElement5 = document.createElement("input")
                                inputElement5.setAttribute("id",args[x])
                                inputElement5.setAttribute("type","radio")
                                inputElement5.setAttribute("name",`${name}`)
                                inputElement5.setAttribute("value",parseInt(x)+1)
                                divE.append(inputElement5)
                                divE.append(label)
                                div.append(divE)
                                query += "("+(parseInt(x)+1)+`,\'${args[x]}\'),`
                                if(x == args.length-1){
                                    query = query.substring(0,query.length-1)
                                }
                                obj[x] = inputElement5;
                            }
                            query += ";";
                            QUERIES.push(query)
                            OBJECTS[name] = obj
                            console.log("create radio "+name)
                            break;
                    }
                    

                    document.querySelector("#elements").append(div)
                    ELEMENTS.push(`${name}`)
                    DATA.push(name)
                    
            }
            // doUpdate()
            console.log(QUERIES)
            query = ""
            QUERIES.length = 0
    }
    
})



function doUpdate(){

    fetch(url,{
         method:"POST",
         body: query
         })
}