import type { ReturnModelType } from '@typegoose/typegoose';
import { IceContactModel } from './ice-contact.model.js';

export type SaveIceContactOptions = {
  id?: string;
  userId: string;
  name: string;
  relation: string;
  phone: string;
  primary?: boolean;
  bloodType?: string;
  allergies?: string;
  notes?: string;
};

export class IceContactRepository {
  constructor(private iceContactModel: ReturnModelType<typeof IceContactModel>) {}

  async listByUser(userId: string): Promise<IceContactModel[]> {
    const contacts = await this.iceContactModel.find({ userId }).sort({ primary: -1 });
    return contacts.map((c) => c.toObject());
  }

  async save(options: SaveIceContactOptions): Promise<IceContactModel> {
    const id = options.id ?? crypto.randomUUID();
    const update = {
      id,
      userId: options.userId,
      name: options.name,
      relation: options.relation,
      phone: options.phone,
      primary: options.primary ?? false,
      bloodType: options.bloodType,
      allergies: options.allergies,
      notes: options.notes,
    };
    const saved = await this.iceContactModel.findOneAndUpdate(
      { id },
      update,
      { upsert: true, new: true }
    );
    return saved.toObject();
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.iceContactModel.deleteOne({ id });
    return res.deletedCount > 0;
  }
}
