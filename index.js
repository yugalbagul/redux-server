import makeStore from './src/store';
import {startServer} from './src/server';
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import  Entries from './models/entries.js';



var app = express();

function initDB() {
  const r = require('rethinkdb')
  const dbOptions = { host: 'localhost', port: 28015 }
  return r.connect(dbOptions)
    .then(conn => {
      console.log('connected')
      const db = r.db('test')

      return db.tableList().run(conn)
        /*.then(tables => {
          if (tables.indexOf('state') !== -1) {
            console.log('deleting existing table state')
            return db.tableDrop('state').run(conn)
          }
        })
        .then(() => {
          return db.tableCreate('state').run(conn)
            .then(() => console.log('created state table'))
        })*/
        .then(() => {
          console.log('returning db objects')
          return {
            r: r,
            conn: conn,
            db: db,
            table: r.db('test').table('state')
          }
        })
    })
    .then(info => {
      console.log('got info', Object.keys(info))
      return info
    })
}

// intilaize the rethinkDB create data and assign it to the disoatcher

initDB()
  .then(function subscribe(state) {
    return state.table.insert({
    	id : 1,
    	entries: require('./entries.json')

    }).run(state.conn).then(() => state)
  }).then(function(state){
  	state.table.get(1).run(state.conn).then(function(result){
  		console.log(result);
  		startServer(app , store);
 	store.dispatch({
  		type: 'SET_ENTRIES',
  		entries: result.entries
	});
	store.dispatch({type: 'NEXT'});
  	})
  	 /*return state.table.get(1).changes().run(state.conn)
      .then(cursor => {
        cursor.each((err, change) => console.log(change.new_val.state))
      })
      .then(() => state)*/
  })
  


export const currentVotings = [];
export  const store = makeStore();
	

// intialzing data from entries.json

 

