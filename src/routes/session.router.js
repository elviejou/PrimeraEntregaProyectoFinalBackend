import { Router } from 'express';
import userModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

const router = Router()

//VISTA REGISTRAR USUARIOS
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

//API REGISTRAR USAURIOS
router.post('/register', passport.authenticate('register', {failureRedirect:'/sessions/failRegister'}), async (req, res) => {
    const newUser = req.body
    newUser.password = createHash(req.body.password)
    const user = new userModel(newUser)
    await user.save()
    res.redirect('/sessions/login')
})

router.get('/failRegister', (req, res,) => {
    res.send({error: 'Failed!!'})
})

//VISTA LOGIN USUARIOS
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

//API LOGIN USUARIOS
router.post('/login', async (req, res) => {
    const {email, password} = req.body
    const user = await userModel.findOne({email}).lean().exec()
    if (!user) {
        return res.status(401).render('errors/base', {
            error: 'Email does not exist in our DB'
        })
        
    }
    if (!isValidPassword(user,password)){
    return res.status(403).send( {status: 'error', error: 'Incorrect Password'  }) 
    }
    delete user.password
    req.session.user = user
    res.redirect('/products')
})

//VISTA GITHUB LOGIN
router.get('/github', passport.authenticate('github', { scope: ["user:email"] }), (req, res) => { })

//API LOGIN CON GITHUB
router.get('/githubcallback',
    passport.authenticate('github', { failureRedirect: '/sessions/login' }),
    async (req, res) => {
        req.session.user = req.user
        res.redirect('/products')
    })

//DESLOGUEARSE
router.get('/logout', (req, res) => {
    req.session.destroy(err =>{
        if (err) res.status(500).render('errors/base',{
            error:err
        })
        else res.redirect ('/sessions/login')
    })
})

export default router