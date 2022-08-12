require("dotenv").config();
const { DATABASE_URL } = process.env;
const axios = require("axios");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
  seeds: (req, res) => {
    sequelize
      .query(
        `
        drop table if exists employees cascade;
        drop table if exists clocks;
        drop table if exists emp_schedule cascade;
        drop table if exists admin;
        drop table if exists emp_login;

        create table employees (
            employee_id serial primary key,
            employee_name varchar,
            employee_pass varchar(500) NOT NULL
        );

        create table clocks (
            clocks_id serial primary key,
            clock_name integer NOT NULL REFERENCES employees(employee_id),
            clockin_time timestamp NOT NULL default Current_timestamp,
            clockout_time timestamp default NULL
        );

        create table emp_login (
            emp_login_id serial primary key,
            employee_id integer NOT NULL REFERENCES employees(employee_id),
            login_time timestamp NOT NULL default Current_timestamp
        );

        create table admin (
          admin_id serial primary key,
          employee_id integer NOT NULL REFERENCES employees(employee_id),
          admin_username varchar,
          admin_pass varchar not null
        );

        create table emp_schedule (
            schedule_id serial primary key,
            employee_id integer NOT NULL REFERENCES employees(employee_id),
            Monday varchar (300),
            Tuesday varchar (300),
            Wednessday varchar (300),
            Thursday varchar (300),
            Friday varchar (300)
        );

        insert into employees (employee_name, employee_pass)
        values ('John', 'johnpassCode'),
        ('Mark', 'markpassCode'),
        ('Grace', 'gracepassCode'),
        ('Ryan', 'ryanpassCode');

        insert into emp_schedule (
          employee_id,
          Monday,
          Tuesday,
          Wednessday,
          Thursday,
          Friday
      )
values(3, 'Off', 'PM shift', 'AM shift', 'Pm shift', 'Off'),
(4, 'PM shift', 'PM shift', 'AM shift', 'PM shift', 'AM shift');

insert into admin (employee_id, admin_username, admin_pass)
values (2, 'Mark', 'markpassCode');
        `
    )
      .then(() => {
        console.log("DB seaded!");
        res.sendStatus(200);
      })
      .catch((err) => console.log("error seeding DB", err));
  },

  startClock: (req, res) => {
    const { employee, passCode } = req.body;
    //validate passcode and name
    sequelize
      .query(
        `
        select * from employees where employee_pass = '${passCode}'
        `
      )
      .then((dbRes) => {
        if (dbRes[0].length && dbRes[0][0].employee_name === employee) {
            sequelize.query(`
            select * from clocks where clock_name = ${dbRes[0][0].employee_id}
            and clockout_time is null
            `)
            .then((dbRez) => {
                if(dbRez[0].length > 0){
                    throw `You must clockout first to login`
                }
                    sequelize
            .query(
              `
                insert into clocks (clock_name)
                values (${dbRes[0][0].employee_id})
                returning *;
                `
            )
            .then((dbResponse) => {
              console.log(dbResponse[0]);
              const dataToReturn = [...dbResponse[0]];
              dataToReturn[0].clock_name = employee;
              res.status(200).send(dataToReturn);
              return;
            })
            .catch((err) => console.log(err));
            }).catch((err) => {
                res.status(400).send(err)
            })
        }else {
            return res.status(400).send(`Incorrect username or password`);
        }
        
      })
  },

  checkinDetails: (req, res) => {
    sequelize
      .query(
        `
        select c.clock_name, c.clockin_time AS time, e.employee_id, e.employee_name AS name
        FROM clocks c
        JOIN employees e on e.employee_id = c.clock_name
        where clocks_id = (select MAX(clocks_id) from clocks)
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]));
  },

  endsClocks: (req, res) => {
    const { employee, passCode } = req.body;
    //validate passcode and name
    sequelize
      .query(
        `
        select e.employee_id, e.employee_name, e.employee_pass, c.clock_name, clockout_time  
        from employees e 
        JOIN clocks c on c.clock_name = employee_id
        where employee_pass = '${passCode}'
        `
      )
      .then((dbRes) => {
        if (dbRes[0].length && dbRes[0][0].employee_name === employee) {
          //if success, update clocks table with clockouttime
          sequelize
            .query(
              `
                update clocks
                set clockout_time = current_timestamp
                where clock_name = ${dbRes[0][0].employee_id}
                returning *;
                `
                // and clocks_id = (select MAX(clocks_id) from clocks)
            )
            .then((dbResponse) => {
            //   sequelize.query(`
            //     select * from clocks
            //     where clock_name = ${dbResponse[0][0].clock_name}
            //     and clocks_id = (select MAX(clocks_id) from clocks)
            //      `);
              console.log(dbResponse[0]);
                res.status(200).send('success');
                return;
            })
            .catch((err) => console.log(err));
        }else {
            return res.status(400).send(`error`);
        }
      })
  },

  checkoutDetails: (req, res) => {
    sequelize
      .query(
        `
        select c.clockin_time AS timein, c.clockout_time AS timeout, e.employee_name AS name, e.employee_id
        FROM clocks c
        JOIN employees e on e.employee_id = c.clock_name
        where clockout_time = (select MAX(clockout_time) from clocks)

        `
      )
      .then((dbRes) => {
          let returnedData = dbRes[0][0]
          res.status(200).send([returnedData])
        });
          
  },

  loginValidate: (req, res) => {
    const { userName, password } = req.body;
    //validate passcode and name
    sequelize
      .query(
        `
        select * from admin where admin_pass = '${password}'
        `
      )
      .then((dbRes) => {
        console.log(dbRes[0]);
        if (dbRes[0].length && dbRes[0][0].admin_username === userName) {
          //if success, insert into clocks table
          sequelize
            .query(
              `
                insert into emp_login (employee_id)
                values (${dbRes[0][0].employee_id})
                returning *;
                `
            )
            .then((dbResponse) => {
              console.log(dbResponse[0]);
              const dataToReturn = [...dbResponse[0]];
              dataToReturn[0].employee_id = userName;
              res.status(200).send(dataToReturn);
              return;
            })
            .catch((err) => console.log(err));
        }else {
            return res.status(400).send(`error`);
        }
        
      })
  },

  getNews: async (req, res)=> {
      await axios.get(`https://newsapi.org/v2/top-headlines?q=business&apiKey=${process.env.KEY}`)
      .then(response => {
          let newsData = response.data
          let arr = []
          for (let i=0; i<newsData.articles.length; i++){
              arr.push({
                  title:newsData.articles[i].title,
                  url:newsData.articles[i].url,
                  description:newsData.articles[i].description,
                  urlImg:newsData.articles[i].urlToImage,
              })
          }
          res.status(200).send(arr)
          console.log('success')
      })
        
  },

  getclockTimes: async (req,res) => {
      sequelize.query(`
      select 
        e.employee_name AS name, e.employee_id, MAX(c.clockin_time) AS timein, MAX(c.clockout_time) AS timeout
        FROM employees e
        LEFT JOIN clocks c on e.employee_id = c.clock_name
        group by e.employee_id, e.employee_name
        order by e.employee_id Asc
      `).then((dbRes) => {
          res.status(200).send(dbRes[0])
      }).catch((err) => console.log(err))
  },




  addNewUser: async (req,res)=> {
    const {newUser, newPassCode} = req.body

    sequelize.query(`
    insert into employees (employee_name, employee_pass)
    values ('${newUser}', '${newPassCode}')
    returning *;
    `)
    .then((dbRes) =>{
      console.log(dbRes[0])
      res.status(200).send(dbRes[0])
    }).catch((err) => console.log(err))
  },

  getNewsBySearch: async (req, res)=> {
    const {userSearch} = req.body

    await axios.get(`https://newsapi.org/v2/everything?q=${userSearch}&sortBy=relevancy&apiKey=${process.env.KEY}`)
    .then(response => {
        let newsData = response.data
        let arr = []
        for (let i=0; i<newsData.articles.length; i++){
            arr.push({
                title:newsData.articles[i].title,
                url:newsData.articles[i].url,
                description:newsData.articles[i].description,
                urlImg:newsData.articles[i].urlToImage,
            })
        }
        res.status(200).send(arr)
        console.log('success')
    })
  },


  getSchedules: async (req,res) => {
    sequelize.query(`
    select 
      e.employee_name AS name, e.employee_id, s.monday, s.tuesday, s.wednessday, s.thursday, s.friday
      FROM emp_schedule s
      LEFT JOIN employees e on e.employee_id = s.employee_id
    `).then((dbRes) => {
        res.status(200).send(dbRes[0])
    }).catch((err) => console.log(err))
},

addNewSched: async (req,res)=> {
  const {nameValue, emplID,monValue,tueValue,wedValue,thurValue,friValue } = req.body;

  sequelize
  .query(
    `
    select * from employees where employee_id = '${emplID}'
    `
  )
  .then((dbRes) =>{
    if (dbRes[0].length && dbRes[0][0].employee_name === nameValue){
      
      sequelize.query(`
      insert into emp_schedule (employee_id,
        Monday,
        Tuesday,
        Wednessday,
        Thursday,
        Friday)
      values ('${emplID}', '${monValue}','${tueValue}','${wedValue}','${thurValue}','${friValue}')
      returning *;
      `)
      .then((dbRes) =>{
        console.log(dbRes[0])
        res.status(200).send(dbRes[0])
      }).catch((err) => console.log(err))

    }else {
      return res.status(400).send('error');
  }
  })

},

};