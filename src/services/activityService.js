import { supabase } from '../lib/supabaseClient';

export const fetchActivities = async (category = 'all', limit = null) => {
    let query = supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

    if (category !== 'all') {
        if (category === 'discussion') {
            query = query.in('category', ['discussion', 'question']);
        } else {
            query = query.eq('category', category);
        }
    }

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
        throw error;
    }
    return data;
};

export const createActivity = async (activityData) => {
    const { data, error } = await supabase
        .from('activities')
        .insert([activityData])
        .select()
        .single();

    if (error) {
        throw error;
    }
    return data;
};


export const fetchBookActivities = async (bookId, category) => {
    let query = supabase
        .from('activities')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
        throw error;
    }
    return data;
};

export const deleteActivity = async (id, passwordHash) => {
    const { count, error } = await supabase
        .from('activities')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('password', passwordHash);

    if (error) {
        throw error;
    }
    return count > 0;
};
