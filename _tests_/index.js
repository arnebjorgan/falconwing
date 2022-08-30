const falk = require('../dist/index.js');
const dotenv = require('dotenv');
dotenv.config();

const databaseType = process.argv[2];

const app = falk.default();

if(databaseType === 'memory') {
    app.database.memory();
}
else if(databaseType === 'mongodb') {
    app.database.mongodb(process.env.MONGODB_CONNECTIONSTRING);
}

app.model('cars', {
    brand: falk.fieldType.string({ required: true }),
    horsePower: falk.fieldType.number(),
    electric: falk.fieldType.boolean(),
    registered_date: falk.fieldType.datetime(),
    bodywork: falk.fieldType.string({ validator: val => ['suv', 'sedan', 'station_wagon'].includes(val) }),
},{
    expose: true,
});

app.model('brands', {
    name: falk.fieldType.string(),
    created_at: falk.fieldType.autoCreatedAt(),
    updated_at: falk.fieldType.autoUpdatedAt(),
},{
    expose: true,
});

app.model('not-exposed', {
    foo: falk.fieldType.string(),
});

app.model('allow-bar-and-read', {
    foo: falk.fieldType.string(),
}, {
    expose: true,
    allow: (data, operation) => {
        if(data.foo === 'bar') return true;
        else if(operation.read) return true;
        else return false;
    },
});

app.endpoint.get('/manual-endpoint', (req, res, next) => {
    res.send('ok');
});

app.endpoint.post('/manual-endpoint', (req, res, next) => {
    res.send('ok');
});

app.endpoint.put('/manual-endpoint', (req, res, next) => {
    res.send('ok');
});

app.endpoint.patch('/manual-endpoint', (req, res, next) => {
    res.send('ok');
});

app.endpoint.delete('/manual-endpoint', (req, res, next) => {
    res.send('ok');
});

app.startServer();