const clockTimes = document.getElementById("clockin-tables")
const popup = document.getElementById('design')
const loginBtn = document.getElementById('popbtn')
const nameInput = document.getElementById('input-name')
const passInput = document.getElementById('input-pass')
const schHolder = document.getElementById("sched-tables")
const popups = document.getElementById('designs')
const schedBtn = document.querySelector('.input-groupp')


async function empClockTimes() {
   axios.get('http://localhost:4007/empTimes')
    .then(res => {
        console.log(res.data)
        let show = res.data;
        for(let i=0; i<show.length;i++){
            let disbody = ''

            disbody = disbody + `<tr>
                                <td>${show[i].name}</td>
                                <td>${show[i].employee_id}</td>
                                <td>${show[i].timein}</td>
                                <td>${show[i].timeout}</td>
                                </tr>`

        clockTimes.innerHTML += disbody
        }
})
}

empClockTimes();

function openPopup(){
    popup.classList.add("open-popup");
}

function closePopup(){
    popup.classList.remove("open-popup");
}


function openPopupTwo(){
    popups.classList.add("open-popups");
}

function closePopups(){
    popups.classList.remove("open-popups");
}

function handleAddUser(s) {
    s.preventDefault()

    if(nameInput.value < 1) {
        return alert(`Username field cannot be empty`)
    }else if (passInput.value < 1) {
        return alert(`You must create a password for the new user`)
    }

    let body = {
        newUser: nameInput.value,
        newPassCode: passInput.value,
    }

    axios.post('http://localhost:4007/newUser', body)
    .then((res) => {
        alert('New user add successfully')
        nameInput.value = ''
        passInput.value = ''
        return
    })
    .catch(err =>{
        console.log(err)
        return alert(err) 
    })
}

loginBtn.addEventListener('click', handleAddUser)



async function handleSchedule() {
    axios.get('http://localhost:4007/schedules')
     .then(res => {
         console.log(res.data)
         let shows = res.data;
         for(let i=0; i<shows.length;i++){
             let disbody = ''
 
             disbody = disbody + `<tr>
                                 <td>${shows[i].name}</td>
                                 <td>${shows[i].employee_id}</td>
                                 <td>${shows[i].monday}</td>
                                 <td>${shows[i].tuesday}</td>
                                 <td>${shows[i].wednessday}</td>
                                 <td>${shows[i].thursday}</td>
                                 <td>${shows[i].friday}</td>
                                 </tr>`
 
        schHolder.innerHTML += disbody
         }
 })
 }
 handleSchedule()



 function handleAddSched(e) {
    e.preventDefault()

    const nameImp = document.getElementById('name-inpt')
    const empImp = document.getElementById('input_id')
    const monImp = document.getElementById('mon_input_id')
    const tueImp = document.getElementById('tue_input_id')
    const wedImp = document.getElementById('wed_input_id')
    const thurImp = document.getElementById('thur_input_id')
    const friImp = document.getElementById('fri_input_id')

    if(nameImp.value < 1) {
        return alert(`Name field cannot be empty`)
    }else if (empImp.value < 1) {
        return alert(`Staff ID is needed to add schedule`)
    }

    let body = {
        nameValue: nameImp.value,
        emplID: empImp.value,
        monValue: monImp.value,
        tueValue: tueImp.value,
        wedValue: wedImp.value,
        thurValue: thurImp.value,
        friValue: friImp.value
    }

    axios.post('http://localhost:4007/newsched', body)
    .then((res) => {
        alert('New schedule added successfully')
        nameImp.value = ''
        empImp.value = ''
        monImp.value = ''
        tueImp.value = ''
        wedImp.value = ''
        thurImp.value = ''
        friImp.value = ''
        return
    })
    .catch(err =>{
        console.log(err)
        return alert(`Employee name or employee ID mismatch or Not exist`) 
    })
}

schedBtn.addEventListener('submit',handleAddSched)