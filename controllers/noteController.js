// controllers/noteController.js
import Note from '../models/Note.js'

// Create a note
export const createNote = async (req, res) => {
  const { content, group } = req.body;

  try {
    const note = new Note({
      content,
      group,
      createdBy: req.user.id,  // Associate the note with the user who created it
      pinned: false
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
};

// Get notes for a group
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ group: req.params.groupId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};
//pin a note
export const pinNote = async (req, res) => {
  try{
    const note = await Note.findById(req.params.noteId);
    note.pinned = true;
    await note.save();
    res.status(200).json({ message: 'Note pinned succesfully'})

  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
}

//unpin a note
export const unpinNote = async (req, res) => {
  try{
    const note = await Note.findById(req.params.noteId);
    note.pinned = false;
    await note.save();
    res.status(200).json({ message: 'Note pinned succesfully'})

  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
}

// Delete a note
export const deleteNote = async (req, res) => {
    try {
      await Note.findByIdAndDelete(req.params.noteId);
      res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Note', error: error.message });
    }
  };
