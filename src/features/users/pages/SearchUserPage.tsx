import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { UserDetailsDrawer } from '../components/UserDetailsDrawer';

export default function SearchUserPage() {
  const [phoneInput, setPhoneInput] = useState('');
  const [searchPhone, setSearchPhone] = useState<string | null>(null);

  const handleSearch = () => {
    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length >= 10) {
      setSearchPhone(cleanPhone);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Users</h1>
        <p className="text-gray-500 mt-1">Find users by their phone number</p>
      </div>

      {/* Search Bar */}
      <div className="card p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Enter phone number (e.g., 9876543210)"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyDown={handleKeyDown}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Enter the user's phone number with or without country code
        </p>
      </div>

      {/* Empty State */}
      {!searchPhone && (
        <div className="card">
          <EmptyState
            icon={Users}
            title="Search for a user"
            message="Enter a phone number above to find and view user details"
          />
        </div>
      )}

      {/* User Details Drawer */}
      <UserDetailsDrawer phone={searchPhone} onClose={() => setSearchPhone(null)} />
    </div>
  );
}
