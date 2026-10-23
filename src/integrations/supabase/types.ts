export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: string | null
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          cep: string | null
          city: string | null
          code: string
          consent_marketing: boolean
          consent_privacy: boolean
          created_at: string
          email: string | null
          full_name: string
          id: string
          neighborhood: string | null
          notes: string | null
          preferences: string[]
          relationship_status: string
          source: string | null
          state: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          cep?: string | null
          city?: string | null
          code?: string
          consent_marketing?: boolean
          consent_privacy?: boolean
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          neighborhood?: string | null
          notes?: string | null
          preferences?: string[]
          relationship_status?: string
          source?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          cep?: string | null
          city?: string | null
          code?: string
          consent_marketing?: boolean
          consent_privacy?: boolean
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          neighborhood?: string | null
          notes?: string | null
          preferences?: string[]
          relationship_status?: string
          source?: string | null
          state?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          address: string | null
          created_at: string
          delivered_at: string | null
          delivered_by: string | null
          expected_date: string | null
          id: string
          method: string | null
          notes: string | null
          order_id: string
          prepared_by: string | null
          status: string
          tracking_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          delivered_at?: string | null
          delivered_by?: string | null
          expected_date?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          order_id: string
          prepared_by?: string | null
          status?: string
          tracking_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          delivered_at?: string | null
          delivered_by?: string | null
          expected_date?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          order_id?: string
          prepared_by?: string | null
          status?: string
          tracking_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_events: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          delivery_id: string
          id: string
          kind: string
          status: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          delivery_id: string
          id?: string
          kind?: string
          status?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          delivery_id?: string
          id?: string
          kind?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_events_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "deliveries"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_interactions: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          customer_id: string | null
          id: string
          kind: string
          lead_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          id?: string
          kind?: string
          lead_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          id?: string
          kind?: string
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          assigned_to: string | null
          budget: number | null
          cep: string | null
          city: string
          code: string
          consent_marketing: boolean
          consent_privacy: boolean
          contact_notes: string | null
          converted_at: string | null
          created_at: string
          customer_id: string | null
          email: string
          frequency: string | null
          full_name: string
          id: string
          lost_reason: string | null
          neighborhood: string | null
          next_action: string | null
          next_contact_at: string | null
          plan_notes: string | null
          preference_notes: string | null
          preferences: string[]
          presentation: string | null
          quantity: string | null
          source: string
          state: string
          status: string
          submission_key: string
          surprise_me: boolean
          updated_at: string
          whatsapp: string
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          budget?: number | null
          cep?: string | null
          city: string
          code?: string
          consent_marketing?: boolean
          consent_privacy: boolean
          contact_notes?: string | null
          converted_at?: string | null
          created_at?: string
          customer_id?: string | null
          email: string
          frequency?: string | null
          full_name: string
          id?: string
          lost_reason?: string | null
          neighborhood?: string | null
          next_action?: string | null
          next_contact_at?: string | null
          plan_notes?: string | null
          preference_notes?: string | null
          preferences?: string[]
          presentation?: string | null
          quantity?: string | null
          source?: string
          state: string
          status?: string
          submission_key: string
          surprise_me?: boolean
          updated_at?: string
          whatsapp: string
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          budget?: number | null
          cep?: string | null
          city?: string
          code?: string
          consent_marketing?: boolean
          consent_privacy?: boolean
          contact_notes?: string | null
          converted_at?: string | null
          created_at?: string
          customer_id?: string | null
          email?: string
          frequency?: string | null
          full_name?: string
          id?: string
          lost_reason?: string | null
          neighborhood?: string | null
          next_action?: string | null
          next_contact_at?: string | null
          plan_notes?: string | null
          preference_notes?: string | null
          preferences?: string[]
          presentation?: string | null
          quantity?: string | null
          source?: string
          state?: string
          status?: string
          submission_key?: string
          surprise_me?: boolean
          updated_at?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          attempts: number
          created_at: string
          dedupe_key: string | null
          error_detail: string | null
          id: string
          kind: string
          provider_message_id: string | null
          recipient: string
          related_id: string | null
          related_table: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          dedupe_key?: string | null
          error_detail?: string | null
          id?: string
          kind: string
          provider_message_id?: string | null
          recipient: string
          related_id?: string | null
          related_table?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          dedupe_key?: string | null
          error_detail?: string | null
          id?: string
          kind?: string
          provider_message_id?: string | null
          recipient?: string
          related_id?: string | null
          related_table?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          description: string
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          order_id: string
          product_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          code: string
          created_at: string
          customer_id: string
          discount_amount: number
          id: string
          lead_id: string | null
          next_renewal_date: string | null
          notes: string | null
          order_date: string
          paid_at: string | null
          payment_method: string | null
          payment_status: string
          products_amount: number
          shipping_amount: number
          status: string
          subscription_id: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          code?: string
          created_at?: string
          customer_id: string
          discount_amount?: number
          id?: string
          lead_id?: string | null
          next_renewal_date?: string | null
          notes?: string | null
          order_date?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string
          products_amount?: number
          shipping_amount?: number
          status?: string
          subscription_id?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          customer_id?: string
          discount_amount?: number
          id?: string
          lead_id?: string | null
          next_renewal_date?: string | null
          notes?: string | null
          order_date?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string
          products_amount?: number
          shipping_amount?: number
          status?: string
          subscription_id?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          external_ref: string | null
          id: string
          method: string | null
          notes: string | null
          order_id: string
          paid_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          external_ref?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          order_id: string
          paid_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          external_ref?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          order_id?: string
          paid_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_templates: {
        Row: {
          active: boolean
          budget_max: number | null
          budget_min: number | null
          created_at: string
          description: string | null
          frequency: string | null
          id: string
          is_demo: boolean
          name: string
          suggested_quantity: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          is_demo?: boolean
          name: string
          suggested_quantity?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          suggested_quantity?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          is_demo: boolean
          name: string
          show_in_form: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          name: string
          show_in_form?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          is_demo?: boolean
          name?: string
          show_in_form?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          availability: string
          brand: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          ingredients_notes: string | null
          is_demo: boolean
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          availability?: string
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients_notes?: string | null
          is_demo?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          availability?: string
          brand?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients_notes?: string | null
          is_demo?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      renewal_tasks: {
        Row: {
          auto_created: boolean
          created_at: string
          customer_id: string
          cycle_date: string
          id: string
          kind: string
          last_contact_at: string | null
          next_action: string | null
          notes: string | null
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          auto_created?: boolean
          created_at?: string
          customer_id: string
          cycle_date: string
          id?: string
          kind?: string
          last_contact_at?: string | null
          next_action?: string | null
          notes?: string | null
          status?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          auto_created?: boolean
          created_at?: string
          customer_id?: string
          cycle_date?: string
          id?: string
          kind?: string
          last_contact_at?: string | null
          next_action?: string | null
          notes?: string | null
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renewal_tasks_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renewal_tasks_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          agreed_amount: number | null
          commercial_notes: string | null
          created_at: string
          customer_id: string
          delivery_terms: string | null
          end_date: string | null
          external_payment_ref: string | null
          frequency: string | null
          id: string
          lead_id: string | null
          next_cycle_date: string | null
          plan_name: string | null
          plan_template_id: string | null
          preferences: string[]
          quantity: string | null
          start_date: string | null
          status: string
          status_reason: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          agreed_amount?: number | null
          commercial_notes?: string | null
          created_at?: string
          customer_id: string
          delivery_terms?: string | null
          end_date?: string | null
          external_payment_ref?: string | null
          frequency?: string | null
          id?: string
          lead_id?: string | null
          next_cycle_date?: string | null
          plan_name?: string | null
          plan_template_id?: string | null
          preferences?: string[]
          quantity?: string | null
          start_date?: string | null
          status?: string
          status_reason?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          agreed_amount?: number | null
          commercial_notes?: string | null
          created_at?: string
          customer_id?: string
          delivery_terms?: string | null
          end_date?: string | null
          external_payment_ref?: string | null
          frequency?: string | null
          id?: string
          lead_id?: string | null
          next_cycle_date?: string | null
          plan_name?: string | null
          plan_template_id?: string | null
          preferences?: string[]
          quantity?: string | null
          start_date?: string | null
          status?: string
          status_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_template_id_fkey"
            columns: ["plan_template_id"]
            isOneToOne: false
            referencedRelation: "plan_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const
