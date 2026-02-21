const { validationResult } = require('express-validator');
const Post = require('../models/Post');

/**
 * @desc    Get all published posts (public feed)
 * @route   GET /api/posts
 * @access  Public
 */
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { status: 'published' };

    // Optional tag filter
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    // Optional category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name avatar'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

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
const createPost = async (req, res, next) => {
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

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      category: category || 'uncategorized',
      status: status || 'draft',
      author: req.user.id,
    });

    const populated = await post.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      data: populated,
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
const updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Ensure user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const { title, content, tags, category, status } = req.body;

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.tags = tags ?? post.tags;
    post.category = category ?? post.category;
    post.status = status ?? post.status;

    await post.save();
    await post.populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      data: post,
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
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Ensure user owns the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    post.isDeleted = true;
    await post.save();

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
const getMyPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { author: req.user.id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
};
