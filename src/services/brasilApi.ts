import type { CepData, CnpjData } from '../types/empresa';
import { onlyDigits } from '../utils/format';

const BASE_URL = 'https://brasilapi.com.br/api';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const isAbortError = (err: unknown) =>
  err instanceof DOMException && err.name === 'AbortError';

export const getErrorMessage = (err: unknown) =>
  err instanceof ApiError ? err.message : 'Ocorreu um erro inesperado. Tente novamente.';

async function get<T>(path: string, notFoundMessage: string, signal?: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal });
  } catch (err) {
    if (isAbortError(err)) throw err;
    throw new ApiError('Sem conexão com a BrasilAPI. Verifique sua internet e tente novamente.');
  }

  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      throw new ApiError(notFoundMessage, response.status);
    }
    if (response.status === 429) {
      throw new ApiError('Muitas consultas seguidas. Aguarde alguns segundos e tente novamente.', 429);
    }
    throw new ApiError('A BrasilAPI está indisponível no momento. Tente novamente mais tarde.', response.status);
  }
  return response.json() as Promise<T>;
}

export function buscarCnpj(cnpj: string, signal?: AbortSignal) {
  const digits = onlyDigits(cnpj);
  if (digits.length !== 14) return Promise.reject(new ApiError('Digite um CNPJ com 14 dígitos.'));
  return get<CnpjData>(`/cnpj/v1/${digits}`, 'CNPJ não encontrado na base da Receita Federal.', signal);
}

export function buscarCep(cep: string, signal?: AbortSignal) {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) return Promise.reject(new ApiError('Digite um CEP com 8 dígitos.'));
  return get<CepData>(`/cep/v2/${digits}`, 'CEP não encontrado. Confira os números digitados.', signal);
}