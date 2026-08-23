import { AxiosError } from 'axios';
import type { ApiError } from '../types/api';

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out — the server may be waking up from idle. Please try again in a few seconds.';
    }
    const data = error.response?.data as ApiError | undefined;
    if (data?.validationErrors?.length) {
      return data.validationErrors.map((e) => `${e.field}: ${e.message}`).join('; ');
    }
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
