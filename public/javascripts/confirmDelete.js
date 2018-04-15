var deleteButton=document.querySelectorAll('.delete-button');
deleteButton.forEach(function (button) {
    //add event listener
    button.addEventListener('click',function (ev) {
        //show a confirm dialog
        var okToDelete=confirm("Delete task - are you sure?");
        //if no
        if(!okToDelete){
            ev.preventDefault()//prevent the click event propagation
        }
    })
})