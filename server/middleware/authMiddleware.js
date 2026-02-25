import { supabase } from '../config/supabase.js';

/**
 * Protect routes — require valid Supabase session
 */
export const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }

  try {
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — invalid or expired token',
      });
    }

    // Attach user to request
    // Note: We might want to fetch more profile info here if needed
    req.user = {
      id: user.id,
      email: user.email,
      role: user.app_metadata?.role || 'user',
      ...user.user_metadata
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — server error during authentication',
    });
  }
};

/**
 * Restrict to specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized for this resource`,
      });
    }
    next();
  };
};

// module.exports removed, using exports
