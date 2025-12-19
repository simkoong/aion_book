import { supabase } from '../lib/supabaseClient';

export const fetchBooks = async (year) => {
    let query = supabase
        .from('books')
        .select('*')
        .order('month', { ascending: true });

    if (year) {
        query = query.eq('year', year);
    }

    const { data, error } = await query;

    if (error) {
        throw error;
    }
    return data;
};

export const fetchBookById = async (id) => {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw error;
    }
    return data;
};
