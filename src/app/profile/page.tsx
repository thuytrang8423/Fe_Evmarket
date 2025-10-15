"use client";
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ProfileSettings from '@/components/Profile/ProfileSettings'
import AuthWrapper from '../../components/common/AuthWrapper'
import React from 'react'

function page() {
  return (
    <AuthWrapper loadingMessage="Loading profile...">
      <Header />
      <ProfileSettings />
      <Footer />
    </AuthWrapper>
  )
}

export default page