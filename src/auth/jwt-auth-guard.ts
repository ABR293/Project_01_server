import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";



export class JwtAuthGuard implements CanActivate {

    constructor( private jwtService: JwtService){

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        try{
            const authHeader = req.headers.authorization
        const bearer = authHeader.split(' ')[0]
        const token = authHeader.split(' ')[0]

        if(bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({message:'user is not authorize'})
        } 

        const user = this.jwtService.verify(token)
        req.user = user
        return true


        }catch {
            throw new UnauthorizedException({message:'user is not authorize'})
        }
    }
}