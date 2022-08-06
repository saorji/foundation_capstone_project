require("dotenv").config();
const { DATABASE_URL } = process.env;
const { axios } = require("axios");
const Sequelize = require("sequelize");
const {NEWS_API} = process.env;


  module.exports = {
    getNews: async (req,res) => {
        // const {search} = req.query
       await axios.get(`https://newsapi.org/v2/top-headlines?q=market&apiKey=${process.env.NEWS_API}`)
       .then(response => {
           newsData=response.data
           console.log(newsData)
       })
       res.status(200).send(newsData)
    },
    
      }

// let users = [
//     {
//         username: 'today',
//         pass: 'saturday'
//     },
//     {
//         username: 'dee',
//         pass: 'sam'
//     }
// ]

// module.exports = {
//     checkLoginDetails: (req, res) => {
//         const {userEntered, passEntred} = req.body
//         for (let i=0; i<users.length; i++)
//             if(userEntered === users[i].username && passEntred === users[i].pass){
//                 res.status(200).send(`logged-in`)
//             }else {
//                 res.status(400).send(`user not found`)
//             }
//     },
// }