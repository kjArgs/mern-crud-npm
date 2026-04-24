import { Request, Response } from "express";
import { fieldChecker, ValidationSchema } from "kristan1-input-validator";
import { Model } from "mongoose";
import { AppError } from "../utils/error/app-error.util";

export const updateData =
  <T>(model: Model<T>, validationSchema: ValidationSchema) =>
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
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

      //check if fields has data
      const result = fieldChecker(validationData, validationSchema);

      if (!result.isValid) {
        return res.status(400).json({
          success: false,
          errors: result.errors,
        });
      }
      const updateData = await model.findByIdAndUpdate(id, data, {
        new: true,
        returnDocument: "after",
      });
      if (!updateData) {
        throw new AppError("Failed to update, data not found", 404);
      }

      return res.status(200).json({
        success: true,
        message: "Updated Successfully",
        data: updateData,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error updating Household Data", 500);
    }
  };
