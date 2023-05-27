import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import UserModel from './models/user.model.js'

const initializePassport = () => {

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.c9342fc618e3df78',
        clientSecret: 'd78a93c9093324f5762e988921f9e6c1cd537b8c',
        callbackURL: 'http://localhost:8080/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done (null, user)

            const newUser = await UserModel.create({
                first_name: profile._json.name,
                email: profile._json.email,
            })

            return done(null, newUser)
        } catch(err) {
            return done ('Error to login with GitHub')
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })
}

export default initializePassport