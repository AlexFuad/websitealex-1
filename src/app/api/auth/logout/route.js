import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/jwt'

export async function POST(request) {
  try {
    // Create response and clear auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    })

    // Clear the auth cookie
    clearAuthCookie(response)

    return response

  } catch (error) {
    console.error('Logout API error:', error)
    
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
