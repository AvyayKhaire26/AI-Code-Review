export interface ApiResponse {
  success: boolean;
  message: string;
}

export const ApiResponseFactory = {
  success: (message: string): ApiResponse => ({
    success: true,
    message
  }),
  
  error: (message: string): ApiResponse => ({
    success: false,
    message
  })
};
