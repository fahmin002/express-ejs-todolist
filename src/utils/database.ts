/* databbase.ts */
import mysql from 'mysql'
// Configurasi database
const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'planx'
}
const koneksi = mysql.createConnection(config)

export default koneksi
// /* end of database.ts */