
const input = document.querySelector('#input_hai');
const aisehi = document.querySelector('#aisehi');
function checker(){
    input.addEventListener('input',function(e){
    console.log(`We are here 1`);
    if(locals.habbits.includes(e.target.value)){
        console.log(`We are here 2`);
        alert("Habbit is already added, please add another");
     }
})
                    
                }
                checker();