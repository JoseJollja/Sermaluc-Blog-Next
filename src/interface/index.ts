export interface FieldError {
  field: string
  message: string
}

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
}

export type ApiResponseError = {
  ok: false
  errors: FieldError[]
}

export type ApiResponse<T extends object> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      errors: FieldError[]
    }

export type ApiResponsePaginated<T extends object> =
  | {
      ok: true
      data: T[]
      meta: Pagination
    }
  | {
      ok: false
      errors: FieldError[]
    }
