import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as FormData from 'form-data';

@Injectable()
export class HttpRepository {
  private readonly logger = new Logger(HttpRepository.name);

  constructor(private readonly httpService: HttpService) {}

  async post<T>(
    url: string,
    data: any,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.makeRequest('post', url, data, headers);
  }

  async postWithPath<T>(
    url: string,
    pathParam: string,
    data: any,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    const patchedUrl = `${url}/${pathParam}`;
    return this.makeRequest('post', patchedUrl, data, headers);
  }

  async postMultipart<T>(
    url: string,
    data: Record<string, any>,
    files: Express.Multer.File[],
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    try {
      const formData = new FormData();
  
      // Append text fields to the form data
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
  
      // Check if files array is not empty and append each file to the form data
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('image', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
          });
        });
      }
  
      const formHeaders = formData.getHeaders();
  
      // Merge form headers with any additional headers provided
      const mergedHeaders = {
        ...headers,
        ...formHeaders,
      };
  
      // Send POST request with form data
      const response = await this.httpService.axiosRef.post(url, formData, {
        headers: mergedHeaders,
        timeout: 10000, // Set timeout to 10 seconds (or adjust as needed)
      });
  
      return response;
    } catch (err) {
      this.handleErrorResponse(err);
      throw err;
    }
  }

  async get<T>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.makeRequest('get', url, undefined, headers);
  }

  async getWithPath<T>(
    url: string,
    pathParam?: string,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    const updatedUrl = pathParam ? `${url}/${pathParam}` : url;
    return this.makeRequest('get', updatedUrl, undefined, headers);
  }

  private constructUrlWithParams(
    url: string,
    params: Record<string, any>,
  ): string {
    const queryParams = new URLSearchParams(params).toString();
    return `${url}?${queryParams}`;
  }

  async getWithParams<T>(
    url: string,
    queryParams?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    const requestUrl = queryParams
      ? this.constructUrlWithParams(url, queryParams)
      : url;
    return this.makeRequest('get', requestUrl, undefined, headers);
  }

  async put<T>(
    url: string,
    data: any,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.makeRequest('put', url, data, headers);
  }

  async patch<T>(
    url: string,
    data: any,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.makeRequest('patch', url, data, headers);
  }

  async patchWithPath<T>(
    url: string,
    pathParam: string,
    data: any,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    const patchedUrl = `${url}/${pathParam}`;
    return this.makeRequest('patch', patchedUrl, data, headers);
  }

  async deleteWithMultiplePaths<T>(
    url: string,
    data: any,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    return this.makeRequest('delete', url, data, headers);
  }

  async delete<T>(
    url: string,
    pathParam: string,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    const deletedUrl = `${url}/${pathParam}`;
    return this.makeRequest('delete', deletedUrl, undefined, headers);
  }

  private handleErrorResponse(err: any): void {
    if (err.response && err.response.status) {
      this.logger.error(
        `HTTP Error: ${err.response.status} - ${err.response.data.message}`,
        err.stack,
      );
      throw new HttpException(
        err.response.data.message || 'An error occurred',
        err.response.status,
      );
    } else {
      this.logger.error('An unknown error occurred', err.stack);
      throw new HttpException(
        'An unknown error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async makeRequest<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    headers?: Record<string, string>,
  ): Promise<AxiosResponse<T>> {
    try {
      const config = {
        headers: headers || {},
        timeout: 10000, // Set timeout to 10 seconds (or adjust as needed)
      };
      if (method === 'get' || method === 'delete') {
        return await this.httpService.axiosRef[method](url, config);
      } else {
        return await this.httpService.axiosRef[method](url, data, config);
      }
    } catch (err) {
      this.handleErrorResponse(err);
      throw err;
    }
  }
}
