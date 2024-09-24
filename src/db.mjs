const {MongoClient} = require ('mongodb')

let dbConnection

module.export = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:34007/share2teach')
            .then((client) => {
                dbConnection = client.db()
                    return cb()
                
            })
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection
}