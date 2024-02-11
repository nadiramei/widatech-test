import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'sql6.freesqldatabase.com',
    username: 'sql6683322',
    password: 'E2TSJqq7At',
    database: 'sql6683322'
});

export default sequelize;
