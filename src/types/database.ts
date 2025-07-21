export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      purchase_line_items: {
        Row: {
          itemid: string;
          lineitemid: string;
          notes: string | null;
          purchaseid: string;
          quantity: number;
          totalcost: number;
          unitcost: number;
        };
        Insert: {
          itemid: string;
          lineitemid?: string;
          notes?: string | null;
          purchaseid: string;
          quantity: number;
          totalcost: number;
          unitcost: number;
        };
        Update: {
          itemid?: string;
          lineitemid?: string;
          notes?: string | null;
          purchaseid?: string;
          quantity?: number;
          totalcost?: number;
          unitcost?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'purchase_line_items_itemid_fkey';
            columns: ['itemid'];
            isOneToOne: false;
            referencedRelation: 'items';
            referencedColumns: ['itemid'];
          },
          {
            foreignKeyName: 'purchase_line_items_purchaseid_fkey';
            columns: ['purchaseid'];
            isOneToOne: false;
            referencedRelation: 'purchases';
            referencedColumns: ['purchaseid'];
          },
        ];
      };
      purchases: {
        Row: {
          created_at: string | null;
          displayid: string;
          effectivedate: string;
          isdraft: boolean | null;
          notes: string | null;
          othercosts: number | null;
          purchasedate: string;
          purchaseid: string;
          shipping: number | null;
          supplierid: string;
          taxes: number | null;
          total: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          displayid: string;
          effectivedate: string;
          isdraft?: boolean | null;
          notes?: string | null;
          othercosts?: number | null;
          purchasedate: string;
          purchaseid?: string;
          shipping?: number | null;
          supplierid: string;
          taxes?: number | null;
          total: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          displayid?: string;
          effectivedate?: string;
          isdraft?: boolean | null;
          notes?: string | null;
          othercosts?: number | null;
          purchasedate?: string;
          purchaseid?: string;
          shipping?: number | null;
          supplierid?: string;
          taxes?: number | null;
          total?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'purchases_supplierid_fkey';
            columns: ['supplierid'];
            isOneToOne: false;
            referencedRelation: 'suppliers';
            referencedColumns: ['supplierid'];
          },
        ];
      };
      items: {
        Row: {
          created_at: string | null;
          currentquantity: number | null;
          inventoryunit: Database['public']['Enums']['inventory_unit'];
          isarchived: boolean | null;
          itemid: string;
          lastcounteddate: string | null;
          leadtimedays: number | null;
          name: string;
          primarysupplierid: string | null;
          reorderpoint: number | null;
          sku: string;
          type: Database['public']['Enums']['item_type'];
          updated_at: string | null;
          weightedaveragecost: number | null;
        };
        Insert: {
          created_at?: string | null;
          currentquantity?: number | null;
          inventoryunit: Database['public']['Enums']['inventory_unit'];
          isarchived?: boolean | null;
          itemid?: string;
          lastcounteddate?: string | null;
          leadtimedays?: number | null;
          name: string;
          primarysupplierid?: string | null;
          reorderpoint?: number | null;
          sku: string;
          type: Database['public']['Enums']['item_type'];
          updated_at?: string | null;
          weightedaveragecost?: number | null;
        };
        Update: {
          created_at?: string | null;
          currentquantity?: number | null;
          inventoryunit?: Database['public']['Enums']['inventory_unit'];
          isarchived?: boolean | null;
          itemid?: string;
          lastcounteddate?: string | null;
          leadtimedays?: number | null;
          name?: string;
          primarysupplierid?: string | null;
          reorderpoint?: number | null;
          sku?: string;
          type?: Database['public']['Enums']['item_type'];
          updated_at?: string | null;
          weightedaveragecost?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'items_primarysupplierid_fkey';
            columns: ['primarysupplierid'];
            isOneToOne: false;
            referencedRelation: 'suppliers';
            referencedColumns: ['supplierid'];
          },
        ];
      };
      suppliers: {
        Row: {
          address: string | null;
          contactphone: string | null;
          created_at: string | null;
          isarchived: boolean | null;
          name: string;
          notes: string | null;
          supplierid: string;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          contactphone?: string | null;
          created_at?: string | null;
          isarchived?: boolean | null;
          name: string;
          notes?: string | null;
          supplierid?: string;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          contactphone?: string | null;
          created_at?: string | null;
          isarchived?: boolean | null;
          name?: string;
          notes?: string | null;
          supplierid?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          created_at: string | null;
          effectivedate: string;
          itemid: string;
          notes: string | null;
          quantity: number;
          referenceid: string | null;
          referencetype: string | null;
          transactionid: string;
          transactiontype: Database['public']['Enums']['transaction_type'];
          unitcost: number | null;
        };
        Insert: {
          created_at?: string | null;
          effectivedate: string;
          itemid: string;
          notes?: string | null;
          quantity: number;
          referenceid?: string | null;
          referencetype?: string | null;
          transactionid?: string;
          transactiontype: Database['public']['Enums']['transaction_type'];
          unitcost?: number | null;
        };
        Update: {
          created_at?: string | null;
          effectivedate?: string;
          itemid?: string;
          notes?: string | null;
          quantity?: number;
          referenceid?: string | null;
          referencetype?: string | null;
          transactionid?: string;
          transactiontype?: Database['public']['Enums']['transaction_type'];
          unitcost?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_itemid_fkey';
            columns: ['itemid'];
            isOneToOne: false;
            referencedRelation: 'items';
            referencedColumns: ['itemid'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_wac: {
        Args: { item_id: string };
        Returns: number;
      };
      finalize_draft_purchase: {
        Args: { purchase_id: string };
        Returns: Json;
      };
      get_cycle_count_alerts: {
        Args: { limit_count?: number };
        Returns: {
          itemid: string;
          sku: string;
          name: string;
          currentquantity: number;
          reorderpoint: number;
          priorityscore: number;
          alerttype: string;
          shortageamount: number;
        }[];
      };
      get_last_used_suppliers: {
        Args: Record<PropertyKey, never>;
        Returns: {
          itemid: string;
          supplier_name: string;
        }[];
      };
      update_item_quantity_atomic: {
        Args: { item_id: string; quantity_change: number };
        Returns: number;
      };
    };
    Enums: {
      data_source: 'manual' | 'imported';
      inventory_unit:
        | 'each'
        | 'lb'
        | 'oz'
        | 'kg'
        | 'g'
        | 'gal'
        | 'qt'
        | 'pt'
        | 'cup'
        | 'fl_oz'
        | 'ml'
        | 'l';
      item_type: 'ingredient' | 'packaging' | 'product';
      sales_channel: 'qbo' | 'bigcommerce';
      transaction_type:
        | 'purchase'
        | 'sale'
        | 'adjustment'
        | 'batch_consumption'
        | 'batch_production';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;
