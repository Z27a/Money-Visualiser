// const nav_toggle = document.querySelector(".nav-toggle")
// const navbar = document.querySelector(".navbar")

// nav_toggle.addEventListener("change", navbar.style.display = "block");

// document.querySelector('.navbar').style.color = "green";

// var goal = document.getElementById('goal').value || ""
// console.log(new_progress);

// function update_progress() {
//     var i = 0;
//     while (i < parseInt(document.getElementById('money_amount').value)) {    
//         setInterval(() => {
//             document.getElementById('progress_bar').value = document.getElementById('progress_bar').value + 1
//             i++;
//             console.log(document.getElementById('progress_bar').value);
//         }, 100)
//     }
//     // document.getElementById('progress_bar').value = document.getElementById('progress_bar').value + parseInt(document.getElementById('money_amount').value)
// }


function test() {
    document.getElementById('money_amount').value = '10';
}

function update_progress() {
    for (var i=0; i < parseInt(document.getElementById('money_amount').value); i++) {
        setTimeout(() => {document.getElementById('progress_bar').value = document.getElementById('progress_bar').value + 1;}, 2000);
    }
}