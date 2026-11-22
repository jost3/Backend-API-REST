import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';

dotenv.config();

let mysqlConnection: mysql.Connection | undefined;

const requiredEnv = (key: string): string => {
    const value = process.env[key];

    if (value === undefined) {
        throw new Error(`La variable ${key} no está configurada en el archivo .env`);
    }

    return value;
};

const getConnection = async (): Promise<mysql.Connection> => {
    try {
        if (!mysqlConnection) {
            mysqlConnection = await mysql.createConnection({
                host: requiredEnv('DB_HOST'),
                user: requiredEnv('DB_USER'),
                password: requiredEnv('DB_PASSWORD'),
                database: requiredEnv('DB_NAME'),
                multipleStatements: true
            });

            console.log('Conexión establecida correctamente');
        }

        return mysqlConnection;

    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default getConnection;