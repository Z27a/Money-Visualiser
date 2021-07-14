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
    
// }


function update_progress1() {
    document.getElementById('progress_bar').value = document.getElementById('progress_bar').value + parseInt(document.getElementById('money_amount').value)
    new_percent = ((document.getElementById('progress_bar').value / document.getElementById('progress_bar').max) * 100).toFixed(2)
    document.getElementById('percent').textContent=new_percent
    document.getElementById('progress_num').textContent=parseInt(document.getElementById('progress_num').textContent) + parseInt(document.getElementById('money_amount').value)
}

function update_goal() {
    document.getElementById('progress_bar').max = document.getElementById('goal').value;

    new_percent = ((document.getElementById('progress_bar').value / document.getElementById('progress_bar').max) * 100).toFixed(2)
    document.getElementById('percent').textContent=new_percent;
    document.getElementById('saving_goal').textContent=document.getElementById('progress_bar').max
    
}

function reset1() {
    document.getElementById('percent').textContent=0;
    document.getElementById('saving_goal').textContent=1;
    document.getElementById('progress_bar').value=0
}