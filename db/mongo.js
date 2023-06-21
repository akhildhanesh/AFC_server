'use strict'

import { MongoClient, ObjectId } from 'mongodb'
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);

const dbName = 'uid';
const db = client.db(dbName)
const collection = db.collection('details')
const admin = db.collection('admin')
const uid_collection = db.collection('uids')

async function main() {
    await client.connect();
    return 'DataBase Connected';
}

main()
    .then(console.log)
    .catch(console.error)

let getUserKey = (uid) => {
    return new Promise(async (resolve, reject) => {
        const result = await collection.find({ uid }).toArray()
        if (result.length === 0) {
            reject('No record found')
        } else {
            resolve(result[0])
        }
    })
}

let getAdmin = () => {
    return new Promise(async (resolve, reject) => {
        const result = await admin.find({ }).toArray()
        if (result.length === 0) {
            reject('No record found')
        } else {
            resolve(result[0])
        }
    })
}

let addUserKey = (data) => {
    return new Promise(async (resolve, reject) => {
        let uid
        try {
            uid = new ObjectId(data.uid)
        } catch {
            return reject('Invaild UID')
        }
        const result = await collection.find({ uid: data.uid }).toArray()

        if (result.length === 0) {
            const result = await uid_collection.find({ _id: uid }).toArray()
            if (result.length === 0) {
                reject('Invaild UID')
            } else {
                let details = await collection.insertOne(data)
                resolve(details)
            }
        } else {
            reject('Already Exists')
        }
    })
}

let generateUID = (timeStamp) => {
    return new Promise(async (resolve, reject) => {
        let details = await uid_collection.insertOne({ timeStamp })
        if (!details.acknowledged) {
            reject()
        }
        resolve(details.insertedId.toString())
    })
}

let updateUserKey = (data) => {
    return new Promise(async (resolve, reject) => {
        let details = await collection.updateOne({ uid: data.uid }, { $set: { ...data } })
        if (details.modifiedCount) {
            resolve(details)
        } else {
            reject()
        }
    })
}

export {
    getUserKey,
    addUserKey,
    getAdmin,
    generateUID,
    updateUserKey
}