import { Prisma } from "@generated/prisma/client";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let errorMessage = "Something went wrong";
  let errorDetails: any = null;

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Invalid data provided";
    errorDetails = err.message;
  }

  // Prisma known errors (unique, foreign key, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    errorMessage = err.message;
    errorDetails = err.meta;
  }

  // Default JS error
  if (err instanceof Error) {
    errorDetails = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: errorDetails,
  });
};

export default errorHandler;
