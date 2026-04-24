import { Request, Response } from "express";
import { fieldChecker, ValidationSchema } from "kristan1-input-validator";
import { Model } from "mongoose";
import { AppError } from "../utils/error/app-error.util";

export const addData =
  <T>(model: Model<T>, validationSchema: ValidationSchema) =>
  async (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      const validationData =
        data && typeof data === "object"
          ? Object.fromEntries(
              Object.entries(data as Record<string, unknown>).map(
                ([key, value]) => [
                  key,
                  typeof value === "number" || typeof value === "boolean"
                    ? String(value)
                    : value,
                ],
              ),
            )
          : data;

      //validate
      const result = fieldChecker(validationData, validationSchema);

      if (!result.isValid) {
        return res.status(400).json({
          success: false,
          errors: result.errors,
        });
      }

      const add = await model.create(data);
      if (!add) throw new AppError("Failed to add data", 400);

      return res.status(200).json({
        success: true,
        message: "Succes",
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error adding data", 500);
    }
  };
