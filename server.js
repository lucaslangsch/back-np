const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: process.env.MP_TOKEN,
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../../client/html-js"));
app.use(cors());
// app.get("/", function (req, res) {
// 	res.status(200).sendFile("index.html");
// });

app.get("/", function (req, res) {
	res.send('Hello World!')
});

app.post("/create_preference", (req, res) => {
  const list = []

  req.body.forEach((p) => {
    const item = {
      title: p.description,
      description:  p.description,
      unit_price: Number(p.price),
      quantity: Number(p.quantity),
    }
    list.push(item);
  })

	let preference = {
		items: list,
		back_urls: {
			"success": "http://localhost:8080/feedback",
			"failure": "http://localhost:8080/feedback",
			"pending": "http://localhost:8080/feedback"
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function (req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.listen(8080, () => {
	console.log(`The server is now running on Port 8080`);
});
