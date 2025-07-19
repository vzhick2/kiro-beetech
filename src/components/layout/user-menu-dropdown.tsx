'use client'

import { 
  User, 
  LogOut, 
  Bell, 
  Building2, 
  Shield, 
  Download, 
  FileDown, 
  Database 
} from 'lucide-react'
import Link from 'next/link'

interface UserMenuDropdownProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
  businessName?: string
}

export function UserMenuDropdown({ 
  isOpen, 
  onClose, 
  userEmail = "user@example.com",
  businessName = "Your Business" 
}: UserMenuDropdownProps) {
  
  const handleExportData = () => {
    // Export functionality will be implemented when needed
    onClose()
  }

  const handleExportRecentChanges = () => {
    // Recent changes export will be implemented when needed
    onClose()
  }

  const handleLogout = () => {
    // Logout functionality will be implemented when needed
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-12 right-0 w-72 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-xl z-50">
      {/* User Info Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              {businessName}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {userEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        {/* Settings Section */}
        <div className="px-2 pb-2">
          <h4 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Settings
          </h4>
          <div className="space-y-1">
            <Link
              href="/settings#notifications"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200"
            >
              <Bell className="w-4 h-4" />
              <div className="flex-1">
                <div className="font-medium">Notification Preferences</div>
                <div className="text-xs text-slate-400">Alert thresholds, email settings</div>
              </div>
            </Link>
            
            <Link
              href="/settings#business"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200"
            >
              <Building2 className="w-4 h-4" />
              <div className="flex-1">
                <div className="font-medium">Business Configuration</div>
                <div className="text-xs text-slate-400">Labor rates, currency, units</div>
              </div>
            </Link>

            <Link
              href="/settings#security"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              <div className="flex-1">
                <div className="font-medium">Security & Privacy</div>
                <div className="text-xs text-slate-400">Account security, data privacy</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="px-2 py-2 border-t border-slate-700/50">
          <h4 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Data Management
          </h4>
          <div className="space-y-1">
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <div className="flex-1 text-left">
                <div className="font-medium">Export All Data</div>
                <div className="text-xs text-slate-400">Items, purchases, suppliers (CSV)</div>
              </div>
            </button>

            <button
              onClick={handleExportRecentChanges}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200"
            >
              <FileDown className="w-4 h-4" />
              <div className="flex-1 text-left">
                <div className="font-medium">Export Recent Changes</div>
                <div className="text-xs text-slate-400">Last 30 days activity (CSV)</div>
              </div>
            </button>

            <Link
              href="/reports"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-white rounded-lg transition-all duration-200"
            >
              <Database className="w-4 h-4" />
              <div className="flex-1">
                <div className="font-medium">View Reports</div>
                <div className="text-xs text-slate-400">Analytics, financial insights</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Account Section */}
        <div className="px-2 pt-2 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <div className="font-medium">Sign Out</div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700/50 bg-slate-800/30">
        <div className="text-xs text-slate-400 text-center">
          <Link 
            href="/help"
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            Help & Documentation
          </Link>
          <span className="mx-2">•</span>
          <Link 
            href="/about"
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  )
} 