import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import type { BackendServerDefinition } from '@bitdev/symphony.backends.backend-server';
import type { MototrackPlatformConfig } from './mototrack-platform-config.js';
import { mototrackPlatformGqlSchema } from './mototrack-platform.graphql.js';
import { UserRepository, type CreateUserProps } from './user-repository.js';
import { UserModel, userModelMock } from './user.model.js';

type AuthPayload = {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string;
    country: string;
    language: string;
    primaryBikeId?: string;
    level: number;
    points: number;
    role: string;
  };
};

function toUserDto(user: UserModel): AuthPayload['user'] {
  return {
    id: user.userId,
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    country: user.country,
    language: user.language,
    primaryBikeId: user.primaryBikeId,
    level: user.level,
    points: user.points,
    role: user.role,
  };
}

export class MototrackPlatformNode {
  constructor(
    private config: MototrackPlatformConfig,
    private userRepository: UserRepository,
    private symphonyPlatform: SymphonyPlatformNode
  ) {}

  /**
   * register a backend service to the mototrack platform.
   */
  registerBackendServer(backendServers: BackendServerDefinition[]) {
    this.symphonyPlatform.registerBackendServer(backendServers);
    return this;
  }

  /**
   * Register a callback to run after all aspects are started.
   * Delegates to symphonyPlatform.registerOnStart.
   */
  registerOnStart(fn: () => Promise<void | undefined | null>) {
    this.symphonyPlatform.registerOnStart(fn);
    return this;
  }

  private signToken(userId: string): string {
    const secret = this.config.sessionSecretKey ?? 'mototrack-secret';
    return jwt.sign({ userId }, secret, { expiresIn: '30d' });
  }

  private verifyToken(token: string): string | undefined {
    const secret = this.config.sessionSecretKey ?? 'mototrack-secret';
    try {
      const decoded = jwt.verify(token, secret) as { userId?: string };
      return decoded?.userId;
    } catch {
      return undefined;
    }
  }

  /**
   * authenticate a user with email and password.
   */
  async login(email: string, password: string): Promise<AuthPayload | null> {
    const user = await this.userRepository.login(email, password);
    if (!user) return null;
    const token = this.signToken(user.userId);
    return { token, user: toUserDto(user) };
  }

  /**
   * sign up a new user.
   */
  async signup(input: CreateUserProps): Promise<AuthPayload> {
    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail) throw new Error('Email already in use');
    const existingUsername = await this.userRepository.findByUsername(
      input.username
    );
    if (existingUsername) throw new Error('Username already taken');

    const user = await this.userRepository.createUser(input);
    const token = this.signToken(user.userId);
    return { token, user: toUserDto(user) };
  }

  /**
   * resolve the current user from a signed JWT.
   */
  async getUserFromToken(
    token: string
  ): Promise<AuthPayload['user'] | undefined> {
    if (!token) return undefined;
    const userId = this.verifyToken(token);
    if (!userId) return undefined;
    const user = await this.userRepository.findById(userId);
    if (!user) return undefined;
    return toUserDto(user);
  }

  /**
   * stateless JWT logout — clients should discard the token.
   */
  async logout(_token: string): Promise<void> {
    return undefined;
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: MototrackPlatformConfig = {
    mongoUrl: process.env.MONGO_URL,
    sessionSecretKey: process.env.SESSION_SECRET_KEY ?? 'SESSION_SECRET',
  };

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    config: MototrackPlatformConfig
  ) {
    if (config.mongoUrl) {
      await mongoose.connect(config.mongoUrl);
    }

    const userModel = getModelForClass(UserModel);
    const userRepository = new UserRepository(userModel);

    const platform = new MototrackPlatformNode(
      config,
      userRepository,
      symphonyPlatform
    );

    const gqlSchema = mototrackPlatformGqlSchema(platform);

    symphonyPlatform.registerMiddlewares([
      bodyParser.urlencoded({ extended: true }),
      session({
        store: config.mongoUrl
          ? MongoStore.create({ mongoUrl: config.mongoUrl })
          : undefined,
        secret: config.sessionSecretKey ?? 'SESSION_SECRET',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto', sameSite: true },
      }),
    ]);

    symphonyPlatform.registerOnStart(async () => {
      if (config.mongoUrl && mongoose.connection.readyState === 0) {
        await mongoose.connect(config.mongoUrl);
      }
      const existing = await userModel.find().limit(1);
      if (existing.length > 0) return undefined;
      await userModel.insertMany(userModelMock);
      return undefined;
    });

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    return platform;
  }
}

export default MototrackPlatformNode;
