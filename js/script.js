//DOM content load for loading elements from html
document.addEventListener('DOMContentLoaded', function () {

    //define api url
    const PREDICTOR_API_URL = "https://api.genderize.io/?name=";

    const userInputtedFormData = {
        name: "",
        gender: undefined,
    };
    
    // inputs values 
    const nameInput = document.querySelector("#name");
    const form = document.querySelector("#form");
    const savedAnswer = document.querySelector("#saved-answer");
    const errorText = document.querySelector("#error_text");
    

    //buttons initializing
    const saveButton = document.querySelector("#save");
    const clearButton = document.querySelector("#clear");

    //results of api callings
    const genderHeader = document.querySelector("#gender-header");
    const genderPrediction = document.querySelector("#gender-prediction");
    const errorElement = document.querySelector("#error_element");

    //this event handler will help us to mange clear events
    clearButton.addEventListener("click", () => {
        errorElement.style.display = "none";
        if (localStorage.getItem(userInputtedFormData.name)) {
          localStorage.removeItem(userInputtedFormData.name);
          savedAnswer.innerHTML = "Saved Submits Area"
          alert("data is cleared");
          savedAnswer.innerHTML = "Saved Submits Area"
        }else{
            alert("data has been cleared.");
        }
    
      });
    
      //this event handler will help us to mange save events
      saveButton.addEventListener("click", () => {
        errorElement.style.display = "none";
        if (userInputtedFormData.gender !== undefined && userInputtedFormData.name !== '') {
            if(userInputtedFormData.name.length < 255){
                var english = /^[A-Za-z ]*$/;
                var isCorrect = true
                for (i=0;i<userInputtedFormData.name.length;i++) {
                    if (!english.test(userInputtedFormData.name[i]) ){
                        isCorrect = false
                        break; 
                    }
                }

                if(isCorrect){
                    localStorage.setItem(userInputtedFormData.name, userInputtedFormData.gender);
                    alert("data is saved successfully");
                }else{
                    alert("predictor won't recognize other characters");
                }
        
            }else{
                alert("maximum limit for name is 255 character");
            }
          
        }else {
            alert("complete form");
        }
      });

      nameInput.addEventListener("change", (event) => {
        userInputtedFormData.name = event.target.value;
      });

      form.addEventListener("change", () => {
        userInputtedFormData.gender = document.querySelector('input[name="radio-group"]:checked')?.value;
      });

      
      form.addEventListener("submit", (event) => {

        errorElement.style.display = "none";
        event.preventDefault();     
    
        if (userInputtedFormData.name !== '') {
            if(userInputtedFormData.name.length < 255){
                var english = /^[A-Za-z ]*$/;
                var isCorrect = true;
                for (i=0;i<userInputtedFormData.name.length;i++) {
                    if (!english.test(userInputtedFormData.name[i]) ){
                        isCorrect = false;
                        break; 
                    }
                }

                if(!isCorrect){
                    alert("predictor won't recognize other characters");
                    return;
                }
        
            }else{
                alert("maximum limit for name is 255 character");
                return;
            }
          
        }else {
            alert("complete form");
            return;
        }
        
        //we passed the fundamental conditions and now api calling is starting
        genderHeader.innerHTML = "loading...";
        genderPrediction.innerHTML = "loading...";
        savedAnswer.innerHTML = "loading...";

    
        //SHOW RESULT FROM LOCAL STORAGE
        if (localStorage.getItem(userInputtedFormData.name)){
            savedAnswer.innerHTML = localStorage.getItem(userInputtedFormData.name);
        }else{
            savedAnswer.innerHTML = "this data is new";
        }
      
        //now api calling is started here
        fetch(`${PREDICTOR_API_URL}${userInputtedFormData.name}`)
          .then((res) => res.json())
          .then((res) => {
            //getting response from http req from server
            //json form gender:Str , probability:Str
            genderHeader.innerHTML = res.gender;
            genderPrediction.innerHTML = `${res.probability}`;
          }).catch((error) => {
            errorElement.style.display = "flex";
            errorText.innerHTML = error.message;
            //error is detected from network and http request or distension server
            genderHeader.innerHTML = "Predicted Gender";
            genderPrediction.innerHTML = "Probability of the prediction";
            alert(error.message);
          });
      });
      
});