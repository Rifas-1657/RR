import { BookeyBadge } from '@/components/ui-kit/bookey-badge'
import { adminMembers } from '@/lib/mock'

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-muted-foreground">Admin shell placeholder. Sample members only — no account system yet.</p>
      </div>
      <div className="overflow-x-auto rounded-3xl border bg-card">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <caption className="sr-only">Team members and their roles</caption>
          <thead className="border-b text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Name</th>
              <th scope="col" className="px-5 py-3 font-medium">Role</th>
              <th scope="col" className="px-5 py-3 font-medium">Last active</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {adminMembers.map((member) => (
              <tr key={member.id}>
                <td className="px-5 py-4">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </td>
                <td className="px-5 py-4">
                  <BookeyBadge tone={member.role === 'owner' ? 'brand' : 'outline'} className="capitalize">
                    {member.role}
                  </BookeyBadge>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  <time dateTime={member.lastActiveAt}>{dateFormat.format(new Date(member.lastActiveAt))}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
