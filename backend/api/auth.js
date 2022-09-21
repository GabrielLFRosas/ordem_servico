const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password){
            res.status(400).send('Informe o usuario e a senha')
        }

        const user = await app.db('users')
                                .where({email: req.body.email})
                                .first()
        if(!user) return res.status(400).send("Usuário não encontrado!")

        const isMatch = bcrypt.compareSync(req.body.password, user.password)

        if(!isMatch) return res.status(401).send("Email/Senha invalidos!")

        const now = Math.floor(Date.now()) 

        const payload = {
            id: user.id, 
            name: user.name,
            email: user.email, 
            number: user.number, 
            identity: user.identity,
            contributor: user.contributor,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 5)
        }
        res.json({
            ...payload, 
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try{
            if(userData){
                const token = jwt.decode(userData.token, authSecrect)
                if(new Date(token.exp * 1000) > new Date()){
                    return res.send(true)
                }
            }
        } catch(e) {
            //problema no Token
        }

        res.send(false)
    }

    return {signin, validateToken}
}