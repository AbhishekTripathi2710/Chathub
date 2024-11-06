import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './route/authUser.js';
import messageRouter from './route/messageRoute.js';
import userRouter from './route/userRout.js';
import cookieParser from 'cookie-parser';
import {app, server} from './Socket/socket.js'
import path from 'path';

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

app.get('/', (req, res) => {
    res.send('server is running');
});

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log('DB connected successfully');
    } catch (error) {
        console.error(error);
    }
};

const PORT = process.env.PORT;

server.listen(PORT, () => {
    dbConnect();
    console.log(`Working at ${PORT}`);
});
