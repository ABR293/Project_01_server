const jwt = require( 'jsonwebtoken')


class TokenService{
    async generateTokens (payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'})
        const refreashToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
    }
}

module.exports = new TokenService()