export class ResourceNotFoundException extends Error {
  statusCode = 404;
  
  constructor(message: string) {
    super(message);
    this.name = 'ResourceNotFoundException';
  }
}

export class UserAlreadyExistsException extends Error {
  statusCode = 409;
  
  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidCredentialsException extends Error {
  statusCode = 401;
  
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCredentialsException';
  }
}

export class AccessDeniedException extends Error {
  statusCode = 403;
  
  constructor(message: string) {
    super(message);
    this.name = 'AccessDeniedException';
  }
}
