import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js';

const router = express.Router();

router.post('/register', async (req, res) => {

    const { username, password } = req.body;

    // encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)
    
    // save the new user and hasedpassword to the database
    try{
        
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
        
        //when there is user there should be todo too. I mean it's a todo list app duh
        const defaultTodo = `Hello :) Please add your first todo`
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        //create token
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        return res.json({token})

    }catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
});

router.post('/login',async (req,res) => {

    const {username , password} = req.body;

    try{
        //get the username
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        //check the username if it is match with the register user in the database
        if(!user){return res.status(404).send({message:"User not found"})}

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if(!passwordIsValid){return res.status(401).send({message:"Invalid password"})}

        //successful authentication
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        console.log(user)
        return res.send({token})

    }catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }

})

export default router;
