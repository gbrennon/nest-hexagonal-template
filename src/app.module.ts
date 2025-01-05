import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from '@shared/infrastructure/config/app-data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => AppDataSource.options,
    }),
    UserManagementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
