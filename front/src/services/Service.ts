import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const URL = import.meta.env.VITE_API_URL;

class Service {
  private baseUrl: string;

  constructor(api_url: string) {
    this.baseUrl = api_url;
  }

  get = async<T = any>(url: string, params: Record<string, any> | null = null): Promise<AxiosResponse<T> | void> => {
    try {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: this.baseUrl + url,
        headers: {
          'Content-Type': 'application/json'
        },
        params
      };
      return await axios(config);
    } catch (err: any) {
      if (err.response?.data?.message) {
        err({
          message: err.response.data.message,
        });
      }
    }
  }

  download = async (url: string, filename: string): Promise<void> => {
    try {
      const config: AxiosRequestConfig = {
        url: this.baseUrl + url,
        method: 'GET',
        headers: {
          'Authorization': 'Basic '
        },
        responseType: 'blob',
      };

      const response = await axios(config);

      const urlDownload = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlDownload;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  }

  post = async<T = any>(url: string, data: any): Promise<AxiosResponse<T> | void> => {
    try {
      const config: AxiosRequestConfig = {
        method: 'post',
        url: this.baseUrl + url,
        headers: {
          'Content-Type': 'application/json'
        },
        data
      };
      return await axios(config);
    } catch (err: any) {
      if (err.response?.data?.message) {
        err({
          message: err.response.data.message,
        });
      }
    }
  }

  put = async<T = any>(url: string, data: any): Promise<AxiosResponse<T> | void> => {
    try {
      const config: AxiosRequestConfig = {
        method: 'put',
        url: this.baseUrl + url,
        headers: {
          'Content-Type': 'application/json'
        },
        data
      };
      return await axios(config);
    } catch (err: any) {
      if (err.response?.data?.message) {
        err({
          message: err.response.data.message,
        });
      }
    }
  }

  patch = async<T = any>(url: string, data: any): Promise<AxiosResponse<T> | void> => {
    try {
      const config: AxiosRequestConfig = {
        method: 'patch',
        url: this.baseUrl + url,
        headers: {
          'Content-Type': 'application/json'
        },
        data
      };
      return await axios(config);
    } catch (err: any) {
      if (err.response?.data?.message) {
        err({
          message: err.response.data.message,
        });
      }
    }
  }

  del = async<T = any>(url: string): Promise<AxiosResponse<T> | void> => {
    try {
      const config: AxiosRequestConfig = {
        method: 'delete',
        url: this.baseUrl + url,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return await axios(config);
    } catch (err: any) {
      if (err.response?.data?.message) {
        err({
          message: err.response.data.message,
        });
      }
    }
  }
}

export default new Service(URL);
