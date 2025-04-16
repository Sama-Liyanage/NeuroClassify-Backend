import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'; // Fixed import
import { HttpRepository } from './shared/repositories/http.repository';
import { DoctorModule } from './features/doctors/doctor.module';
import { PatientsModule } from './features/patients/patients.module';
import { AdminsModule } from './features/admins/admins.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './features/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.MONGODB_URI),
    HttpModule,
    AuthModule,
    AdminsModule,
    DoctorModule,
    PatientsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HttpRepository,
  ],
})
export class AppModule {}
