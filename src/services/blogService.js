import { supabase } from '@/lib/supabase'

export const blogService = {
  async getAllPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching posts:', error)
      throw error
    }

    console.log('Fetched posts:', data)
    return data
  },

  async getPostBySlug(slug) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) throw error
    return data
  },

  async getRelatedPosts(category, currentSlug) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .neq('slug', currentSlug)
      .order('created_at', { ascending: false })
      .limit(2)

    if (error) throw error
    return data
  },

  async likePost(postId) {
    try {
      // First, try to insert a like
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert([
          { 
            post_id: postId,
            user_ip: await this.getUserIP() 
          }
        ]);

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          return { success: false, message: 'Already liked' };
        }
        throw insertError;
      }

      // Then increment the like count
      const { data, error: updateError } = await supabase.rpc('increment_like_count', {
        post_id: postId
      });

      if (updateError) throw updateError;

      return { 
        success: true, 
        newCount: data.like_count 
      };
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  async hasUserLikedPost(postId) {
    try {
      const userIP = await this.getUserIP();
      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_ip', userIP)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  },

  async getUserIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'unknown';
    }
  },

  async getComments(postId) {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        replies:post_comments(*)
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addComment(postId, userName, content, parentId = null) {
    const { data, error } = await supabase
      .from('post_comments')
      .insert([
        {
          post_id: postId,
          user_name: userName,
          content,
          parent_id: parentId
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCommentCount(postId) {
    const { count, error } = await supabase
      .from('post_comments')
      .select('id', { count: 'exact' })
      .eq('post_id', postId);

    if (error) throw error;
    return count || 0;
  }
} 