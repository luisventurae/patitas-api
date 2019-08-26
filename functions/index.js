const functions = require('firebase-functions');
const firebase = require('firebase-admin')
const config = require('./firebase-config.json')

// Para conectarse a la bd de firebase
firebase.initializeApp({
    credential: firebase.credential.cert(config),
    databaseURL: process.env.DATABASE_URL
})

// Para exportar la
exports.api = functions.https.onRequest((req, res) => {
    res.header('Content-Type', 'application/json')
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')

    const data = firebase.database().ref('/pets') // pets es el nombre de la colección

    if (req.method === 'GET') {
        data.on('value', (snapshot) => { // Obtiene los valores de la bd osea los snapshot
            const parseData = Object.keys(snapshot.val() || {}) // Lo parsea omanda un objeto vacío
                .map(key => snapshot.val()[key]) // Devuelve cada uno de los snapshot con un formato y una llave

            res.json(parseData) // Responde la data en formato json
        })
    }
})