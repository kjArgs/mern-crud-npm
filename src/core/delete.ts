import { Request, Response } from "express";
import { Model } from "mongoose";
import { AppError } from "../utils/error/app-error.util";

export const deleteData =
  <T>(model: Model<T>) =>
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      //check if data exist
      const isFound = await model.findOne({ id });

      if (!isFound) {
        throw new AppError("No data found", 404);
      }

      //proceed to delete
      const deleteData = await model.findByIdAndDelete(id);

      if (!deleteData) throw new AppError("Failed to delete ", 400);
      return res.status(200).json({
        success: true,
        message: "Successfully Deleted",
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to delete data", 500);
    }
  };
