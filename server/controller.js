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
        drop table if exists schedule_time;
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

        create table emp_schedule (
            schedule_id serial primary key,
            employee_id integer NOT NULL REFERENCES employees(employee_id)
        );

        create table schedule_time (
            schedule_id integer NOT NULL REFERENCES emp_schedule(schedule_id),
            schedule_checkin varchar(255),
            schedule_checkout varchar(255)
        );

        insert into employees (employee_name, employee_pass)
        values ('John', 'johnpassCode'),
        ('Mark', 'markpassCode'),
        ('Grace', 'gracepassCode'),
        ('Ryan', 'ryanpassCode')
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
        console.log(dbRes[0]);
        if (dbRes[0].length && dbRes[0][0].employee_name === employee) {
          //if success, insert into clocks table
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
        }else {
            return res.status(400).send(`error`);
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
        select * from employees where employee_pass = '${passCode}'
        `
      )
      .then((dbRes) => {
        console.log(dbRes[0]);
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
                res.status(200).send(dbResponse[0]);
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
        select c.clockin_time AS timein, e.employee_id, c.clockout_time AS timeout, e.employee_name AS name
        FROM clocks c
        JOIN employees e on e.employee_id = c.clock_name
        where clockout_time = (select MAX(clockout_time) from clocks)
        and clocks_id = (select MAX(clocks_id) from clocks)
        `
      )
      .then((dbRes) => {
          let returnedData = dbRes[0]
          res.status(200).send(returnedData)
        });
          
        // console.log(dbRes[0][0])
  },

  loginValidate: (req, res) => {
    const { userName, password } = req.body;
    //validate passcode and name
    sequelize
      .query(
        `
        select * from employees where employee_pass = '${password}'
        `
      )
      .then((dbRes) => {
        console.log(dbRes[0]);
        if (dbRes[0].length && dbRes[0][0].employee_name === userName) {
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
      const {inputed} = req.body
      console.log(inputed)
      await axios.get(`https://newsapi.org/v2/everything?q=${inputed}&sortBy=relevancy&apiKey=${process.env.KEY}`)
      .then(response => {
          let newsData = response.data
          res.status(200).send(newsData.articles[(0,1,2,3,4)])
          console.log('success')})
  }

};