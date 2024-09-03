import express from 'express';
import * as studentController from '../controllers/studentController';


const router = express.Router();

router.get('/', studentController.fetchAllStudents);

router.post('/add-student', studentController.addStudent);

router.get('/fetch-student/:studentId', studentController.fetchStudent);

router.put('/edit-student/:studentId', studentController.editStudent);

router.delete('/delete-student/:studentId', studentController.deleteStudent);

router.get('*', studentController.fetchAllStudents);

export default router;