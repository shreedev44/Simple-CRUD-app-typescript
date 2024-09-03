import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import studentRoutes from './routes/studentRoutes';
import morgan from 'morgan';


dotenv.config();
let app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

app.use(express.static(path.join(__dirname, '../dist/public')));

app.use(morgan('dev'))


app.use('/', studentRoutes);

mongoose.connect(process.env.MONGODB_URI as string)
.then(() => console.log('mongodb connected'))
.catch((err) => console.log(err));

app.listen(process.env.PORTNO, () => console.log('done'));