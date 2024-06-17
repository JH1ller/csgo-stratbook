import { API_URL } from '@/config';
import axios from 'axios';
import urljoin from 'url-join';
import ApiService from './base';
import { APIResponse, Endpoints } from './types';
import { Notice } from './models/Notice';

class NoticeService {
  private endpoint = Endpoints.Notice;

  async create(): Promise<APIResponse<string>> {
    const target = urljoin(API_URL, this.endpoint, '/create');
    return ApiService.makeRequest<string>(axios.get(target));
  }

  async getAll(): Promise<APIResponse<Notice[]>> {
    const target = urljoin(API_URL, this.endpoint, '/');
    return ApiService.makeRequest<Notice[]>(axios.get(target));
  }
}

const noticeService = new NoticeService();

export { noticeService };
