import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';

@Module({
  providers: [RemindersService],
  controllers: [RemindersController]
})
export class RemindersModule {}
