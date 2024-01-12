// DOM content load event for loading elements from HTML
document.addEventListener('DOMContentLoaded', function () {

    // Define API URL for gender prediction
    const PREDICTOR_API_URL = "https://api.genderize.io/?name=";

    // Object to store user-inputted form data
    const userInputtedFormData = {
        name: "",
        gender: undefined,
    };

    // Initialize input elements
    const nameInput = document.querySelector("#name");
    const form = document.querySelector("#form");
    const savedAnswer = document.querySelector("#saved-answer");
    const errorText = document.querySelector("#error_text");

    // Initialize buttons
    const saveButton = document.querySelector("#save");
    const clearButton = document.querySelector("#clear");

    // Initialize elements to display API call results
    const genderHeader = document.querySelector("#gender-header");
    const genderPrediction = document.querySelector("#gender-prediction");
    const errorElement = document.querySelector("#error_element");

    // Event handler for the "Clear" button
    clearButton.addEventListener("click", () => {
        errorElement.style.display = "none";
        if (localStorage.getItem(userInputtedFormData.name)) {
            localStorage.removeItem(userInputtedFormData.name);
            savedAnswer.innerHTML = "Saved Submits Area";
            alert("Data is cleared");
            savedAnswer.innerHTML = "Saved Submits Area";
        } else {
            alert("Data has been cleared.");
        }
    });

    // Event handler for the "Save" button
    saveButton.addEventListener("click", () => {
        errorElement.style.display = "none";
        if (userInputtedFormData.gender !== undefined && userInputtedFormData.name !== '') {
            if (userInputtedFormData.name.length < 255) {
                var english = /^[A-Za-z ]*$/;
                var isCorrect = true;
                for (i = 0; i < userInputtedFormData.name.length; i++) {
                    if (!english.test(userInputtedFormData.name[i])) {
                        isCorrect = false;
                        break;
                    }
                }

                if (isCorrect) {
                    localStorage.setItem(userInputtedFormData.name, userInputtedFormData.gender);
                    alert("Data is saved successfully");
                } else {
                    alert("Predictor won't recognize other characters");
                }

            } else {
                alert("Maximum limit for name is 255 characters");
            }

        } else {
            alert("Complete the form");
        }
    });

    // Event listener for changes in the name input
    nameInput.addEventListener("change", (event) => {
        userInputtedFormData.name = event.target.value;
    });

    // Event listener for changes in the form (gender selection)
    form.addEventListener("change", () => {
        userInputtedFormData.gender = document.querySelector('input[name="radio-group"]:checked')?.value;
    });

    // Event listener for form submission
    form.addEventListener("submit", (event) => {
        // Prevent default form submission behavior
        errorElement.style.display = "none";
        event.preventDefault();

        // Validate user-inputted data
        if (userInputtedFormData.name !== '') {
            if (userInputtedFormData.name.length < 255) {
                var english = /^[A-Za-z ]*$/;
                var isCorrect = true;
                for (i = 0; i < userInputtedFormData.name.length; i++) {
                    if (!english.test(userInputtedFormData.name[i])) {
                        isCorrect = false;
                        break;
                    }
                }

                if (!isCorrect) {
                    alert("Predictor won't recognize other characters");
                    return;
                }

            } else {
                alert("Maximum limit for name is 255 characters");
                return;
            }

        } else {
            alert("Complete the form");
            return;
        }

        // Fundamental conditions passed, start API calling
        genderHeader.innerHTML = "Loading...";
        genderPrediction.innerHTML = "Loading...";
        savedAnswer.innerHTML = "Loading...";

        // Show result from local storage
        if (localStorage.getItem(userInputtedFormData.name)) {
            savedAnswer.innerHTML = localStorage.getItem(userInputtedFormData.name);
        } else {
            savedAnswer.innerHTML = "This data is new";
        }

        // API calling
        fetch(`${PREDICTOR_API_URL}${userInputtedFormData.name}`)
            .then((res) => res.json())
            .then((res) => {
                // Display response from the HTTP request
                genderHeader.innerHTML = res.gender;
                genderPrediction.innerHTML = `${res.probability}`;
            })
            .catch((error) => {
                // Handle errors from network, HTTP request, or destination server
                errorElement.style.display = "flex";
                errorText.innerHTML = error.message;
                genderHeader.innerHTML = "Predicted Gender";
                genderPrediction.innerHTML = "Probability of the prediction";
                alert(error.message);
            });
    });

});
