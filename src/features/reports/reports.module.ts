import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { HttpModule } from '@nestjs/axios';
import { HttpRepository } from 'src/shared/repositories/http.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './entities/report.entity';

@Module({
  imports: [HttpModule,MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }] )],
  controllers: [ReportsController],
  providers: [ReportsService, HttpRepository],
})
export class ReportsModule {}
