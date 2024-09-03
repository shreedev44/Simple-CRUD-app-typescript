import Student from '../models/studentModel';
import { Request, Response } from 'express';


export const fetchAllStudents = async (req: Request, res: Response) => {
    try{
        const students = await Student.find().sort({name: 1});
        res.render('students', {students});
    }
    catch(err){
        res.status(500).json({message: "Error while fetching students"});
        console.log(err);
    }
}

export const addStudent = async (req: Request, res: Response) => {
    try{
        let {name, email, age} = req.body;

        let nameRegex: RegExp = /^[a-zA-Z]+$/;
        let emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!nameRegex.test(name)){
            res.status(400).json({message: "Please enter a valid name"});
            return;
        }
        if(!emailRegex.test(email)){
            res.status(400).json({message: "Please enter a valid email"});
            return;
        }
        if(age < 7 || age > 20){
            res.status(400).json({message: "Please enter a valid age (7 - 20)"});
            return;
        }
        let studentExist = await Student.findOne({email: email});
        if(studentExist){
            res.status(400).json({message: "student already exist with this email"});
            return;
        }

        let student = new Student({
            name: name,
            email: email,
            age: age,
        })

        let studentData = await student.save();
        if(studentData){
            res.sendStatus(200);
        }else{
            res.status(500).json('Failed to add student');
        }
    }catch(err){
        res.status(500).json('Failed to add student');
        console.log(err);
    }
}

export const fetchStudent = async (req: Request, res: Response) => {
    try{
        let student = await Student.findOne({_id: req.params.studentId});
        res.status(200).json(student);
    }catch(err){
        console.log(err)
    }
}

export const editStudent = async (req: Request, res: Response) => {
    try{
        let nameRegex: RegExp = /^[a-zA-Z]+$/;
        let emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!nameRegex.test(req.body.name)){
            res.status(400).json({message: "Please enter a valid name"});
            return;
        }
        if(!emailRegex.test(req.body.email)){
            res.status(400).json({message: "Please enter a valid email"});
            return;
        }
        if(req.body.age < 7 || req.body.age > 20){
            res.status(400).json({message: "Please enter a valid age (7 - 20)"});
            return;
        }

        await Student.findByIdAndUpdate(req.params.studentId, req.body);
        res.sendStatus(200);
    }catch(err){
        res.status(500).json({message: 'Failed to edit Student'});
    }
}

export const deleteStudent = async (req: Request, res: Response) => {
    try{
        await Student.findByIdAndDelete(req.params.studentId);
        res.sendStatus(200);
    }catch(err){
        console.log(err)
    }
}