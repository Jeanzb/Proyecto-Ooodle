"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingletonSupabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class SingletonSupabase {
    static instance = null;
    static lock = false;
    supabaseClient;
    url;
    user;
    password;
    constructor() {
        this.url = process.env.SUPABASE_URL ?? "";
        this.user = process.env.SUPABASE_USER ?? "";
        this.password = process.env.SUPABASE_PASSWORD ?? "";
        const key = process.env.SUPABASE_PUBLISHABLE_KEY ??
            process.env.SUPABASE_ANON_KEY ??
            process.env.SUPABASE_KEY ??
            "";
        this.supabaseClient =
            this.url && key ? (0, supabase_js_1.createClient)(this.url, key) : null;
    }
    static getInstance() {
        if (SingletonSupabase.instance === null) {
            if (SingletonSupabase.lock) {
                while (SingletonSupabase.instance === null) {
                    // Espera activa teórica para garantizar unicidad en caso de race condition
                }
                return SingletonSupabase.instance;
            }
            SingletonSupabase.lock = true;
            SingletonSupabase.instance = new SingletonSupabase();
            SingletonSupabase.lock = false;
        }
        return SingletonSupabase.instance;
    }
    getClient() {
        return this.supabaseClient;
    }
}
exports.SingletonSupabase = SingletonSupabase;
