import { validationResult } from 'express-validator';
import { supabase } from '../config/supabase.js';

// Helper to generate slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-'); // replace multiple - with single -
};

/**
 * @desc    Get all published posts (public feed)
 * @route   GET /api/posts
 * @access  Public
 */
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('posts')
      .select('*, author:profiles(full_name, avatar_url)', { count: 'exact' })
      .eq('status', 'published')
      .eq('isDeleted', false)
      .order('createdAt', { ascending: false })
      .range(from, to);

    // Optional tag filter
    if (req.query.tag) {
      query = query.contains('tags', [req.query.tag]);
    }

    // Optional category filter
    if (req.query.category) {
      query = query.eq('category', req.query.category);
    }

    const { data: posts, count, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: posts.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by ID or Slug
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Attempt lookup by ID first, then slug
    let query = supabase
      .from('posts')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('isDeleted', false);

    if (id.match(/^[0-9a-fA-F-]{36}$/)) { // UUID check for Supabase
      query = query.or(`id.eq.${id},slug.eq.${id}`);
    } else {
      query = query.eq('slug', id);
    }

    const { data: post, error } = await query.single();

    if (error || !post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment views (RPC or manual update)
    await supabase
      .from('posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', post.id);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, content, tags, category, status } = req.body;
    const slug = generateSlug(title);

    const { data: post, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          slug,
          tags: tags || [],
          category: category || 'uncategorized',
          status: status || 'draft',
          author_id: req.user.id,
        },
      ])
      .select('*, author:profiles(full_name, avatar_url)')
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private (owner only)
 */
export const updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { title, content, tags, category, status } = req.body;

    // Check ownership
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (existingPost.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const updateData = {
      title: title ?? undefined,
      content: content ?? undefined,
      tags: tags ?? undefined,
      category: category ?? undefined,
      status: status ?? undefined,
      updatedAt: new Date().toISOString()
    };

    if (title) {
      updateData.slug = generateSlug(title);
    }

    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select('*, author:profiles(full_name, avatar_url)')
      .single();

    if (updateError) throw updateError;

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft-delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private (owner only)
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check ownership
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (existingPost.author_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    const { error: deleteError } = await supabase
      .from('posts')
      .update({ isDeleted: true })
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get posts by current authenticated user (including drafts)
 * @route   GET /api/posts/my
 * @access  Private
 */
export const getMyPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('author_id', req.user.id)
      .eq('isDeleted', false)
      .order('updatedAt', { ascending: false })
      .range(from, to);

    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }

    const { data: posts, count, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: posts.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};
