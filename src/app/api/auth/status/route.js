import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/jwt'

export async function GET(request) {
  try {
    // Check if environment variables are set
    if (!process.env.JWT_SECRET) {
      return NextResponse.json({
        success: false,
        message: 'Authentication not configured. Please set JWT_SECRET environment variable.'
      }, { status: 500 })
    }

    // Get user from token
    const user = getUserFromToken(request)

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: 'User is authenticated',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    })

  } catch (error) {
    console.error('Auth status API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
