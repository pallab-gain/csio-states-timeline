const express = require('express');
const app = express();
const Parser = require('./parser/parser');
const parser = new Parser();

app.use(express.static('dist'));
app.get('/api/data', async (req, res) => {
	let data = await parser.parseStates();
	res.send(data);
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
