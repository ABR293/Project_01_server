import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"




const app = async () => {
    try{
        const PORT = process.env.PORT || 4000

        const app = await NestFactory.create(AppModule);
        app.enableCors();

        await app.listen(PORT, () => console.log(`Server is starting on port - ${PORT}`) )
    }catch(err){
        console.log(err)
    }
}

app()