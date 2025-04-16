import {
  Controller,
  Get,
  Headers,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @Get('id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Get('Email/:email')
  findByEmail(@Param('email') email: string) {
    return this.doctorService.findByEmail(email);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorService.update(email, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }
}
