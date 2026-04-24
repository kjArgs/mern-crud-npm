import { Request, Response } from "express";
import { Model } from "mongoose";
import { AppError } from "../utils/error/app-error.util";

export const getData =
  <T>(model: Model<T>) =>
  async (req: Request, res: Response) => {
    try {
      const query: Record<string, unknown> = {};

      // Build a Mongo query from URL query params like ?firstName=Juan&age=24
      for (const key in req.query) {
        const values = req.query[key];

        if (!values || Array.isArray(values)) continue;

        const trimmed = String(values).trim();

        const isNumber = /^-?\d+(\.\d+)?$/.test(trimmed);
        const isBoolean = trimmed === "true" || trimmed === "false";

        if (isNumber) {
          query[key] = Number(trimmed);
        } else if (isBoolean) {
          query[key] = trimmed === "true";
        } else {
          query[key] = { $regex: trimmed, $options: "i" };
        }
      }

      const result = await model.find(query);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error fetching data", 500);
    }
  };
