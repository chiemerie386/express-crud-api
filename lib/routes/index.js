"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const path = require('path');
const dbPath = path.resolve(".", "./lib/db.json");
const database = require(dbPath);
const fs = require('fs');
const fspromises = require('fs').promises;
/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('welcomedata');
});
router.get('/decagon/test', (req, res, next) => {
    console.log("get is working...: ", dbPath);
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("kayode: ", data);
        const dataArr = JSON.parse(data);
        console.log(dataArr);
        res.status(200).send(dataArr);
    });
});
router.get('/decagon/test/:id', (req, res, next) => {
    const index = database.find((cv) => cv.id === +(req.params.id));
    const indexof = database.findIndex((cv) => cv.id === +(req.params.id));
    if (!index) {
        res.status(404).send('User not found');
    }
    else {
        res.status(200).send(database[indexof]);
    }
});
router.post('/decagon/test', async (req, res, next) => {
    const id = (database.length > 0) ? ((database[database.length - 1].id) + 1) : 1;
    const { organization, products, marketValue, address, ceo, country, noOfEmployees, employees } = req.body;
    const newdata = {
        organization: organization || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        products: products || [],
        marketValue: marketValue || '',
        address: address || '',
        ceo: ceo || '',
        country: country || '',
        id: id,
        noOfEmployees: noOfEmployees || 0,
        employees: employees || []
    };
    database.push(newdata);
    console.log(database);
    // let jsonFile = JSON.stringify(database,null,2)
    // let writestream = fs.createWriteStream('../database.json')
    // writestream.write(jsonFile)
    // res.send(database)
    let data;
    try {
        data = await fspromises.writeFile(dbPath, JSON.stringify(database, null, ' '), (err) => {
            if (err)
                throw err;
            console.log('Saved!');
        });
    }
    catch (error) {
        console.log(error);
    }
    res.status(200).send(newdata);
});
router.put('/decagon/test/:id', async (req, res, next) => {
    const index = database.find((cv) => cv.id === +(req.params.id));
    const indexof = database.findIndex((cv) => cv.id === +(req.params.id));
    if (!index) {
        res.status(404).send('User not found');
    }
    else {
        const { organization, createdAt, products, marketValue, address, ceo, country, id, noOfEmployees, employees } = database[indexof];
        const newdata = {
            organization: req.body.organization || organization,
            createdAt: createdAt,
            updatedAt: new Date().toISOString(),
            products: req.body.products || products,
            marketValue: req.body.marketValue || marketValue,
            address: req.body.address || address,
            ceo: req.body.ceo || ceo,
            country: req.body.country || country,
            id: id,
            noOfEmployees: req.body.noOfEmployees || noOfEmployees,
            employees: req.body.employees || employees
        };
        database[indexof] = newdata;
        let data;
        try {
            data = await fspromises.writeFile(dbPath, JSON.stringify(database, null, ' '), (error) => {
                if (error)
                    throw error;
                console.log('Saved!');
            });
        }
        catch (error) {
            console.log(error);
        }
        res.status(200).send(newdata);
    }
});
router.delete('/decagon/test/:id', async (req, res, next) => {
    console.log('delete is working ' + req.params.id);
    const index = database.find((cv) => cv.id === +(req.params.id));
    //const indexof = database.findIndex(cv=> cv.id === +(req.params.id))
    //console.log(index);
    console.log(index);
    if (!index) {
        console.log('kl');
        res.status(404).send('User not found');
    }
    else {
        console.log('df');
        const newdatabase = database.filter((data) => data.id !== (+req.params.id));
        //console.log(newdatabase)
        await fspromises.writeFile(dbPath, JSON.stringify(newdatabase, null, ' '), (err) => {
            if (err)
                throw err;
            console.log('deleted!!');
        });
        res.status(200).send('User Deleted hjubn');
    }
});
module.exports = router;
