export type PlainIceContact = {
  /**
   * unique identifier of the contact (same as the document _id).
   */
  id: string;

  /**
   * the user this contact belongs to.
   */
  userId: string;

  /**
   * full name of the emergency contact.
   */
  name: string;

  /**
   * relationship to the user (e.g. "spouse", "parent").
   */
  relation: string;

  /**
   * phone number of the contact.
   */
  phone: string;

  /**
   * whether this is the primary emergency contact.
   */
  primary: boolean;

  /**
   * blood type of the user (optional medical info).
   */
  bloodType?: string;

  /**
   * known allergies of the user (optional medical info).
   */
  allergies?: string;

  /**
   * additional notes (optional).
   */
  notes?: string;
};

export class IceContact {
  constructor(
    /**
     * unique identifier of the contact.
     */
    readonly id: string,

    /**
     * the user this contact belongs to.
     */
    readonly userId: string,

    /**
     * full name of the emergency contact.
     */
    readonly name: string,

    /**
     * relationship to the user.
     */
    readonly relation: string,

    /**
     * phone number of the contact.
     */
    readonly phone: string,

    /**
     * whether this is the primary emergency contact.
     */
    readonly primary: boolean,

    /**
     * blood type of the user (optional).
     */
    readonly bloodType?: string,

    /**
     * known allergies of the user (optional).
     */
    readonly allergies?: string,

    /**
     * additional notes (optional).
     */
    readonly notes?: string,
  ) {}

  /**
   * serialize the IceContact into a plain object.
   */
  toObject(): PlainIceContact {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      relation: this.relation,
      phone: this.phone,
      primary: this.primary,
      bloodType: this.bloodType,
      allergies: this.allergies,
      notes: this.notes,
    };
  }

  /**
   * create an IceContact instance from a plain object.
   */
  static from(plain: PlainIceContact): IceContact {
    const {
      id = '',
      userId = '',
      name = '',
      relation = '',
      phone = '',
      primary = false,
      bloodType,
      allergies,
      notes,
    } = plain;

    return new IceContact(id, userId, name, relation, phone, primary, bloodType, allergies, notes);
  }
}
