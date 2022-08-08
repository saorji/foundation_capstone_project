const nameInput = document.getElementById('name-input')
const passcodeInput = document.getElementById('passcode-input')
const detailsDisplay = document.getElementById('clockin-details')
const clockin = document.getElementById('clockin')
const clockout = document.getElementById('clockout')
const set =document.getElementById('time')
const menuToggle = document.querySelector('.toggle')
const showcase = document.querySelector('.showcase')
const popup = document.getElementById('design')
const loginBtn = document.getElementById('popbtn')

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active')
    showcase.classList.toggle('active')
})

function openPopup(){
    popup.classList.add("open-popup");
    showcase.classList.toggle('active')
    menuToggle.classList.toggle('active')
}

function closePopup(){
    popup.classList.remove("open-popup");
}

function timer () {
    var datetime = new Date().toLocaleString();
    var formattedString = datetime.replace(", ", " - ");
    set.textContent = formattedString
}
setInterval(timer,1000)

function handlelogin() {
const loginUser = document.getElementById('input-name')
const loginPass = document.getElementById('input-pass')

if(loginUser.value < 1) {
    return alert(`Username cannot be empty`)
}else if (loginPass.value < 1) {
    return alert(`Password cannot be empty`)
}

let body = {
    userName: loginUser.value,
    password: loginPass.value,
}

axios.post('http://localhost:4007/login', body)
.then((res) => {
    console.log(res.data)
    window.location.replace("./home.html");
    // alert(`logged in`)
})
.catch(err =>{
    console.log(err)
    alert(`Incorrect name or passcode, try again`) 
})

}

function handleClockin(s) {
    s.preventDefault()

    if(nameInput.value < 1) {
        alert(`You must enter your Name to clock-in`)
    }else if (passcodeInput.value < 1) {
        alert(`You must enter a your Passcode to clock-in`)
    }

    let body = {
        employee: nameInput.value,
        passCode: passcodeInput.value,
    }

    axios.post('http://localhost:4007/clock', body)
    .then((res) => {
        console.log(res.data)
        clockinDetails()
    })
    .catch(err =>{
        console.log(err)
        alert(`Incorrect name or passcode, try again`) 
    })
    nameInput.value = ''
    passcodeInput.value = ''
}

function clockinDetails() {
    detailsDisplay.innerHTML = ''
   
    axios.get('http://localhost:4007/details')
    .then(res => {
        res.data.forEach(elem => {
            let displayCard = `<div class="entered-name">
            <h3>Name: ${elem.name}</h3>
            <h3>Clock-in: ${elem.time}</h3>
            </div>`

            detailsDisplay.innerHTML += displayCard
            
        });
    })
    revealBody()
}

function handleClockout(e) {
    e.preventDefault()

    if(nameInput.value < 1) {
        alert(`You must enter your name to clock-out`)
    }else if (passcodeInput.value < 1) {
        alert(`You must enter a your Passcode to clock-out`)
    }

    let body = {
        employee: nameInput.value,
        passCode: passcodeInput.value,
    }

    axios.post('http://localhost:4007/ends', body)
    .then((res) => {
        console.log(res.data)
        clockoutDetails()
    })
    .catch(err =>{
        console.log(err)
        alert(`Incorrect name or passcode, try again`) 
    })
    nameInput.value = ''
    passcodeInput.value = ''
}


function clockoutDetails() {
    detailsDisplay.innerHTML = ''

    axios.get('http://localhost:4007/out')
    .then(res => {
        res.data.forEach(elem => {
            let displayCard = `<div class="entered-name">
            <h3 id="out">You have been clocked out ${elem.name}!
            <h3>You clocked in at: ${elem.timein}</h3>
            <h3>Clock-out: ${elem.timeout}
            <h3>Today's Schedule: ${elem.schedule}
            </div>`

            detailsDisplay.innerHTML += displayCard
        });
    })
    revealBody()
}

clockin.addEventListener('click', handleClockin)
clockout.addEventListener('click', handleClockout)
loginBtn.addEventListener('click', handlelogin)


function revealBody() {
    detailsDisplay.classList.remove('hide')
    setTimeout(() => {
        detailsDisplay.classList.add('hide')
    }, 9000);
}