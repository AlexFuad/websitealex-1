import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/models'
import { generateToken, setAuthCookie } from '@/lib/jwt'

export async function POST(request) {
  try {
    // Check if environment variables are set
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        message: 'Database not configured. Please set MONGODB_URI environment variable.'
      }, { status: 500 })
    }

    // Connect to database
    await connectDB()

    // Parse request body
    const body = await request.json()
    const { username, password, recaptchaToken } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required'
      }, { status: 400 })
    }

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json({
        success: false,
        message: 'reCAPTCHA verification is required'
      }, { status: 400 })
    }

    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    )

    const recaptchaResult = await recaptchaResponse.json()

    if (!recaptchaResult.success) {
      return NextResponse.json({
        success: false,
        message: 'reCAPTCHA verification failed'
      }, { status: 400 })
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username.toLowerCase() }
      ]
    }).select('+password')

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 })
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({
        success: false,
        message: 'Account is deactivated'
      }, { status: 401 })
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      }, { status: 403 })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 })
    }

    // Update last login
    user.last_login = new Date()
    await user.save()

    // Generate JWT token
    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }

    const token = generateToken(tokenPayload)

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile_image: user.profile_image,
          last_login: user.last_login
        }
      }
    })

    // Set auth cookie
    setAuthCookie(response, token)

    return response

  } catch (error) {
    console.error('Login API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET(request) {
  return NextResponse.json({
    success: false,
    message: 'Method not allowed'
  }, { status: 405 })
}
