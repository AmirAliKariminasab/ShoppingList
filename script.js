const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Displaying items from local storage 
function displayItem() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

// This function runs when Add item button has been clicked
function onAddItemSubmit(e) {
    // Prevents page  action(reload)
    e.preventDefault();

    // checks if the input has a value or not
    const newItem = itemInput.value;
    if (newItem === '') {
        alert('Please Add An Item');
        return;
    }

    // check for edit mode (this if will remove the item and replace it with the new one)
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');  // Finds element with class of edit-mode (This will get added to button element when setItemToEdit function runs)
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('That Item Already Exists!');
            return;
        }
    }

    // Create Item DOM element
    addItemToDOM(newItem);
    // Add Item to Local Storage
    addItemToStorage(newItem);
    // Checking if there are any items in the list to choose to display clear button and filter form
    checkUI();
    itemInput.value = '';
}

function addItemToDOM(item) {
    // Create List Item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    // Add li to DOM
    itemList.appendChild(li);

}

//  button for X
function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa-solid fa-xmark');

    button.appendChild(icon);
    return button;
}

// creates X icon for the item button
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

// Adding the items to localstorage
function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    // Add new item to Array
    itemsFromStorage.push(item);
    // convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

// Checks if there are any items in local storage or not and if they were it will return it as an array
function getItemsFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

// Deletes an item
function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

// Showing that if item exists in local storage
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

// Setting an item for edite
function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}

// removes item from DOM and Local storage
function removeItem(item) {
    if (confirm('Are You Sure')) {
        // Remove item from DOM
        item.remove();

        // Remove Item From Storage
        removeItemFromStorage(item.textContent);
        checkUI();
    }
}

// removes item from local storage
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Clear All Button
function clearItems() {
    if (confirm('Are You Sure?')) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        }

        // Clear from local storage
        localStorage.removeItem('items');
        // localStorage.clear();   Not That good for big projects (Clears the local storage fully )
    }
    checkUI();
}

// Searching for item
function FilterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Checking if there are any items in the list to choose to display clear button and filter form
function checkUI() {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

// Initialize App
function init() {
    // Event Listener
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', FilterItems);
    document.addEventListener('DOMContentLoaded', displayItem)
    checkUI();
}

init();

// LocalStorage Sample
// localStorage.setItem('name', 'amirali');
// console.log(localStorage.getItem('name'));
// localStorage.removeItem('name');
// localStorage.clear();