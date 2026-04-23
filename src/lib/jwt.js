import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME || '7d'

// Generate JWT token
export function generateToken(payload) {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_TIME,
      issuer: 'websitealex-1',
      audience: 'websitealex-users'
    })
  } catch (error) {
    console.error('JWT generation error:', error)
    throw new Error('Failed to generate authentication token')
  }
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'websitealex-1',
      audience: 'websitealex-users'
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired')
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    } else {
      console.error('JWT verification error:', error)
      throw new Error('Token verification failed')
    }
  }
}

// Decode JWT token without verification (for debugging)
export function decodeToken(token) {
  try {
    return jwt.decode(token, { complete: true })
  } catch (error) {
    console.error('JWT decode error:', error)
    return null
  }
}

// Set HTTP-only cookie with JWT token
export function setAuthCookie(res, token) {
  const cookie = serialize('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  })
  
  res.setHeader('Set-Cookie', cookie)
}

// Clear auth cookie
export function clearAuthCookie(res) {
  const cookie = serialize('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
    expires: new Date(0)
  })
  
  res.setHeader('Set-Cookie', cookie)
}

// Get token from request headers or cookies
export function getTokenFromRequest(req) {
  // Try to get from Authorization header first
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Try to get from cookies
  const cookies = req.headers.get('cookie')
  if (cookies) {
    const cookieArray = cookies.split(';').map(cookie => cookie.trim())
    const authCookie = cookieArray.find(cookie => cookie.startsWith('auth-token='))
    if (authCookie) {
      return authCookie.substring('auth-token='.length)
    }
  }
  
  return null
}

// Check if user is authenticated
export function isAuthenticated(req) {
  const token = getTokenFromRequest(req)
  if (!token) return false
  
  try {
    verifyToken(token)
    return true
  } catch (error) {
    return false
  }
}

// Get user info from token
export function getUserFromToken(req) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  
  try {
    const decoded = verifyToken(token)
    return decoded
  } catch (error) {
    return null
  }
}

// Middleware for API routes
export function withAuth(handler) {
  return async (req, res) => {
    try {
      const token = getTokenFromRequest(req)
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: 'Authentication required' 
        })
      }
      
      const user = verifyToken(token)
      req.user = user
      
      return await handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      
      if (error.message.includes('expired')) {
        return res.status(401).json({ 
          success: false,
          message: 'Token has expired' 
        })
      }
      
      return res.status(401).json({ 
        success: false,
        message: 'Invalid authentication' 
      })
    }
  }
}

// Generate refresh token
export function generateRefreshToken(payload) {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '30d',
      issuer: 'websitealex-1',
      audience: 'websitealex-users'
    })
  } catch (error) {
    console.error('Refresh token generation error:', error)
    throw new Error('Failed to generate refresh token')
  }
}

// Verify refresh token
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'websitealex-1',
      audience: 'websitealex-users'
    })
  } catch (error) {
    throw new Error('Invalid refresh token')
  }
}

export default {
  generateToken,
  verifyToken,
  decodeToken,
  setAuthCookie,
  clearAuthCookie,
  getTokenFromRequest,
  isAuthenticated,
  getUserFromToken,
  withAuth,
  generateRefreshToken,
  verifyRefreshToken
}
