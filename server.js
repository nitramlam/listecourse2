const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


async function main() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://nitramlam:456123Fx37!@listecourses.qkghn.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true";
  const client = new MongoClient(uri);

  try {
    // Connexion au client
    await client.connect();
    console.log("Connexion réussie à MongoDB");

    const database = client.db('shopping_db');
    const collection = database.collection('shopping_list');

   
    app.get('/', async (req, res) => {
      const itemsEnStock = await collection.find({ quantity: { $gt: 0 } }).toArray();
      const itemsAAcheter = await collection.find({ quantity: { $lte: 0 } }).toArray();
      res.render('index', { itemsEnStock, itemsAAcheter });
    });

    app.post('/add', async (req, res) => {
      const newItem = {
        item: req.body.item,
        quantity: parseInt(req.body.quantity),
        price: parseFloat(req.body.price),
        category: req.body.category
      };
      await collection.insertOne(newItem);
      res.redirect('/');
    });

   
    app.post('/increase/:id', async (req, res) => {
      const itemId = req.params.id;
      await collection.updateOne(
        { _id: new ObjectId(itemId) },
        { $inc: { quantity: 1 } }
      );
      res.redirect('/');
    });

   
    app.post('/decrease/:id', async (req, res) => {
      const itemId = req.params.id;
      await collection.updateOne(
        { _id: new ObjectId(itemId) },
        { $inc: { quantity: -1 } }
      );
      res.redirect('/');
    });


    app.post('/delete/:id', async (req, res) => {
      const itemId = req.params.id;
      await collection.deleteOne({ _id: new ObjectId(itemId) });
      res.redirect('/');
    });

  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});