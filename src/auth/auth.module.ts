import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { AtStrategy, RtStrategy } from './strategy'
import { AccountsModule } from '../accounts/accounts.module'

@Module({
	imports: [JwtModule.register({}), AccountsModule],
	controllers: [AuthController],
	providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
