const express = require("express");
const router = express.Router(); //라우터 선언

// Create a new Note
router.post('/notes', async (req, res) => {
  console.log('CREATE NOTE', req.body)
  try{
    /***** 생성 *****/
    // 연결을 하나 생성
    const connection = await req.app.get('pool').getConnection(async conn => conn)
    // 쿼리 수행
    // result에 다음의 정보가 담긴다
    // {"fieldCount":0,"affectedRows":1,"insertId":1,"info":"","serverStatus":2,"warningStatus":0}
    // 여기서 insertId가 생성된 도큐먼트 id
    const [result] = await connection.query(
      'INSERT INTO note(title, content, created_at) VALUES(?,?,NOW())',
      [req.body.title || "Untitled Note", req.body.content]
    )
    console.log(result)
    // 연결을 해제
    connection.release()

    res.json(result);
  }catch(err){
    res.status(500).json({
      message: err.message || "Some error occurred while creating the Note."
    });
  }
});

// Retrieve all Notes
router.get('/notes', async (req, res) => {
  console.log('SHOW INDEX NOTE')
  try{
    /***** 조회 *****/
    const connection = await req.app.get('pool').getConnection(async conn => conn)
    const [notes] = await connection.query(
      'SELECT * FROM note'
    )
    connection.release()

    res.json(notes);
  }catch(err){
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving notes."
    });
  }
});

// Retrieve a single Note with noteId
router.get('/notes/:noteId', async (req, res) => {
  console.log('SHOW NOTE')
  try{
    /***** 조회 *****/
    const connection = await req.app.get('pool').getConnection(async conn => conn)
    // SELECT문의 결과는 항상 배열로 나온다.
    // 그래서 배열의 첫번째 값을 빼내야 한다.
    const [notes] = await connection.query(
      'SELECT * FROM note WHERE id=? LIMIT 1',
      [req.params.noteId]
    )
    const note = notes[0]

    connection.release()

    if(!note) {
      return res.status(404).json({
        message: "Note not found with id " + req.params.noteId
      });
    }
    res.json(note);
  }catch(err){
    if(err.kind === 'ObjectId') {
      return res.status(404).json({
        message: "Note not found with id " + req.params.noteId
      });
    }
    return res.status(500).json({
      message: "Error retrieving note with id " + req.params.noteId
    });
  }
});

// Update a Note with noteId
router.put('/notes/:noteId', async (req, res) => {
  console.log('UPDATE NOTE')
  try{
    /***** 수정 *****/
    const connection = await req.app.get('pool').getConnection(async conn => conn)
    // result에 다음의 정보가 담긴다. 
    // {"fieldCount":0,"affectedRows":1,"insertId":0,"info":"Rows matched: 1  Changed: 1  Warnings: 0","serverStatus":2,"warningStatus":0,"changedRows":1}
    // 여기서 affectedRows가 영상을 미친 row의 수
    const [result] = await connection.query(
      'UPDATE note SET title=?, content=? WHERE id=?',
      [req.body.title || "Untitled Note", req.body.content, req.params.noteId]
    )
    console.log(result)
    
    // 만약 영향을 준 row가 0개면 해당 id를 가진 row가 없는 것이다.
    if(result.affectedRows == 0) {
      return res.status(404).json({
        message: "Note not found with id " + req.params.noteId
      });
    }

    // 변경된 note를 조회해서 변수에 담는다
    const [notes] = await connection.query(
      'SELECT * FROM note WHERE id=? LIMIT 1',
      [req.params.noteId]
    )
    const note = notes[0]

    connection.release()
    res.json(note);
  }catch(err){
    console.log(err)
    return res.status(500).json({
      message: "Error updating note with id " + req.params.noteId
    });
  }

});

// Delete a Note with noteId
router.delete('/notes/:noteId', async (req, res) => {
  console.log('DELETE NOTE')
  try{
    /***** 삭제 *****/
    const connection = await req.app.get('pool').getConnection(async conn => conn)
    // result에 다음의 정보가 담긴다. 
    // {"fieldCount":0,"affectedRows":1,"insertId":0,"info":"","serverStatus":2,"warningStatus":0}
    // 여기서 affectedRows가 영상을 미친 row의 수
    const [result] = await connection.query(
      'DELETE FROM note WHERE id=?',
      [req.params.noteId]
    )
    console.log(result)
    if(result.affectedRows == 0) {
      return res.status(404).json({
          message: "Note not found with id " + req.params.noteId
      });
    }
    res.json({message: "Note deleted successfully!"});
  }catch(err){
    return res.status(500).json({
      message: "Could not delete note with id " + req.params.noteId
    });
  }
});

module.exports = router;