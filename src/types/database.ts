export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          query?: string
          operationName?: string
          extensions?: Json
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      batch_templates: {
        Row: {
          created_at: string | null
          name: string
          notes: string | null
          recipeid: string
          scalefactor: number | null
          templateid: string
        }
        Insert: {
          created_at?: string | null
          name: string
          notes?: string | null
          recipeid: string
          scalefactor?: number | null
          templateid?: string
        }
        Update: {
          created_at?: string | null
          name?: string
          notes?: string | null
          recipeid?: string
          scalefactor?: number | null
          templateid?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_templates_recipeid_fkey"
            columns: ["recipeid"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipeid"]
          },
        ]
      }
      batches: {
        Row: {
          actualcost: number
          batchid: string
          costvariance: number | null
          created_at: string | null
          datecreated: string
          displayid: string
          effectivedate: string
          expirydate: string | null
          laborcost: number | null
          materialcost: number
          notes: string | null
          qtymade: number
          recipeid: string
          yieldpercentage: number | null
        }
        Insert: {
          actualcost: number
          batchid?: string
          costvariance?: number | null
          created_at?: string | null
          datecreated: string
          displayid: string
          effectivedate: string
          expirydate?: string | null
          laborcost?: number | null
          materialcost: number
          notes?: string | null
          qtymade: number
          recipeid: string
          yieldpercentage?: number | null
        }
        Update: {
          actualcost?: number
          batchid?: string
          costvariance?: number | null
          created_at?: string | null
          datecreated?: string
          displayid?: string
          effectivedate?: string
          expirydate?: string | null
          laborcost?: number | null
          materialcost?: number
          notes?: string | null
          qtymade?: number
          recipeid?: string
          yieldpercentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_recipeid_fkey"
            columns: ["recipeid"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipeid"]
          },
        ]
      }
      forecasting_data: {
        Row: {
          calculatedat: string | null
          forecastingid: string
          isautomatic: boolean | null
          itemid: string
          predicteddemand: number
          recommendedreorderpoint: number | null
          seasonalindex: number | null
        }
        Insert: {
          calculatedat?: string | null
          forecastingid?: string
          isautomatic?: boolean | null
          itemid: string
          predicteddemand: number
          recommendedreorderpoint?: number | null
          seasonalindex?: number | null
        }
        Update: {
          calculatedat?: string | null
          forecastingid?: string
          isautomatic?: boolean | null
          itemid?: string
          predicteddemand?: number
          recommendedreorderpoint?: number | null
          seasonalindex?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forecasting_data_itemid_fkey"
            columns: ["itemid"]
            isOneToOne: true
            referencedRelation: "items"
            referencedColumns: ["itemid"]
          },
        ]
      }
      items: {
        Row: {
          created_at: string | null
          currentquantity: number | null
          inventoryunit: Database["public"]["Enums"]["inventory_unit"]
          isarchived: boolean | null
          itemid: string
          lastcounteddate: string | null
          leadtimedays: number | null
          name: string
          primarysupplierid: string | null
          reorderpoint: number | null
          sku: string
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string | null
          weightedaveragecost: number | null
        }
        Insert: {
          created_at?: string | null
          currentquantity?: number | null
          inventoryunit: Database["public"]["Enums"]["inventory_unit"]
          isarchived?: boolean | null
          itemid?: string
          lastcounteddate?: string | null
          leadtimedays?: number | null
          name: string
          primarysupplierid?: string | null
          reorderpoint?: number | null
          sku: string
          type: Database["public"]["Enums"]["item_type"]
          updated_at?: string | null
          weightedaveragecost?: number | null
        }
        Update: {
          created_at?: string | null
          currentquantity?: number | null
          inventoryunit?: Database["public"]["Enums"]["inventory_unit"]
          isarchived?: boolean | null
          itemid?: string
          lastcounteddate?: string | null
          leadtimedays?: number | null
          name?: string
          primarysupplierid?: string | null
          reorderpoint?: number | null
          sku?: string
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string | null
          weightedaveragecost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_primarysupplierid_fkey"
            columns: ["primarysupplierid"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplierid"]
          },
        ]
      }
      purchase_line_items: {
        Row: {
          itemid: string
          lineitemid: string
          notes: string | null
          purchaseid: string
          quantity: number
          totalcost: number
          unitcost: number
        }
        Insert: {
          itemid: string
          lineitemid?: string
          notes?: string | null
          purchaseid: string
          quantity: number
          totalcost: number
          unitcost: number
        }
        Update: {
          itemid?: string
          lineitemid?: string
          notes?: string | null
          purchaseid?: string
          quantity?: number
          totalcost?: number
          unitcost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_line_items_itemid_fkey"
            columns: ["itemid"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["itemid"]
          },
          {
            foreignKeyName: "purchase_line_items_purchaseid_fkey"
            columns: ["purchaseid"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["purchaseid"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string | null
          displayid: string
          effectivedate: string
          grandtotal: number
          isdraft: boolean | null
          notes: string | null
          othercosts: number | null
          purchasedate: string
          purchaseid: string
          shipping: number | null
          supplierid: string
          taxes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          displayid: string
          effectivedate: string
          grandtotal: number
          isdraft?: boolean | null
          notes?: string | null
          othercosts?: number | null
          purchasedate: string
          purchaseid?: string
          shipping?: number | null
          supplierid: string
          taxes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          displayid?: string
          effectivedate?: string
          grandtotal?: number
          isdraft?: boolean | null
          notes?: string | null
          othercosts?: number | null
          purchasedate?: string
          purchaseid?: string
          shipping?: number | null
          supplierid?: string
          taxes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_supplierid_fkey"
            columns: ["supplierid"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplierid"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          ingredientid: string
          itemid: string
          notes: string | null
          quantity: number
          recipeid: string
        }
        Insert: {
          ingredientid?: string
          itemid: string
          notes?: string | null
          quantity: number
          recipeid: string
        }
        Update: {
          ingredientid?: string
          itemid?: string
          notes?: string | null
          quantity?: number
          recipeid?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_itemid_fkey"
            columns: ["itemid"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["itemid"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipeid_fkey"
            columns: ["recipeid"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["recipeid"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string | null
          displayversion: string
          expectedyield: number
          isarchived: boolean | null
          laborminutes: number | null
          name: string
          outputproductid: string
          projectedmaterialcost: number | null
          recipeid: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          displayversion: string
          expectedyield: number
          isarchived?: boolean | null
          laborminutes?: number | null
          name: string
          outputproductid: string
          projectedmaterialcost?: number | null
          recipeid?: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          displayversion?: string
          expectedyield?: number
          isarchived?: boolean | null
          laborminutes?: number | null
          name?: string
          outputproductid?: string
          projectedmaterialcost?: number | null
          recipeid?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_outputproductid_fkey"
            columns: ["outputproductid"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["itemid"]
          },
        ]
      }
      sales_periods: {
        Row: {
          channel: Database["public"]["Enums"]["sales_channel"]
          created_at: string | null
          datasource: Database["public"]["Enums"]["data_source"] | null
          displayid: string
          itemid: string
          periodend: string
          periodstart: string
          quantitysold: number
          revenue: number | null
          salesperiodid: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["sales_channel"]
          created_at?: string | null
          datasource?: Database["public"]["Enums"]["data_source"] | null
          displayid: string
          itemid: string
          periodend: string
          periodstart: string
          quantitysold: number
          revenue?: number | null
          salesperiodid?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["sales_channel"]
          created_at?: string | null
          datasource?: Database["public"]["Enums"]["data_source"] | null
          displayid?: string
          itemid?: string
          periodend?: string
          periodstart?: string
          quantitysold?: number
          revenue?: number | null
          salesperiodid?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_periods_itemid_fkey"
            columns: ["itemid"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["itemid"]
          },
        ]
      }
      suppliers: {
        Row: {
          created_at: string | null
          isarchived: boolean | null
          name: string
          phone: string | null
          storeurl: string | null
          supplierid: string
        }
        Insert: {
          created_at?: string | null
          isarchived?: boolean | null
          name: string
          phone?: string | null
          storeurl?: string | null
          supplierid?: string
        }
        Update: {
          created_at?: string | null
          isarchived?: boolean | null
          name?: string
          phone?: string | null
          storeurl?: string | null
          supplierid?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string | null
          effectivedate: string
          itemid: string
          notes: string | null
          quantity: number
          referenceid: string | null
          referencetype: string | null
          transactionid: string
          transactiontype: Database["public"]["Enums"]["transaction_type"]
          unitcost: number | null
        }
        Insert: {
          created_at?: string | null
          effectivedate: string
          itemid: string
          notes?: string | null
          quantity: number
          referenceid?: string | null
          referencetype?: string | null
          transactionid?: string
          transactiontype: Database["public"]["Enums"]["transaction_type"]
          unitcost?: number | null
        }
        Update: {
          created_at?: string | null
          effectivedate?: string
          itemid?: string
          notes?: string | null
          quantity?: number
          referenceid?: string | null
          referencetype?: string | null
          transactionid?: string
          transactiontype?: Database["public"]["Enums"]["transaction_type"]
          unitcost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_itemid_fkey"
            columns: ["itemid"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["itemid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_wac: {
        Args: { item_id: string }
        Returns: number
      }
      get_cycle_count_alerts: {
        Args: { limit_count?: number }
        Returns: {
          itemid: string
          sku: string
          name: string
          currentquantity: number
          priorityscore: number
          reorderpoint: number
          alerttype: string
        }[]
      }

      update_item_quantity_atomic: {
        Args: { item_id: string; quantity_change: number }
        Returns: {
          new_quantity: number
          transaction_id: string
        }[]
      }
    }
    Enums: {
      data_source: "manual" | "imported"
      inventory_unit:
        | "each"
        | "lb"
        | "oz"
        | "kg"
        | "g"
        | "gal"
        | "qt"
        | "pt"
        | "cup"
        | "fl_oz"
        | "ml"
        | "l"
      item_type: "ingredient" | "packaging" | "product"
      sales_channel: "qbo" | "bigcommerce"
      transaction_type:
        | "purchase"
        | "sale"
        | "adjustment"
        | "batch_consumption"
        | "batch_production"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      data_source: ["manual", "imported"],
      inventory_unit: [
        "each",
        "lb",
        "oz",
        "kg",
        "g",
        "gal",
        "qt",
        "pt",
        "cup",
        "fl_oz",
        "ml",
        "l",
      ],
      item_type: ["ingredient", "packaging", "product"],
      sales_channel: ["qbo", "bigcommerce"],
      transaction_type: [
        "purchase",
        "sale",
        "adjustment",
        "batch_consumption",
        "batch_production",
      ],
    },
  },
} as const

