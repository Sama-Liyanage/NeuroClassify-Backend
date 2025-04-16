import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PatientService } from './patients.service';
import { PatientsController } from './patients.controller';
import { HttpRepository } from 'src/shared/repositories/http.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './entities/patient.entity';
import { Admin, AdminSchema } from '../admins/entities/admin.entity';
import { Doctor, DoctorSchema } from '../doctors/entities/doctor.entity';

@Module({
  imports: [HttpModule,MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema },
    { name: Admin.name, schema: AdminSchema },
    { name: Doctor.name, schema: DoctorSchema }
  ])],
  controllers: [PatientsController],
  providers: [PatientService, HttpRepository],
})
export class PatientsModule {}
