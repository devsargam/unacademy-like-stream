import React from "react";

type Tab = 'slides' | 'whiteboard' | 'zoom'

export default function BottomBar({ currentTab, setCurrentTab }: { currentTab: Tab, setCurrentTab: (tab: Tab) => void }) {
  return <footer className="flex justify-center items-center h-12 bg-white bottom-0 gap-x-5">
    <button className={`bg-blue-500 text-white px-4 py-2 rounded-md ${currentTab === 'slides' ? 'bg-blue-500' : 'bg-gray-700'}`} onClick={() => setCurrentTab('slides')}>Slides</button>
    <button className={`bg-blue-500 text-white px-4 py-2 rounded-md ${currentTab === 'whiteboard' ? 'bg-blue-500' : 'bg-gray-700'}`} onClick={() => setCurrentTab('whiteboard')}>Whiteboard</button>
    <button className={`bg-blue-500 text-white px-4 py-2 rounded-md ${currentTab === 'zoom' ? 'bg-blue-500' : 'bg-gray-700'}`} onClick={() => setCurrentTab('zoom')}>Zoom</button>
  </footer>
}
