import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserManagementModule } from './modules/user-management/user-management.module';

@Module({
  imports: [UserManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
