// Configuring the database
const mysql = require("mysql2/promise");

async function main() {
    // 1개의 연결 생성
    let connection = await mysql.createConnection({
        host: process.env.mysql_host,
        user: process.env.mysql_user,
        password: process.env.mysql_password,
        database: process.env.mysql_database,
    });
    
    // 테이블 삭제
    await connection.query(`DROP TABLE note`)
    
    // 연결 종료
    await connection.end()
}

main()