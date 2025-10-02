import {
  Logger,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  HttpVersionNotSupportedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  ImATeapotException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  PreconditionFailedException,
} from '@nestjs/common';

export const handleError = (error: Error) => {
  Logger.error(error);

  switch (true) {
    case error instanceof BadRequestException:
      throw new BadRequestException(error.message);
    case error instanceof UnauthorizedException:
      throw new UnauthorizedException(error.message);
    case error instanceof NotFoundException:
      throw new NotFoundException(error.message);
    case error instanceof ForbiddenException:
      throw new ForbiddenException(error.message);
    case error instanceof NotAcceptableException:
      throw new NotAcceptableException(error.message);
    case error instanceof RequestTimeoutException:
      throw new RequestTimeoutException(error.message);
    case error instanceof ConflictException:
      throw new ConflictException(error.message);
    case error instanceof GoneException:
      throw new GoneException(error.message);
    case error instanceof HttpVersionNotSupportedException:
      throw new HttpVersionNotSupportedException(error.message);
    case error instanceof PayloadTooLargeException:
      throw new PayloadTooLargeException(error.message);
    case error instanceof UnsupportedMediaTypeException:
      throw new UnsupportedMediaTypeException(error.message);
    case error instanceof UnprocessableEntityException:
      throw new UnprocessableEntityException(error.message);
    case error instanceof InternalServerErrorException:
      throw new InternalServerErrorException(error.message);
    case error instanceof NotImplementedException:
      throw new NotImplementedException(error.message);
    case error instanceof ImATeapotException:
      throw new ImATeapotException(error.message);
    case error instanceof MethodNotAllowedException:
      throw new MethodNotAllowedException(error.message);
    case error instanceof BadGatewayException:
      throw new BadGatewayException(error.message);
    case error instanceof ServiceUnavailableException:
      throw new ServiceUnavailableException(error.message);
    case error instanceof GatewayTimeoutException:
      throw new GatewayTimeoutException(error.message);
    case error instanceof PreconditionFailedException:
      throw new PreconditionFailedException(error.message);
    default:
      throw new BadRequestException(error?.message);
  }
};
