'use client'
import ChatArea from '@/components/chat/ChatArea'
import Sidebar from '@/components/chat/SideBar'
import React, { useState } from 'react'


function Page() {

  return (
    <div className="h-screen bg-black text-white flex flex-col lg:flex-row">
      <Sidebar/>
      <ChatArea/>
    </div>
  )
}

export default Page