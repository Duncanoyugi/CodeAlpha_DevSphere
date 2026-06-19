import { PageHeader } from '../components/PageHeader'
import { NotificationList } from '../features/notifications/components/NotificationList'

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Activity"
        title="Notifications"
        description="Track likes, comments, follows, and badges from the DevSphere community."
      />
      <NotificationList />
    </div>
  )
}
