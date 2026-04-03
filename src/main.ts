import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:3000',
      'https://budgetbuddy-coral.vercel.app'
    ],
    optionsSuccessStatus: 200,
  }
  app.enableCors(corsOptions);

  app.use(helmet())

  app.useStaticAssets(join(__dirname, '..', 'public/files'), {
    prefix: '/public/files/',
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  const port = process.env.PORT || 5000
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Application is running on port ${port}`)
  })
}
bootstrap()
