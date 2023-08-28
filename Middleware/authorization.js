import jwt from 'jsonwebtoken'
import UnauthenticatedError from '../errors/unauthenticated.js'

const authorization =  ( req, res, next )=> {
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer'))
        throw new UnauthenticatedError('Your not authorized to this route')

    const token = header.split(' ')[1]
    try {
        const verify =  jwt.verify( token, process.env.JWT_SECRET )
        req.user = verify
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    
    // const verify =  jwt.verify( token, process.env.JWT_SECRET )
    // if( verify )
    //     next()
    // else
    //     throw new UnauthenticatedError(' NO Authorization to Access ')
}

export default authorization