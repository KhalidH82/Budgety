// Budget Controller

let budgetController = (function() {


})();

// UI Controller

let UIController = (function() {


})();

// Global App Controller

let controller = (function(budgetCtrl, UICtrl) {

    let ctrlAddItem = function() {

        // 1. Get the field input data

        // 2. Add item to budget controller

        // 3. Add the item to user interface

        // 4. Calculate the budget

        // 5. Display the budget on the UI 
        console.log('It works!')
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        if (event.keycode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);