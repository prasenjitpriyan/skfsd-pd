export interface Office {
  id: string
  name: string
  code: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  phone: string
  email: string
  isActive: boolean
  metadata: {
    region: string
    divisionCode: string
    establishedDate: Date
  }
  deliveryCenters?: DeliveryCenter[]
  createdAt: Date
  updatedAt: Date
}

export interface DeliveryCenter {
  id: string
  name: string
  code: string
  associatedOfficeId: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  phone: string
  capacity: {
    maxDailyPackages: number
    maxDailyParcels: number
  }
  operationalHours: {
    start: string
    end: string
    workingDays: string[]
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateOfficeRequest {
  name: string
  code: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  phone: string
  email: string
  metadata?: {
    region: string
    divisionCode: string
    establishedDate: Date
  }
}

export interface UpdateOfficeRequest {
  name?: string
  address?: Partial<Office['address']>
  phone?: string
  email?: string
  isActive?: boolean
  metadata?: Partial<Office['metadata']>
}
