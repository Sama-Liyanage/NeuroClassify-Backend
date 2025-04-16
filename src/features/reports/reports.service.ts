import { Injectable, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(@InjectModel(Report.name) private readonly reportModel: Model<Report>) {}

  // Create a new report
  async create(createReportDto: CreateReportDto): Promise<Report> {
    try {      
      const report = new this.reportModel(createReportDto);
      return await report.save();
    } catch (error) {
      console.log("error creating report",error);
      this.logger.error('Error creating report', error);
    }
  }

  // Retrieve all reports
  async findAll(): Promise<Report[]> {
    try {
      console.log("fetching reports");
      
      return await this.reportModel.find().exec();
    } catch (error) {
      this.logger.error('Error fetching reports', error);
      throw new InternalServerErrorException('Failed to fetch reports');
    }
  }

  async findByEmail(email: string): Promise<Report[]> {
    try {
     return await this.reportModel.find({patient_email:email}).exec();
    } catch (error) {
      console.error('Error fetching reports', error);
    }
  }

  async findByEmailLast(email: string): Promise<Report | null> {
    try {
      return await this.reportModel
        .findOne({ patient_email: email })
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      console.error('Error fetching latest report', error);
      return null;
    }
  }
  

  async findOne(id: string): Promise<Report> {
    try {
      this.logger.log(`Fetching report with ID: ${id}`);
      const report = await this.reportModel.findById(id).exec();
      if (!report) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
      return report;
    } catch (error) {
      this.logger.error(`Error fetching report with ID: ${id}`, error);
    }
  }

  // Update a report by ID
  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    try {
      this.logger.log(`Updating report with ID: ${id}`);
      const updatedReport = await this.reportModel.findByIdAndUpdate(id, updateReportDto, { new: true }).exec();
      if (!updatedReport) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
      return updatedReport;
    } catch (error) {
      this.logger.error(`Error updating report with ID: ${id}`, error);
    }
  }

  // Delete a report by ID
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting report with ID: ${id}`);
      const result = await this.reportModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Report with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Error deleting report with ID: ${id}`, error);
    }
  }
}
