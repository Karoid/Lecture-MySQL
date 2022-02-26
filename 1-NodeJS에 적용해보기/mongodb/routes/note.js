const express = require("express");
const router = express.Router(); //라우터 선언
const Note = require('../schemas/note.js');

// Create a new Note
router.post('/notes', async (req, res) => {
  console.log('CREATE NOTE', req.body)
  try{
    /***** 생성 *****/
    const result = await Note.create({
        title: req.body.title || "Untitled Note",
        content: req.body.content
    });

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
    const notes = await Note.find()
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
    const note = await Note.findById(req.params.noteId)
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
    const note = await Note.findByIdAndUpdate(req.params.noteId, {
      title: req.body.title || "Untitled Note",
      content: req.body.content
    }, {new: true})

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
      message: "Error updating note with id " + req.params.noteId
    });
  }

});

// Delete a Note with noteId
router.delete('/notes/:noteId', async (req, res) => {
  console.log('DELETE NOTE')
  try{
    /***** 삭제 *****/
    const note = await Note.findByIdAndRemove(req.params.noteId)
    if(!note) {
      return res.status(404).json({
          message: "Note not found with id " + req.params.noteId
      });
    }
    res.json({message: "Note deleted successfully!"});
  }catch(err){
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).json({
        message: "Note not found with id " + req.params.noteId
      });
    }
    return res.status(500).json({
      message: "Could not delete note with id " + req.params.noteId
    });
  }
});

module.exports = router;