import { StatusCodes } from 'http-status-codes'

        // Import modules from another files
import User from '../Model/UserSchema.js'
import BadRequestError from '../errors/bad-request.js'
import UnauthenticatedError from '../errors/unauthenticated.js'


export const register = async( req, res )=> {
    const user = await User.create( req.body )
    // const token = user.createJWT()
    res.status( StatusCodes.CREATED ).json( user )
}

export const login = async( req, res )=> {
    const { email, password } = req.body

    if( !email || !password )
        throw new BadRequestError('Please provide email and password')
    
    const user = await User.findOne( {email} )
    if(!user)
        throw new UnauthenticatedError('No user found')

    const isPasswordCorrect = await user.comparePassword( password )
    if(!isPasswordCorrect)
        throw new UnauthenticatedError('Invalid Credentials')
    
    const token = user.createJWT()
    let userWithNoPassword = await User.find( {email} ).select("-password")
    res.status( StatusCodes.OK ).json( { userWithNoPassword, token })
}