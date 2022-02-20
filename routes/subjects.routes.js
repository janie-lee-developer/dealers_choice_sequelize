//db
const { syncAndSeed, models: { Student, Subject, Registration } } = require('../db/index');

//router
const app = require('express').Router();
module.exports = app;

//routes
app.get('/:name', async (req, res, next) => {
    try {
        const students = await Registration.findAll({
            include: [Student],
            where: {subjectName : req.params.name }
        })
        res.send(students);
    }
    catch (ex) {
        next(ex)
    }
});

app.get('/', async (req, res, next) => {
    try {
        const subjects = await Subject.findAll({
            include: [Registration]
        });
        res.send(subjects);
    }
    catch (ex) {
        next(ex)
    }
});
