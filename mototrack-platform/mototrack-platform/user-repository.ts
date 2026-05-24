import bcrypt from 'bcryptjs';
import type { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from './user.model.js';

export type CreateUserProps = {
  email: string;
  username: string;
  displayName: string;
  password: string;
  country: string;
  language?: string;
};

export class UserRepository {
  constructor(private userModel: ReturnModelType<typeof UserModel>) {}

  /**
   * create a new user with a hashed password.
   */
  async createUser(options: CreateUserProps): Promise<UserModel> {
    const userId = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(options.password, 10);
    const user = await this.userModel.create({
      userId,
      email: options.email,
      username: options.username,
      displayName: options.displayName,
      password: passwordHash,
      country: options.country,
      language: options.language ?? 'sl',
      level: 1,
      points: 0,
      role: 'rider',
    });

    return user.toObject();
  }

  /**
   * login by email + password. Returns the user when credentials match.
   */
  async login(email: string, password: string): Promise<UserModel | undefined> {
    if (!email || !password) return undefined;
    const user = await this.userModel.findOne({ email });
    if (!user) return undefined;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return undefined;
    return user.toObject();
  }

  /**
   * find a user by id.
   */
  async findById(userId: string): Promise<UserModel | undefined> {
    const user = await this.userModel.findOne({ userId });
    return user?.toObject();
  }

  /**
   * find a user by email.
   */
  async findByEmail(email: string): Promise<UserModel | undefined> {
    const user = await this.userModel.findOne({ email });
    return user?.toObject();
  }

  /**
   * find a user by username.
   */
  async findByUsername(username: string): Promise<UserModel | undefined> {
    const user = await this.userModel.findOne({ username });
    return user?.toObject();
  }
}
