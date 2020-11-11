
var categorySelectionEl = document.querySelector("#categorySelection");
var categoryEl = document.querySelector("#category");

var countriesBox = document.getElementById("countries-box");
var recipeList = document.getElementById("recipe-list");

var countriesList = ["American","British","Canadian","Chinese","Dutch","Egyptian","French","Indian","Irish","Italian","Jamaican","Japanese","Kenyan","Malaysian","Mexican","Moroccan","Polish","Russian","Spanish","Thai","Tunisian","Turkish","Vietnamese"];

initializeCountries();

function initializeCountries(){
   
    for(var i = 0; i < countriesList.length; i++){
        var countryBtn = document.createElement("button"); 
        countryBtn.classList.add("btn", "btn-info","mb-2", "ml-2"); //TO CHANGE/ADD CLASS TO MAKE IT PRETTY
        countryBtn.setAttribute("data-country",countriesList[i]);
        countryBtn.textContent = countriesList[i];
        countryBtn.addEventListener("click", function(){
            console.log("to page that shows 5 recipes");
            getRecipes(this.getAttribute("data-country"));
        });
        countriesBox.appendChild(countryBtn);
        
    }

}

function getRecipes(country){
    categorySelectionEl.classList.add("hide");
    categoryEl.classList.remove("hide");

    var requestUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?a="+country;
        fetch(requestUrl)
            .then(function(response){
                if(!response.ok){
                    throw new Error("Network error");
                }
                return response.json()
            })
            .then(function(data){
                console.log(data)
                recipeList.innerHTML = "";
                var list = shuffle(data.meals);

                console.log(list);

                for (var i = 0; i < Math.min(list.length,5); i++){
                    var card = document.createElement("div");
                    card.classList.add("card","m-3");
                    var row = document.createElement("div");
                    row.classList.add("row","no-gutters");
                    var colImg = document.createElement("div");
                    colImg.classList.add("col-md-4");
                    var thumbnail = document.createElement("img");
                    thumbnail.classList.add("card-img");
                    thumbnail.setAttribute("alt",list[i].strMeal);
                    thumbnail.setAttribute("src",list[i].strMealThumb);
                    colImg.appendChild(thumbnail);

                    var colTxt = document.createElement("div");
                    colTxt.classList.add("col-md-8");
                    var cardBody = document.createElement("div");
                    cardBody.classList.add("card-body");
                    var cardTitle = document.createElement("h5");
                    cardTitle.classList.add("card-title");
                    cardTitle.textContent = list[i].strMeal;

                    var cardText = document.createElement("p");
                    cardText.classList.add("card-text");
                    cardText.textContent = "Nutrition Preview"
                    // getNutritionPreview(list[i].strMeal);
                    cardBody.appendChild(cardTitle);
                    cardBody.appendChild(cardText);

                    colTxt.appendChild(cardBody);

                    row.appendChild(colImg);
                    row.appendChild(colTxt);

                    card.appendChild(row);

                    // listItem.setAttribute("data-meal",list[i].strMeal);
                    // listItem.textContent = list[i].strMeal;
                    // getRecipe(list[i].strMeal);
                    
                    // listItem.addEventListener("click",function(event){
                    //     console.log(event.target.getAttribute("data-meal"));
                    //     showRecipe(event.target.getAttribute("data-meal"));
                    // });

                    recipeList.appendChild(card);
                }
            })
            .catch(function(err){
                console.log(err)
            });

}

function shuffle(arr){
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function getRecipe(meal){
    var requestUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="+meal;
    fetch(requestUrl)
        .then(function(response){
            console.log(response)
            return response.json()
        })
        .then(function(data){
            console.log(data)

            var recipe = data.meals[0];
            
            food = "";
            
            var i = 1;
            while(recipe["strIngredient"+i]!==""){
                var ingredientItem = document.createElement("li"); 
                var ingredient = recipe["strIngredient"+i];
                var amount = recipe["strMeasure"+i];
                ingredientItem.textContent = amount + " " + ingredient;
                food = food.concat(amount + " " + ingredient + "\n");
                
                i++;
            }
            console.log(recipe.strMeal);
            getNutrition(food);
            
        })
}

function getNutrition (){
        
    var nutritionixUrl = "https://trackapi.nutritionix.com/v2/natural/nutrients"

    console.log(food)
    fetch(nutritionixUrl,{
        method:"POST",
        mode:'cors',
        headers:{
            "x-app-id":"18e9c76c", 
            "x-app-key":"442fbbe0551eec1c295ae3a72082b9b2",
            "x-remote-user-id":0,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "query": food,
            "line_delimited": true
            })
        
    })
    .then(function(response){
        console.log("response2", response);
        return response.json();
    })
    .then(function(data){
        console.log('data',food);   
        convertNutrition(data.foods)
    });
}

function convertNutrition(foods){
    var calories = 0; //208
    var totalFat = 0; //204
    var satFat = 0; //606
    var transFat = 0; //605
    var cholesterol = 0; //601
    var sodium = 0; //307 
    var carbs = 0; //205
    var fiber = 0; //291
    var sugar = 0; //269
    var protein = 0; //203

    for (var i = 0; i < foods.length; i++){
        console.log("ingredient#: ",i)
        calories += (foods[i].nf_calories) ? foods[i].nf_calories : 0;
        totalFat += (foods[i].nf_total_fat) ? foods[i].nf_total_fat : 0;
        satFat += (foods[i].nf_saturated_fat) ? foods[i].nf_saturated_fat : 0;
        
        cholesterol += (foods[i].nf_cholesterol) ? foods[i].nf_cholesterol : 0;
        sodium += (foods[i].nf_sodium) ? foods[i].nf_sodium : 0;
        carbs += (foods[i].nf_total_carbohydrate) ? foods[i].nf_total_carbohydrate : 0;
        fiber += (foods[i].nf_dietary_fiber) ? foods[i].nf_dietary_fiber : 0;
        sugar += (foods[i].nf_sugars) ? foods[i].nf_sugars : 0;
        protein += (foods[i].nf_protein) ? foods[i].nf_protein : 0;

        // transFat += foods[i].full_nutrients.findIndex(function(element){
        //     return element.attr_id === 605;
        // });

    }

    console.log("calories", calories);
    console.log("totalFat", totalFat);
    console.log("satFat", satFat);
    console.log("sodium", sodium);
    console.log("cholesterol", cholesterol);
    console.log("carbs", carbs);
    console.log("fiber", fiber);
    console.log("sugar", sugar);
    console.log("protein", protein)

}