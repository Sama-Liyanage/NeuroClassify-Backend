import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { HttpRepository } from 'src/shared/repositories/http.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './entities/admin.entity';
import { Patient, PatientSchema } from '../patients/entities/patient.entity';
import { Doctor, DoctorSchema } from '../doctors/entities/doctor.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Patient.name, schema: PatientSchema },
      { name: Doctor.name, schema: DoctorSchema }
    ]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService, HttpRepository],
})
export class AdminsModule {}
