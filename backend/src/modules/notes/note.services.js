const Note = require('./note.model');

exports.createNote = async (noteData) => {
    const note = new Note(noteData);
    return await note.save();
};

exports.getNotesByProject = async (projectId, userId) => {
    return await Note.find({ projectId, user_id: userId }).sort({ createdAt: -1 });
};

exports.deleteNote = async (noteId, userId) => {
    return await Note.findOneAndDelete({ _id: noteId, user_id: userId });
};

exports.updateNote = async (noteId, userId, updateData) => {
    return await Note.findOneAndUpdate(
        { _id: noteId, user_id: userId },
        updateData,
        { new: true }
    );
};
exports.getAllUserNotes = async (userId) => {
    return await Note.find({ user_id: userId }).populate('projectId', 'name');
};




