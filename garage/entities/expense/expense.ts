/**
 * Expense category type.
 */
export type ExpenseCategory =
  | 'fuel'
  | 'maintenance'
  | 'insurance'
  | 'registration'
  | 'gear'
  | 'accessories'
  | 'repair'
  | 'other';

/**
 * Plain object representation of an Expense.
 */
export type PlainExpense = {
  /**
   * Unique identifier of the expense.
   */
  id: string;

  /**
   * ID of the user who owns this expense.
   */
  userId: string;

  /**
   * Optional ID of the bike this expense is associated with.
   */
  bikeId?: string;

  /**
   * Category of the expense.
   */
  category: ExpenseCategory;

  /**
   * Amount in EUR.
   */
  amountEur: number;

  /**
   * Short label / description of the expense.
   */
  label: string;

  /**
   * Timestamp (ms since epoch) when the expense occurred.
   */
  at: number;

  /**
   * Optional additional notes.
   */
  notes?: string;
};

/**
 * Expense domain entity.
 */
export class Expense {
  constructor(
    /**
     * Unique identifier of the expense.
     */
    readonly id: string,

    /**
     * ID of the user who owns this expense.
     */
    readonly userId: string,

    /**
     * Category of the expense.
     */
    readonly category: ExpenseCategory,

    /**
     * Amount in EUR.
     */
    readonly amountEur: number,

    /**
     * Short label / description of the expense.
     */
    readonly label: string,

    /**
     * Timestamp (ms since epoch) when the expense occurred.
     */
    readonly at: number,

    /**
     * Optional ID of the bike this expense is associated with.
     */
    readonly bikeId?: string,

    /**
     * Optional additional notes.
     */
    readonly notes?: string,
  ) {}

  /**
   * Serialize the Expense into a plain object.
   */
  toObject(): PlainExpense {
    return {
      id: this.id,
      userId: this.userId,
      bikeId: this.bikeId,
      category: this.category,
      amountEur: this.amountEur,
      label: this.label,
      at: this.at,
      notes: this.notes,
    };
  }

  /**
   * Create an Expense instance from a plain object.
   */
  static from(plain: PlainExpense): Expense {
    const {
      id = '',
      userId = '',
      category = 'other',
      amountEur = 0,
      label = '',
      at = 0,
      bikeId,
      notes,
    } = plain;

    return new Expense(
      id,
      userId,
      category as ExpenseCategory,
      amountEur,
      label,
      at,
      bikeId,
      notes,
    );
  }
}
