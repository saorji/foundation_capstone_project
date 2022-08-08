const menuToggle = document.querySelector('.toggle')
const showcase = document.querySelector('.showcase')
const search = document.getElementById('searchBtn')

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active')
    showcase.classList.toggle('active')
})

function handleSearch() {
    const input = document.getElementById('textfield')

    let body = {
        inputed: input.value,
    }

    axios.post('http://localhost:4007/news', body)
    .then((res) => {
        console.log(res.data)
       alert('sucess')
    })
    .catch(err =>{
        console.log(err)
        alert(`err`) 
    })

}

function takeHome() {
    window.location.replace("./index.html");
}

search.addEventListener('click', handleSearch)