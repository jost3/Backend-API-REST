import  {Sequelize} from 'sequelize';

const db = new Sequelize('node_proyect', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
});

export default db;