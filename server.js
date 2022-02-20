//db
const { syncAndSeed, models: { Student, Subject, Registration}} = require('./db/index');

//express
const express = require('express');
const app = express();

//routes
app.use('/api/subjects', require('./routes/subjects.routes'));
app.use('/api/students', require('./routes/students.routes'));

//init
const init = async() => {
    try{
        await syncAndSeed();
        
        const port = process.env.PORT || 1347;
        app.listen(port, () => console.log(`************ listening on port ${port} ************`));
    }
    catch(ex) {
        console.log(ex);
    }
}
init();