import _ from "lodash"
let apiCalled = false;
//main container declared
let tablecontainer=document.getElementById("table_container");
//main button declared
let button = document.getElementById("search_input");
button.addEventListener("click", function(){callApi();});
//text input declared and function assigned
let input = document.getElementById("text_input");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      callApi();
    }
});
// 404 error elements
let errorImage = document.createElement("img");
errorImage.src = "/src/assets/img/404error.png"
let errorMessage = document.createElement("p");
errorMessage.className="errorP";
errorMessage.innerText="Sorry Teammate, we don't have any informations";
// 404 error elements
// data table declared for creation
let table = document.createElement("table");
table.id = "data_table";
// description div declared for creation
let textElement = document.createElement("div");
textElement.id= "descDiv";
// final score declared for creation
let finalscore = document.createElement("p");
// clear button declared for  creation and function assigned
let clearbtn=document.createElement("button");
function createClearBtn(paragrafo){
        clearbtn.type="button";
        clearbtn.innerText="Clear";
        clearbtn.id="clear";
        clearbtn.setAttribute("class", "btn btn-outline-danger"); 
    
        clearbtn.onclick=function(){
            table.remove();
            textElement.remove();
            apiCalled=false;
        }
        paragrafo.appendChild(clearbtn)
};

//main function for fetching data
function callApi(){
    let Text = input.value;
    let apiUrl = `https://api.teleport.org/api/urban_areas/slug:${Text}/scores/`;
    if(Text !== ""){
        try{
            fetch(apiUrl)
            .then((response)=>{
//404 error block                
                if(response.status === 404){
                    tablecontainer.appendChild(errorImage);
                    tablecontainer.appendChild(errorMessage);
                    finalscore.style.display = "none";
                    clearbtn.style.display ="none";    
                } else {
                    errorImage.remove();
                    errorMessage.remove();
                    finalscore.style.display = "inline";
                    clearbtn.style.display ="";
                    return response.json();  
                }
//404 error block             
            })
//data display block           
            .then(data => {
                    (console.log(data))
                    table.innerHTML="";
                    textElement.innerHTML="";
                    //lodash _.get() implementation
                    let categories = _.get(data, "categories", []);
                    categories.forEach(category => {
                        let tbcolor = _.get(category, "color", "unknown")
                        let name =  _.get(category, "name", "unknown");
                        let score_out =  _.get(category, "score_out_of_10", "unknown");
                        let row = document.createElement("tr");   
                        let colors = document.createElement("td");                     
                        let names = document.createElement("td");
                        let scores = document.createElement("td");
                        colors.style.backgroundColor = `${tbcolor}`;
                        names.innerHTML = `${name}`;
                        scores.innerHTML= Math.round(`${score_out}` * 100) / 100;
                        row.appendChild(colors);
                        row.appendChild(names);
                        row.appendChild(scores);
                        table.appendChild(row);
                    });
                    tablecontainer.appendChild(table);
                    tablecontainer.append(textElement);
                    // lodash _.get() implementation
                    textElement.innerHTML= _.get(data, "summary", "");
                    finalscore.textContent = "Final Score: " + Math.round(_.get(data, "teleport_city_score", "")*100)/100;
                    textElement.append(finalscore);
                    createClearBtn(textElement);
                    });              
//data display block    
            apiCalled = true } 
        catch(error){
            alert("oops, something went wrong")
        };
    }; 
};
