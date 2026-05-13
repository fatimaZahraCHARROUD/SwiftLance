const noteService = require('./note.services');

exports.addNote = async (req, res) => {
    try {
        const noteData = { ...req.body, user_id: req.user.id };
        const note = await noteService.createNote(noteData);
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await noteService.getAllUserNotes(req.user.id); 
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Erreur de récupération", error: error.message });
    }
};

exports.getProjectNotes = async (req, res) => {
    try {
        const { projectId } = req.params;
        const notes = await noteService.getNotesByProject(projectId, req.user.id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Erreur de récupération", error: error.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const updated = await noteService.updateNote(req.params.id, req.user.id, req.body);
        if (!updated) return res.status(404).json({ message: "Note non trouvée" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeNote = async (req, res) => {
    try {
        const deletedNote = await noteService.deleteNote(req.params.id, req.user.id);
        if (!deletedNote) return res.status(404).json({ message: "Note non trouvée" });
        res.status(200).json({ message: "Note supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur de suppression", error: error.message });
    }
};
