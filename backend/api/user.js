const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')

module.exports = app => {
    const {existsOrError, notExistsOrError, equalsOrError} = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    const save = async (req, res) => {
        const user = { ...req.body }
        if (req.params.id) user.id = req.params.id

        try{
            existsOrError(user.name, 'Nome não foi informado')
            existsOrError(user.email, 'Email não foi informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha não informada')
            existsOrError(user.identity, 'Identidade não informada') 
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                                        .where({identity: user.identity}).first()

            if(!user.id) notExistsOrError(userFromDB, 'Usuario Já cadastrado')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err)) 
        }
    }

    const get = (req, res) => {
        if (!req.params.id){
            app.db('users')
                .select('id', 'name', 'email', 'identity', 'number')
                .then(users => res.json(users))
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .select('id', 'name', 'email', 'identity', 'number')
                .where({id: req.params.id})
                .then(users => res.json(users))
                .catch(err => res.status(500).send(err))
        }               
    }

    const remove = async(req, res) => {
        existsOrError(req.params.id, 'Usuario não informado.')
        app.db('users')
            .update({deletedAt: 'now()'})
            .where({id: req.params.id})
        res.status(204).send()

    }

    return { save, get, remove }
}