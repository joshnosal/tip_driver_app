export type DeviceProps = {
  _id: string
  name: string
  company: string
  device_id: string
  last_used: string
  status: 'active'|'deleted'
  ip_address: string
  createdAt: string
  updatedAt: string
}

export interface CompanyProps {
  _id: string
  name: string
  admins: string[]
  basic_users: string[]
  stripe_id?: string
  stripe_customer_id: string
  tip_levels: number[]
  custom_tip: boolean
  invites: {
    admins: string[]
    basic_users: string[]
  },
  devices: DeviceProps[]
  createdAt: string
  updatedAt: string
}
