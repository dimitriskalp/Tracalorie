// Storage Controller
const StorageCtrl = (function(){

    //public methods
    return {
        storeItem: function(item){
            let items;
            
            //check if any items
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);
                //Set ls
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                //Get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));

                //push new item
                items.push(item);
                //Re set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemsStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem); 
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1); 
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        } 
    }
})();

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
        //items: [
            //{id:0, name: 'Steak Dinner', calories: 1200},
            //{id:1, name: 'Cookie', calories: 400},
            //{id:2, name: 'Eggs', calories: 300},
        //],
        items: StorageCtrl.getItemsFromStorage(),
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
        deleteItem: function(id){
            // Get the ids
            const ids = data.items.map(function(item){
                return item.id;
            });

            //Get index 
            const index = ids.indexOf(id);

            //Remove item
            data.items.splice(index,1);

        },
        clearAllItems: function(){
            data.items = [];
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
        clearBtn: '.clear-btn',
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
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();

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
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
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

const App = (function(ItemCtrl, StorageCtrl ,UICtrl){
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

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Clear all button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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

            //Store local sotrage
            StorageCtrl.storeItem(newItem);

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

        //Update local storage
        StorageCtrl.updateItemsStorage(updateItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }
    // Delete button event

    const itemDeleteSubmit = function(e){
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from Data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    //Clear items event

    const clearAllItemsClick = function(){
        // Delete all items from data structure
        ItemCtrl.clearAllItems();
        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeItems();

        //clear from local storage
        StorageCtrl.clearItemsFromStorage();

        UICtrl.hideList();
        
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
})(ItemCtrl,StorageCtrl,UICtrl);

//Initialize app

App.init();