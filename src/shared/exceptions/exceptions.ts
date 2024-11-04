import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

const ErrorSchema = z.object({
  message: z.string(),
  name: z.string(),
  stack: z.string().optional(),
});
const HTTPExceptionSchema = ErrorSchema.extend({
  statusCode: z.number().min(400).max(599),
  message: z.string(),
});

const ClientErrorExceptionSchema = HTTPExceptionSchema.extend({
  statusCode: z.number().min(400).max(499),
});
const ServerErrorExceptionSchema = HTTPExceptionSchema.extend({
  statusCode: z.number().min(500).max(599),
});

export class CustomError extends Error {
  public static isError(err: unknown): err is Error {
    return ErrorSchema.safeParse(err).success;
  }
}

export class HTTPException extends CustomError {
  constructor(
    public statusCode: StatusCodes,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  public static isHTTPException(err: unknown): err is HTTPException {
    return ClientErrorExceptionSchema.safeParse(err).success;
  }
}

export class ClientErrorException extends HTTPException {
  public static isClientErrorException(
    err: unknown,
  ): err is ClientErrorException {
    return ClientErrorExceptionSchema.safeParse(err).success;
  }
}

export class BadRequestException extends ClientErrorException {
  constructor(message: string = 'Bad Request') {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class UnauthorizedException extends ClientErrorException {
  constructor(message: string = 'Unauthorized') {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

export class PaymentRequiredException extends ClientErrorException {
  constructor(message: string = 'Payment Required') {
    super(StatusCodes.PAYMENT_REQUIRED, message);
  }
}

export class ForbiddenException extends ClientErrorException {
  constructor(message: string = 'Forbidden') {
    super(StatusCodes.FORBIDDEN, message);
  }
}

export class NotFoundException extends ClientErrorException {
  constructor(message: string = 'Not Found') {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class MethodNotAllowedException extends ClientErrorException {
  constructor(message: string = 'Method Not Allowed') {
    super(StatusCodes.METHOD_NOT_ALLOWED, message);
  }
}

export class NotAcceptableException extends ClientErrorException {
  constructor(message: string = 'Not Acceptable') {
    super(StatusCodes.NOT_ACCEPTABLE, message);
  }
}

export class ProxyAuthenticationRequiredException extends ClientErrorException {
  constructor(message: string = 'Proxy Authentication Required') {
    super(StatusCodes.PROXY_AUTHENTICATION_REQUIRED, message);
  }
}

export class RequestTimeoutException extends ClientErrorException {
  constructor(message: string = 'Request Timeout') {
    super(StatusCodes.REQUEST_TIMEOUT, message);
  }
}

export class ConflictException extends ClientErrorException {
  constructor(message: string = 'Conflict') {
    super(StatusCodes.CONFLICT, message);
  }
}

export class GoneException extends ClientErrorException {
  constructor(message: string = 'Gone') {
    super(StatusCodes.GONE, message);
  }
}

export class LengthRequiredException extends ClientErrorException {
  constructor(message: string = 'Length Required') {
    super(StatusCodes.LENGTH_REQUIRED, message);
  }
}

export class PreconditionFailedException extends ClientErrorException {
  constructor(message: string = 'Precondition Failed') {
    super(StatusCodes.PRECONDITION_FAILED, message);
  }
}

export class PayloadTooLargeException extends ClientErrorException {
  constructor(message: string = 'Payload Too Large') {
    super(StatusCodes.REQUEST_TOO_LONG, message);
  }
}

export class URITooLongException extends ClientErrorException {
  constructor(message: string = 'URI Too Long') {
    super(StatusCodes.REQUEST_URI_TOO_LONG, message);
  }
}

export class UnsupportedMediaTypeException extends ClientErrorException {
  constructor(message: string = 'Unsupported Media Type') {
    super(StatusCodes.UNSUPPORTED_MEDIA_TYPE, message);
  }
}

export class RangeNotSatisfiableException extends ClientErrorException {
  constructor(message: string = 'Range Not Satisfiable') {
    super(StatusCodes.REQUESTED_RANGE_NOT_SATISFIABLE, message);
  }
}

export class ExpectationFailedException extends ClientErrorException {
  constructor(message: string = 'Expectation Failed') {
    super(StatusCodes.EXPECTATION_FAILED, message);
  }
}
export class UnprocessableEntityException extends ClientErrorException {
  constructor(message: string = 'Unprocessable Entity') {
    super(StatusCodes.UNPROCESSABLE_ENTITY, message);
  }
}

export class ServerErrorException extends HTTPException {
  public static isServerErrorException(
    err: unknown,
  ): err is ServerErrorException {
    return ServerErrorExceptionSchema.safeParse(err).success;
  }
}

export class InternalServerErrorException extends ServerErrorException {
  constructor(message: string = 'Internal Server Error') {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}

export class NotImplementedException extends ServerErrorException {
  constructor(message: string = 'Not Implemented') {
    super(StatusCodes.NOT_IMPLEMENTED, message);
  }
}

export class BadGatewayException extends ServerErrorException {
  constructor(message: string = 'Bad Gateway') {
    super(StatusCodes.BAD_GATEWAY, message);
  }
}

export class ServiceUnavailableException extends ServerErrorException {
  constructor(message: string = 'Service Unavailable') {
    super(StatusCodes.SERVICE_UNAVAILABLE, message);
  }
}

export class GatewayTimeoutException extends ServerErrorException {
  constructor(message: string = 'Gateway Timeout') {
    super(StatusCodes.GATEWAY_TIMEOUT, message);
  }
}

export class HTTPVersionNotSupportedException extends ServerErrorException {
  constructor(message: string = 'HTTP Version Not Supported') {
    super(StatusCodes.HTTP_VERSION_NOT_SUPPORTED, message);
  }
}
