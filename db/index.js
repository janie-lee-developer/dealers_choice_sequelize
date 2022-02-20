const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize');

const { STRING, UUID, UUIDV4 } = Sequelize;

const Subject = sequelize.define('subject', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(20),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
            // isUrl: true
        }
    }
});

const Student = sequelize.define('student', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(20),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    leadersName: {
        type: STRING(20)
    }
});

const Registration = sequelize.define('registration', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    subjectName: {
        type: STRING(20)
    }
});

//Associations
Registration.belongsTo(Student);
Registration.belongsTo(Subject);
Student.belongsTo(Student, { as: 'leader' });
Student.hasMany(Student, { foreignKey: 'leaderId', as: 'fellows'});
Subject.hasMany(Registration);

const syncAndSeed = async() => {
    await sequelize.sync({force: true});

    // const [ algebra, chemistry, socialStudies, americanHistory, english ] = await Promise.all(
    //     ['Algebra', 'Chemistry', 'Social Studies', 'American History', 'English'].map( name => {
    //         Subject.create({name})
    //     })
    // );

    // const [ lucy, moe, bob, kevin, janie, mansoo, henry, morris, michael, jessica, larry, gary, pita, moon, kim ] = Promise.all(
    //     ['Lucy Harris','Moe Kaleb','bob Simpson','Kevin Hart','Janie Lee', 'Mansoo Kim', 'Henry Castle', 'Morris Sung', 'Michael Chess', 'Jessica Holland', 'Larry Mork', 'Gary Tam', 'Pita Ten', 'Moon Kim', 'Kim Ha'].map( name => {
    //         Person.create({name})
    //     })
    // );

    const algebra = await Subject.create({ name: "algebra" });
    const chemistry = await Subject.create({ name: "chemistry" });
    const americanHistory = await Subject.create({ name: "american_history" });
    const english = await Subject.create({ name: "english" });
    const socialStudies = await Subject.create({ name: "social_studies" });

    const janie = await Student.create({ name: "Janie Lee" });
    const mansoo = await Student.create({ name: "Mansoo" });
    const lucy = await Student.create({name: "Lucy Harris"});
    const moe = await Student.create({ name: "Moe Kaleb", leaderId: janie.id, leadersName: janie.name });
    const bob = await Student.create({ name: "Bob Simpson", leaderId: janie.id, leadersName: janie.name  });
    const kevin = await Student.create({ name: "Kevin Hart", leaderId: janie.id, leadersName: janie.name  });
    const henry = await Student.create({ name: "Henry Castle", leaderId: mansoo.id, leadersName: mansoo.name  });
    const morris = await Student.create({ name: "Morris Sung", leaderId: mansoo.id, leadersName: mansoo.name });
    const jessica = await Student.create({ name: "Jessica Holland", leaderId: mansoo.id, leadersName: mansoo.name  });
    const larry = await Student.create({ name: "Larry Mork", leaderId: lucy.id, leadersName: lucy.name  });

    await Promise.all(
        [lucy, moe, bob].map(student => {
            Registration.create({ studentId: student.id, subjectName: algebra.name, subjectId: algebra.id })
        })
    );

    await Promise.all(
        [kevin, janie, mansoo].map(student => {
            Registration.create({ studentId: student.id, subjectName: chemistry.name, subjectId: chemistry.id })
        })
    );

    await Promise.all(
        [henry, morris, jessica].map(student => {
            Registration.create({ studentId: student.id, subjectName: americanHistory.name, subjectId: americanHistory.id})
        })
    );

    await Promise.all(
        [larry, lucy, moe].map(student => {
            Registration.create({ studentId: student.id, subjectName: english.name, subjectId: english.id})
        })
    );

    await Promise.all(
        [henry, morris, jessica].map(student => {
            Registration.create({ studentId: student.id, subjectName: socialStudies.name, subjectId: socialStudies.id})
        })
    );
}

module.exports = {
    sequelize,
    syncAndSeed,
    models:{
        Student,
        Subject,
        Registration
    }
}