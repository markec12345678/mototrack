import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { IceContact } from '@markec/safety.entities.ice-contact';

// ─── GraphQL Documents ────────────────────────────────────────────────────────

const LIST_ICE_CONTACTS_QUERY = gql`
  query ListIceContacts {
    listIceContacts {
      id
      userId
      name
      relation
      phone
      primary
      bloodType
      allergies
      notes
    }
  }
`;

const SAVE_ICE_CONTACT_MUTATION = gql`
  mutation SaveIceContact($options: SaveIceContactOptions!) {
    saveIceContact(options: $options) {
      id
      userId
      name
      relation
      phone
      primary
      bloodType
      allergies
      notes
    }
  }
`;

const DELETE_ICE_CONTACT_MUTATION = gql`
  mutation DeleteIceContact($id: String!) {
    deleteIceContact(id: $id)
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Input for creating or updating an ICE contact.
 * Provide `id` to update an existing contact; omit it to create a new one.
 */
export type SaveIceContactInput = {
  /** Existing contact ID — omit to create a new contact. */
  id?: string;
  /** Full name of the emergency contact. */
  name: string;
  /** Relationship to the rider (e.g. "Spouse", "Parent"). */
  relation: string;
  /** Phone number including country code. */
  phone: string;
  /** Whether this is the primary emergency contact. */
  primary?: boolean;
  /** Rider's blood type (e.g. "A+"). */
  bloodType?: string;
  /** Known allergies. */
  allergies?: string;
  /** Additional medical or personal notes. */
  notes?: string;
};

/**
 * Plain shape returned by the GraphQL API.
 * @internal
 */
type PlainIceContact = {
  id: string;
  userId: string;
  name: string;
  relation: string;
  phone: string;
  primary: boolean;
  bloodType?: string;
  allergies?: string;
  notes?: string;
};

/**
 * Options accepted by the useIceContacts hook.
 */
export type UseIceContactsOptions = {
  /**
   * Provide mock data to bypass the GraphQL query.
   * When set, the hook returns this data immediately without hitting the network.
   */
  mockData?: IceContact[];
};

/**
 * Return value of the useIceContacts hook.
 */
export type UseIceContactsResult = {
  /** The list of ICE contacts for the current user. */
  contacts: IceContact[];
  /** True while the list query is in flight. */
  loading: boolean;
  /** Error from the list query, if any. */
  error: Error | undefined;
  /** Re-fetch the contact list from the server. */
  refetch: () => void;
  /**
   * Persist a new or updated ICE contact.
   * @param input - Contact fields to save.
   * @returns The saved IceContact entity.
   */
  save: (input: SaveIceContactInput) => Promise<IceContact>;
  /** Loading state for the save mutation. */
  saving: boolean;
  /**
   * Delete an ICE contact by its ID.
   * @param id - The contact ID to remove.
   */
  remove: (id: string) => Promise<void>;
  /** Loading state for the delete mutation. */
  removing: boolean;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages In-Case-of-Emergency (ICE) contacts for the current rider.
 *
 * Provides a reactive list of contacts backed by GraphQL, plus `save` and
 * `remove` mutations. Pass `mockData` in options to bypass the network for
 * testing or Storybook-style previews.
 *
 * @param options - Optional configuration including mock data.
 * @returns Contacts list, loading/error states, and mutation helpers.
 */
export function useIceContacts(options?: UseIceContactsOptions): UseIceContactsResult {
  const isMocked = Boolean(options?.mockData);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<{ listIceContacts: PlainIceContact[] }>(LIST_ICE_CONTACTS_QUERY, {
    skip: isMocked,
  });

  const contacts = useMemo<IceContact[]>(() => {
    if (isMocked) return options?.mockData ?? [];
    return (data?.listIceContacts ?? []).map((plain) => IceContact.from(plain));
  }, [data, isMocked, options?.mockData]);

  const [saveMutation, { loading: saving }] = useMutation<
    { saveIceContact: PlainIceContact },
    { options: SaveIceContactInput }
  >(SAVE_ICE_CONTACT_MUTATION);

  const [deleteMutation, { loading: removing }] = useMutation<
    { deleteIceContact: boolean },
    { id: string }
  >(DELETE_ICE_CONTACT_MUTATION);

  const save = async (input: SaveIceContactInput): Promise<IceContact> => {
    const result = await saveMutation({ variables: { options: input } });
    const plain = result.data?.saveIceContact;
    if (!plain) throw new Error('saveIceContact returned no data');
    return IceContact.from(plain);
  };

  const remove = async (id: string): Promise<void> => {
    await deleteMutation({ variables: { id } });
  };

  return {
    contacts,
    loading: isMocked ? false : loading,
    error: isMocked ? undefined : error,
    refetch,
    save,
    saving,
    remove,
    removing,
  };
}
