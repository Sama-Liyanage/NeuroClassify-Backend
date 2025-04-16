import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { HttpRepository } from 'src/shared/repositories/http.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './entities/doctor.entity';
import { Admin } from '../admins/entities/admin.entity';
import { Patient } from '../patients/entities/patient.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(Patient.name) private readonly patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<Doctor>,
    private readonly httpRepository: HttpRepository,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {

    const existingAdmin = await this.adminModel.findOne({ email: createDoctorDto.email });
    const existingPatient = await this.patientModel.findOne({ email: createDoctorDto.email });
    const existingDoctor = await this.doctorModel.findOne({ email: createDoctorDto.email });
    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    if (existingPatient) {
      throw new ConflictException('Patient with this email already exists');
    }

    if (existingDoctor) {
      throw new ConflictException('Doctor with this email already exists');
    }
    const createdDoctor = new this.doctorModel(createDoctorDto);
    return createdDoctor.save();
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async findByEmail(email: string): Promise<Doctor> {
    const doctor=await this.doctorModel.findOne({email:email}).exec();
    if(!doctor){
      throw new NotFoundException(`Doctor with email ${email} not found`);
    }
    return doctor;
  }

  async update(email: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.doctorModel
    .findOneAndUpdate({ email: email }, { $set: updateDoctorDto }, { new: true })
      .exec();
  
    if (!updatedDoctor) {
      throw new NotFoundException(`Doctor with email ${email} not found`);
    }
  
    return updatedDoctor;
  }
  

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return { message: 'Doctor successfully deleted' };
  }
}
