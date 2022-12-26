import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module"




const app = async () => {
    try{
        const PORT = process.env.PORT || 4000

        const app = await NestFactory.create(AppModule);
        app.enableCors();

        const config = new DocumentBuilder()
            .setTitle('socnetBackend')
            .setDescription('')
            .setVersion('0.0.1')
            .addTag('SocNet Api')
            .build()
        const document = SwaggerModule.createDocument(app, config)
        SwaggerModule.setup('/api/docs', app, document)

        await app.listen(PORT, () => console.log(`Server is starting on port - ${PORT}`) )

    }catch(err){
        console.log(err)
    }
}

app()