const searchResult = document.getElementById('newwsss')
const searchInp = document.getElementById('searchInp')
const userSearchBtnn = document.getElementById('searchBtn')
const searchInpMain = document.getElementById('searchInpp')
const mainSearchBtnn = document.getElementById('mainBtnSearch')


async function getNewsBySearch(){
    searchResult.innerHTML = ''
    if(searchInp.value < 1) {
        return alert(`Search field cannot be empty`)
        }
        let body = {
        userSearch: searchInp.value,
        }

    axios.post('http://localhost:4007/newsBySearch', body)
    .then(res =>{
        let display = res.data;
        for (let i=0; i<6;i++){
            let result = display[i]
            let userSearchResult = ''
            userSearchResult = userSearchResult + `
                                <div class="boxx-container">
                                <h2 class="title">${result.title}</h2>\
                                <img class="imgedit" src="${result.urlImg}"/>\
                                <h3 class="discription">${result.description}</h3>\
                                <h4 class="url"><a href="${result.url}">Read More</a></h4>\
                                </div>
                                `
        searchResult.innerHTML += userSearchResult
        }
    })
}

userSearchBtnn.addEventListener('click', getNewsBySearch)


async function getNewsBySearchTwo(){
    if(searchInpMain.value < 1) {
        return alert(`Search field cannot be empty`)
        }
        window.location.replace("./search.html")
        searchResult.innerHTML = ''
        let body = {
        userSearch: searchInpMain.value,
        }

    axios.post('http://localhost:4007/newsBySearch', body)
    .then(res =>{
        let display = res.data;
        for (let i=0; i<6;i++){
            let result = display[i]
            let userSearchResult = ''
            userSearchResult = userSearchResult + `
                                <div class="boxx-container">
                                <h2 class="title">${result.title}</h2>\
                                <img class="imgedit" src="${result.urlImg}"/>\
                                <h3 class="discription">${result.description}</h3>\
                                <h4 class="url"><a href="${result.url}">Read More</a></h4>\
                                </div>
                                `
        searchResult.innerHTML += userSearchResult
        }
    })
}

mainSearchBtnn.addEventListener('click', getNewsBySearchTwo)