// Budget Controller

let budgetController = (function() {

    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum = sum + cur.value
        });
        data.totals[type] = sum;
    }


    let data = {

        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;

            // Create new ID 

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }


            // Push it into data structure
            data.allItems[type].push(newItem)

            // Return the new elements
            return newItem;
        },

        calculateBudget: function() {

            // Calculate total income and expense
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget income- expense
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate percentage of income we spent
            if (data.totals.inc > 0) {

                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            } else {
                data.percentage = -1;

            }



        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage

            };

        },

        testing: function() {
            console.log(data);
        }
    };

})();

// UI Controller

let UIController = (function() {

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'

    };


    return {
        getInput: function() {
            return {

                type: document.querySelector(DOMstrings.inputType).value, // Will be either Inc or Exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };

        },

        addListItem: function(obj, type) {
            let html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = "<div class = 'item clearfix' id= 'income-%id%'><div class= 'item__description'>%description%</div><div class= 'right clearfix'><div class= 'item__value'>%value%</div><div class = 'item__delete'><button class= 'item__delete--btn'><i class = 'ion-ios-close-outline'></i></button></div></div></div>"

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class = "item clearfix" id = "expense-%id%"><div class="item__description">%description%</div><div class= "right clearfix"><div class= "item__value">%value%</div><div class= "item__percentage">%21%</div><div class= "item__delete"><button class= "item__delete--btn" ><i class= "ion-ios-close-outline"></i></button></div></div></div>'

            }


            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },

        clearFields: function() {
            let fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = '';

                fieldsArr[0].focus();

            })
        },

        getDOMstrings: function() {
            return DOMstrings
        }

    };

})();

// Global App Controller

let controller = (function(budgetCtrl, UICtrl) {

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    let updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Returns the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        console.log(budget)

    }



    let ctrlAddItem = function() {
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {


            // 2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to user interface
            UIController.addListItem(newItem, input.type);

            // 4. Clear the fileds
            UIController.clearFields();

            // 5. Calculate and Update Budget
            updateBudget();

        }

    };

    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    };


})(budgetController, UIController);

controller.init();