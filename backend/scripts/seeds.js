//TODO: seeds script should come here, so we'll be able to put some data in our local env

const mongoose = require("mongoose");

require('../models/User');
require('../models/Item');
require('../models/Comment');


var User = mongoose.model('User');
var Item = mongoose.model('Item');
var Comment = mongoose.model('Comment');

// Connect to mongodb
if (process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI);
} else {
    console.warn('Missing MONGODB URI in the env');
}

let userId;
let itemId;

// function makeid(length) {
//     let result = '';
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const charactersLength = characters.length;
//     let counter = 0;
//     while (counter < length) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//       counter += 1;
//     }
//     return result;
// }
// var username = "Fakeuser" + makeid(6);


async function seedDatabase() {

    const users = Array.from(Array(100)).map((_item, i) => ({
        username : 'Newfakeusername'+i,
        email: 'fakename'+i+'@anytink.com',
        bio: 'Test',
        image: 'https://picsum.photos/200',
        role: 'user',
        favorites: [],
        following: [],
    }))

    for (let user of users ){
        const u = new User(user);
        
        const dbItem = await u.save();

        if (!userId) {
            userId = dbItem._id;
        }    
    }

    const items = Array.from(Array(100)).map((_item, i) => ({
        slug: 'fakeitem'+i,
        title: 'Fake Item'+i,
        description: 'Test Description',
        image: 'https://picsum.photos/200',
        comments: [],
        tag: ['testTag1','TestTag2'],
        seller: userId
    }))

    for (let item of items) {
        const it = new Item(item);

        const dbItem = await it.save();
        
        if (!itemId) {
            itemId = dbItem._id;
        }
    }

    const comments = Array.from(Array(100)).map((_item, i) => ({
        body: 'This is a test body',
        seller: userId,
        item: itemId
    }))

    for (let comment of comments) {
        const c = new Comment(comment);

        const dbItem = await c.save();
    }

}

seedDatabase().then(()=>{
    process.exit();
}).catch((err) => {
    console.log(err);
    process.exit();
})