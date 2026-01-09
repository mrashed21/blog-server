import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500);
  res.json({
    success: false,
    message: err.message || "Something went wrong",
    error: err,
  });
};

export default errorHandler;
