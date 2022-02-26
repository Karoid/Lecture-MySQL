// Configuring the database
const mysql = require("mysql2/promise");

async function main() {
    // 1개의 연결 생성
    let connection = await mysql.createConnection({
        host: process.env.mysql_host,
        user: process.env.mysql_user,
        password: process.env.mysql_password
    });
    
    // DB 생성
    try{
        await connection.query(`CREATE DATABASE ${process.env.mysql_database}`)
    }catch(err){}

    // DB 사용
    await connection.query(`USE ${process.env.mysql_database}`)

    // note 테이블 생성
    await connection.query(`
    CREATE TABLE note(
        id INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY(id),
        title VARCHAR(100),
        content VARCHAR(200),
        created_at DATETIME NOT NULL
    )
    `)
    
    // 연결 종료
    await connection.end()
}

main()