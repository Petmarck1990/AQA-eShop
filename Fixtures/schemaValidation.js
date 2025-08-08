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

  async shippingInfoSchemaValidation(body) {
    const expectedSchema = Joi.object({
      status: Joi.string().valid("Success", "Error").required(),
      message: Joi.string().required(),
      shipping_info: Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
        street_and_number: Joi.string().min(1).max(200).required(),
        city: Joi.string().min(1).max(100).required(),
        phone_number: Joi.string().required(),
        postal_code: Joi.number().integer().min(1).max(99999).required(),
        country: Joi.string().required(),
        customer_id: Joi.number().integer().required(),
        updated_at: Joi.date().iso().required(),
        created_at: Joi.date().iso().required(),
        id: Joi.number().integer().required(),
      }).required(),
    });
    const result = await expectedSchema.validateAsync(body);
    if (result.error) {
      return false;
    } else {
      return true;
    }
  }

  async customerSchemaValidation(body) {
    const expectedSchema = Joi.object({
      status: Joi.string().valid("Success", "Error").required(),
      customer: Joi.object({
        id: Joi.number().integer().required(),
        user_id: Joi.number().integer().required(),
        cart_id: Joi.number().integer().allow(null).optional(),
        username: Joi.string().required(),
        first_name: Joi.string().allow(null).optional(),
        last_name: Joi.string().allow(null).optional(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        date_of_birth: Joi.string().allow(null).optional(),
        created_at: Joi.string().required(),
        updated_at: Joi.string().required(),
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
