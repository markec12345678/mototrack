import { prop } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

export class UserModel {
  @prop({ required: true, unique: true, type: String })
  public userId!: string;

  @prop({ required: true, unique: true, type: String })
  public username!: string;

  @prop({ required: true, unique: true, type: String })
  public email!: string;

  @prop({ required: true, type: String })
  public displayName!: string;

  @prop({ required: true, type: String })
  public password!: string;

  @prop({ required: true, type: String, default: 'SI' })
  public country!: string;

  @prop({ required: true, type: String, default: 'sl' })
  public language!: string;

  @prop({ type: String })
  public primaryBikeId?: string;

  @prop({ required: true, type: Number, default: 1 })
  public level!: number;

  @prop({ required: true, type: Number, default: 0 })
  public points!: number;

  @prop({ required: true, type: String, default: 'rider' })
  public role!: string;
}

export const userModelMock = [
  {
    userId: '1',
    username: 'markec',
    email: 'markec@mototrack.app',
    displayName: 'Markec',
    password: bcrypt.hashSync('motorider2025', 10),
    country: 'SI',
    language: 'sl',
    level: 8,
    points: 5430,
    role: 'admin',
  },
];
