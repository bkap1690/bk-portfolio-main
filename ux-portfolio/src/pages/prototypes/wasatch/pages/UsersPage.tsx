import { useState, useEffect } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAllUsers, initializeUsersData } from '../data/usersData';
import type { User } from '../data/usersData';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize users data and load users
    try {
      initializeUsersData();
      loadUsers();
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    }
  }, []);

  const loadUsers = () => {
    try {
      const allUsers = getAllUsers();
      console.log('Loaded users:', allUsers);
      setUsers(allUsers);
    } catch (err) {
      console.error('Error in loadUsers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.organization?.toLowerCase().includes(searchLower) ||
      false
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-wasatch-status-success-bg text-wasatch-status-success border-wasatch-status-success-border';
      case 'inactive':
        return 'bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border';
      case 'pending':
        return 'bg-wasatch-status-warning-bg text-wasatch-status-warning border-wasatch-status-warning-border';
      default:
        return 'bg-wasatch-neutral-100 text-wasatch-text-secondary border-wasatch-border';
    }
  };

  const getAccountTypeBadgeColor = (type: string) => {
    return type === 'institutional'
      ? 'bg-wasatch-status-info-bg text-wasatch-status-info border-wasatch-status-info-border'
      : 'bg-wasatch-status-purple-bg text-wasatch-status-purple border-wasatch-status-purple-border';
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="px-6 py-6">
        <div className="bg-wasatch-status-error-bg border border-wasatch-status-error-border rounded-wasatch-md p-wasatch-6 text-center">
          <h2 className="text-wasatch-xl font-wasatch-medium text-wasatch-status-error mb-wasatch-2">Error Loading Users</h2>
          <p className="text-wasatch-status-error">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadUsers();
            }}
            className="mt-wasatch-4 px-wasatch-4 py-wasatch-2 bg-wasatch-status-error text-wasatch-text-inverse rounded-wasatch-sm hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-wasatch-3xl font-wasatch-normal text-wasatch-text-heading mb-wasatch-2">User Management</h1>
          <p className="text-wasatch-text-secondary">Manage user accounts and permissions</p>
        </div>
        <button className="flex items-center gap-wasatch-2 px-wasatch-4 py-wasatch-2 bg-wasatch-accent text-wasatch-text-inverse rounded-wasatch-sm hover:bg-wasatch-accent-hover transition-colors cursor-pointer">
          <UserPlus size={20} />
          <span className="font-wasatch-medium">Add User</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-wasatch-6 flex items-center gap-wasatch-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-wasatch-3 top-1/2 -translate-y-1/2 text-wasatch-text-placeholder"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users by name, email, username, or organization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-wasatch-4 py-wasatch-2 border border-wasatch-border-strong rounded-wasatch-sm focus:outline-none focus:ring-2 focus:ring-wasatch-accent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-wasatch-md border border-wasatch-border bg-wasatch-surface">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-wasatch-border bg-wasatch-surface-subtle">
              <tr>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Name
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Email
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Account Type
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Organization
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Role
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Status
                </th>
                <th className="px-wasatch-4 py-wasatch-3 text-left text-wasatch-xs font-wasatch-medium uppercase text-wasatch-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-wasatch-border"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
            >
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-wasatch-4 py-wasatch-8 text-center text-wasatch-text-muted">
                    {searchTerm ? 'No users found matching your search.' : 'No users yet.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
                    }}
                    className="hover:bg-wasatch-surface-subtle transition-colors"
                  >
                    {/* Name */}
                    <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-heading font-wasatch-medium whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>

                    {/* Email */}
                    <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary whitespace-nowrap">
                      {user.email}
                    </td>

                    {/* Account Type */}
                    <td className="px-wasatch-4 py-wasatch-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getAccountTypeBadgeColor(
                          typeof user.accountType === 'string' ? user.accountType : 'individual'
                        )}`}
                      >
                        {typeof user.accountType === 'string' ? user.accountType : 'individual'}
                      </span>
                    </td>

                    {/* Organization */}
                    <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary whitespace-nowrap">
                      {user.organization || '—'}
                    </td>

                    {/* Role */}
                    <td className="px-wasatch-4 py-wasatch-3 text-wasatch-sm text-wasatch-text-secondary whitespace-nowrap capitalize">
                      {user.role?.replace('-', ' ') || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-wasatch-4 py-wasatch-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>


                    {/* Actions */}
                    <td className="px-wasatch-4 py-wasatch-3 whitespace-nowrap">
                      <div className="flex items-center gap-wasatch-2">
                        <button className="text-wasatch-xs text-wasatch-primary hover:underline">View</button>
                        <span className="text-wasatch-neutral-300">|</span>
                        <button className="text-xs text-wasatch-primary hover:underline">Edit</button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      {filteredUsers.length > 0 && (
        <div className="mt-wasatch-4 text-wasatch-sm text-wasatch-text-secondary">
          Showing {filteredUsers.length} of {users.length} user{users.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
