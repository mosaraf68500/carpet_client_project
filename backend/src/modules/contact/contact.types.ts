export interface CreateMessageBody {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  productId?: string;
  source?: string;
}

export interface CreateMessageResponse {
  message: string;
  id: string;
}

// Query params always arrive as strings (or are absent) regardless of the
// value's logical type — Express doesn't coerce them.
export interface MessageQuery {
  page?: string;
  limit?: string;
  unreadOnly?: string;
}

export interface DeleteMessageResponse {
  message: string;
}

export interface MessagesResult<T> {
  items: T[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}
