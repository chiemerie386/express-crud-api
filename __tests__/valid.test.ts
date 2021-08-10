
const request =  require('supertest')
//import { describe } from 'yargs'
const app = require('../lib/app')
const path = require('path')
const dbPath = path.resolve(".", "./lib/db.json");
const database = require(dbPath)
 
describe('test for get method', ()=>{
        test('test for staus code for invalid path', async ()=>{
            const data = await request(app).get('/decagon/test/gh')
            expect(data.statusCode).toBe(404)
        });
        test('Test for staus code for valid path', async ()=>{
            const data = await request(app).get('/decagon/test/')
            expect(data.statusCode).toBe(200)
        })
        test('Test for staus code for invalid/valid iD', async ()=>{
           
            const data = await request(app).get('/decagon/test/7')
            const index = database.find((cv:{id:number})=> cv.id === 7)
            if(index){
                expect(data.statusCode).toBe(200)
            }else{
                expect(data.statusCode).toBe(404) 
            }
        })
        test('test for body content', async ()=>{
            const index = database.find((cv:{id:number})=> cv.id === 7)
            const data = await request(app).get('/decagon/test/7')
            if(index){
                expect(data.body).toEqual(index)
            }else{
                expect(data.body).toBe('User not found'); 
            }
        })
})

describe('test for post method', ()=>{
    test('test for staus code for invalid path', async ()=>{
        const data = await request(app).post('/decagon/test/gh')
        expect(data.statusCode).toBe(404)
    });
    test('Test for staus code for valid path', async ()=>{
        const data = await request(app).post('/decagon/test/')
        expect(data.statusCode).toBe(200)
    })
   
    test('test for body content', async ()=>{
        const data = await request(app).post('/decagon/test/').send({
                    "organization": "node ninja",
                    "products": ["developers", "pizza"],
                    "marketValue": "90%",
                    "address": "sangotedo",
                    "ceo": "cn",
                    "country": "Taiwan",
                    "noOfEmployees": 2,
                    "employees": ["james bond","jackie chan" ]
        })
        const index = database.find((cv:{id:number})=> cv.id === 7)
        expect(data.body).toEqual(database[database.length - 1])
    })
})


describe('test for put method', ()=>{
    test('test for staus code for invalid path', async ()=>{
        const data = await request(app).put('/decagon/test/gh')
        expect(data.statusCode).toBe(404)
    });
    test('Test for staus code for valid path', async ()=>{
        const index = database.find((cv:{id:number})=> cv.id === 2)
        const data = await request(app).put('/decagon/test/2')
        if(!index){
            expect(data.statusCode).toBe(404)
            }else{
                expect(data.statusCode).toBe(200) 
            }
        // expect(data.statusCode).toBe(200)
    })
   
    test('test for body content', async ()=>{
        const index = database.find((cv:{id:number})=> cv.id === 2)
        const data = await request(app).put('/decagon/test/2').send({
                    "organization": "node ninja",
                    "products": ["developers", "pizza"],
                    "marketValue": "90%",
                    "address": "sangotedo",
                    "ceo": "cn",
                    "country": "Taiwan",
                    "noOfEmployees": 2,
                    "employees": ["james bond","jackie chan" ]
        })
        //const index = database.find(cv=> cv.id === 2)
        if(index){
            expect(index).toHaveProperty("organization", "node ninja")
        }else{
            expect(data.statusCode).toBe(404)
        }
        
    })
})

describe('test for delete method', ()=>{
    test('test for staus code for invalid path', async ()=>{
        const data = await request(app).delete('/decagon/test/gh')
        expect(data.statusCode).toBe(404)
    });
    test('Test for staus code for valid path', async ()=>{
        const index = database.find((cv:{id:number})=> cv.id === 2)
        const data = await request(app).delete('/decagon/test/2')
        // console.log(index);
        // console.log(data.statusCode);
        if(!index){
        expect(data.statusCode).toBe(404)
        }else{
            expect(data.statusCode).toBe(200) 
        }
    })
   
    test('test for body content', async ()=>{
        const index = database.find((cv:{id:number})=> cv.id === 2)
        
        const data = await request(app).delete('/decagon/test/2')
        //console.log(data.body);
        if(!index){
            expect(data.text).toBe('User not found');
        }else{
            expect(data.text).toBe('User Deleted');
        }
    })
})