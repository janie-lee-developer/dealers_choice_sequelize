//db
const { syncAndSeed, models: { Student, Subject, Registration } } = require('../db/index');

//router
const app = require('express').Router();
module.exports = app;

//routes
app.get('/', async (req, res, next) => {
    try {
        const students = await Student.findAll({
            include: [
                { model: Student, as: 'leader' },
                { model: Student, as: 'fellows' }
            ]
        })
        res.send(students)
    }
    catch (ex) {
        next(ex);
    }
});