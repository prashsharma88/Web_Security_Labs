import express from 'express';
import multer from 'multer';
import File from '../models/File.js';
import validateJWT from '../middleware/validateToken.js';
import canAccessFile from '../middleware/authorization.js';


const fileRouter = express.Router();

fileRouter.use(validateJWT);

const upload = multer({dest: 'uploads/'});

fileRouter.post('/', 
    upload.single('file'),
    async (req, res) => {
        const file = new File({
            filename: req.file.originalname,
            path: req.file.path,
            uploadedBy: req.user.username,
            department: req.user.department
        });

        await file.save();
        res.status(201).json({
            message: 'file uploaded',
            file
        });
    }
);

fileRouter.get('/:id', async (req, res) => {
    const file = await File.findById(req.params.id);
    if(!file) {
        return res.status(404).json({
            message: 'not found',
        });
    }

    if(!canAccessFile(req.user, file)) {
        return res.status(400).json({message: "access denied"});
    }

    res.sendFile(file.path, {root: '.'});
})


export default fileRouter;