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
        getItemById: function(id){
            let found = null;
            // Loop through the items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            //Calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories: '.total-calories',
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
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
                }
            });
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display='none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display='none';
            document.querySelector(UISelectors.deleteBtn).style.display='none';
            document.querySelector(UISelectors.backBtn).style.display='none';
            document.querySelector(UISelectors.addBtn).style.display='inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display='inline';
            document.querySelector(UISelectors.deleteBtn).style.display='inline';
            document.querySelector(UISelectors.backBtn).style.display='inline';
            document.querySelector(UISelectors.addBtn).style.display='none';
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
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
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
    //Click edit item
    const itemEditClick = function(e){
        //we search the click by the classname of the element
        if(e.target.classList.contains('edit-item')){
            //Get the list item id (item-0)
            //We check about the id of li element which 2 parent node above
            const listId = e.target.parentNode.parentNode.id;

            //break into an array 
            const listIdArr = listId.split('-');
            //Get the actual id
            const id = parseInt(listIdArr[1]);
            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    // Update item submit

    const itemUpdateSubmit = function(e){
        // Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updateItem = ItemCtrl.updateItem(input.name,input.calories);

        // Update UI 
        UICtrl.updateListItem(updateItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Public methods
    return {
        init: function(){
            //Clear edit state
            UICtrl.clearEditState();
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