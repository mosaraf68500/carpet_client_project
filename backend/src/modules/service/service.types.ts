// This is the Installation/Fixing/Delivery business resource, not to be
// confused with the *.service.ts architectural layer convention used
// across all modules.

// `steps` arrives as a JSON string from the multipart form (the image
// itself comes from `req.file`, never the body), so it stays typed as
// `string` here and gets JSON.parse()'d in the service layer.

export interface CreateServiceBody {
  title?: string;
  intro?: string;
  steps?: string;
}

export interface UpdateServiceBody {
  title?: string;
  intro?: string;
  steps?: string;
  isActive?: string | boolean;
}

export interface DeleteServiceResponse {
  message: string;
}
