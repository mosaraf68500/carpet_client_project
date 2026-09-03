export interface CreateAppointmentBody {
  name?: string;
  contact?: string;
  preferredDate?: string; // ISO date string in the JSON body
  message?: string;
}

export interface CreateAppointmentResponse {
  message: string;
  id: string;
}

export interface UpdateAppointmentStatusBody {
  status?: string;
}

// Query params always arrive as strings (or are absent) regardless of the
// value's logical type — Express doesn't coerce them.
export interface AppointmentQuery {
  page?: string;
  limit?: string;
}

export interface DeleteAppointmentResponse {
  message: string;
}

export interface AppointmentsResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
