import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { Admin } from '../admins/entities/admin.entity';
import { Doctor } from '../doctors/entities/doctor.entity';

@Injectable()
export class PatientService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<Patient>,
  @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const existingAdmin = await this.adminModel.findOne({ email: createPatientDto.email });
    const existingPatient = await this.patientModel.findOne({ email: createPatientDto.email });
    const existingDoctor = await this.doctorModel.findOne({ email: createPatientDto.email });
    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    if (existingPatient) {
      throw new ConflictException('Patient with this email already exists');
    }

    if (existingDoctor) {
      throw new ConflictException('Doctor with this email already exists');
    }
    const createdPatient = new this.patientModel(createPatientDto);
    return createdPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const updatedPatient = await this.patientModel
      .findByIdAndUpdate(id, { $set: updatePatientDto }, { new: true })
      .exec();

    if (!updatedPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return updatedPatient;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.patientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return { message: 'Patient successfully deleted' };
  }
}
