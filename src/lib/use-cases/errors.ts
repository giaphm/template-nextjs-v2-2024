export class PublicError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to view this content")
    this.name = "AuthenticationError"
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super("Email is already in use")
    this.name = "EmailInUseError"
  }
}

export class NotFoundError extends PublicError {
  constructor(message: string) {
    super(message || "Resource not found")
    this.name = "NotFoundError"
  }
}

export class TokenExpiredError extends PublicError {
  constructor() {
    super("Token has expired")
    this.name = "TokenExpiredError"
  }
}

export class LogInError extends PublicError {
  constructor() {
    super("Invalid email or password")
    this.name = "LogInError"
  }
}

export class CreateUserError extends PublicError {
  constructor() {
    super("Create user error")
    this.name = "CreateUserError"
  }
}

export class SendEmailError extends PublicError {
  constructor() {
    super("Send email error")
    this.name = "SendEmailError"
  }
}

export class RateLimitError extends PublicError {
  constructor() {
    super("Rate limit exceeded")
    this.name = "RateLimitError"
  }
}

export class InvalidTokenError extends PublicError {
  constructor() {
    super("Invalid token")
    this.name = "InvalidTokenError"
  }
}
export class ExpiredEmailVerificationError extends PublicError {
  constructor() {
    super("Expired email verification")
    this.name = "ExpiredEmailVerificationError"
  }
}

export class UserProfileNotFoundError extends PublicError {
  constructor() {
    super("User profile not found")
    this.name = "UserProfileNotFoundError"
  }
}

export class InvalidMagicLinkTokenError extends PublicError {
  constructor() {
    super("Invalid or expired magic link")
    this.name = "InvalidMagicLinkTokenError"
  }
}

export class ExpiredMagicLinkTokenError extends PublicError {
  constructor() {
    super("Magic link token has expired")
    this.name = "ExpiredMagicLinkTokenError"
  }
}

export class LoginError extends PublicError {
  constructor() {
    super("Invalid email or password")
    this.name = "LoginError"
  }
}
