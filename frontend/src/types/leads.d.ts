export interface Lead {
  id: string,
  user_type: 'STUDENT' | 'ADMIN'
  name: string
  email: string
  phone: string
  created_at: string,
  tags: TagLead[]
}

export interface TagLead {
  title: string;
  id: string;
}
