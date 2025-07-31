import Joi from "joi";

export class SchemaValidation {
  async bodySchemaValidation(body) {
    const expectedSchema = Joi.object({
      status: Joi.string().valid("Success").required(),
      message: Joi.string().required(),
      user: Joi.object({
        id: Joi.number().integer().required(),
        username: Joi.string().max(255).required(),
        email: Joi.string().email().required(),
        email_verified_at: Joi.date().allow(null).optional(),
        password: Joi.string().min(6).max(255).required(),
        created_at: Joi.date().iso().required(),
        updated_at: Joi.date().iso().required(),
      }).required(),
      auth: Joi.object({
        token: Joi.string().required(),
        type: Joi.string().valid("Bearer").required(),
      }).required(),
    });
    const result = await expectedSchema.validateAsync(body);
    if (result.error) {
      return false;
    } else {
      return true;
    }
  }
}
