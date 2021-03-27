// Storage Controller

//Item Controller

const ItemCtrl = (function(){
    //Item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data structure
    const data = {
        items: [
            //{id:0, name: 'Steak Dinner', calories: 1200},
            //{id:1, name: 'Cookie', calories: 400},
            //{id:2, name: 'Eggs', calories: 300},
        ],
        currentItem: null,
        totalCalories: 0
    }
    //public methods
    return {
        getItems:function(){
            return data.items;
        },
        addItem: function(name,calories){
            let ID;
            //Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id + 1
            }else{
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID,name,calories);

            //Add to items array
            data.items.push(newItem);
            return newItem;

        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(function(item){
                total += item.calories;
            });
            //set total calories in data structure
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();

// UI Controller

const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories: '.total-calories'
    }

    //public methods
    return {
        populateItemsList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}: </strong><em>${item.calories} calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></li>`;
            });  
            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //show the list
            document.querySelector(UISelectors.itemList).style.display='block';
            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add ID
            li.id = `item-${item.id}`
            //add Html
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display='none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        getSelectors: function(){
            return UISelectors;
        }
        
        
    }
    
})();

//App Controller

const App = (function(ItemCtrl,UICtrl){
    //load event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        //Add Item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
    }

    // Item add submit

    const itemAddSubmit = function(e){
        //Get form input from ui controller
        const input = UICtrl.getItemInput();

        //CHeck for name and calories
        if(input.name !== '' && input.calories !== ''){
            //Add item 
            const newItem = ItemCtrl.addItem(input.name,input.calories);

            //Add item top ui list
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //CLear fields
            UICtrl.clearInput();
        }


        e.preventDefault();
    }

    //Public methods
    return {
        init: function(){
            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if any items
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //Populate list with items
                UICtrl.populateItemsList(items);
            }
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();

        }
    }
})(ItemCtrl,UICtrl);

//Initialize app

App.init();