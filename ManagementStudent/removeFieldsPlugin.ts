import { Schema } from 'mongoose';

const removeFieldsPlugin = (schema: Schema, fields: string[]) => {
  schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      fields.forEach(field => delete ret[field]);
      return ret;
    }
  });
};

export default removeFieldsPlugin;
