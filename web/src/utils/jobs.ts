export type JobTier = 'entry' | 'intermediate' | 'advanced' | 'expert'

export interface JobDefinition {
  id: string
  name: string
  tier: JobTier
  description: string
  payPerWork: { min: number; max: number } // base payout range per Work action
  requirements?: {
    minWTC?: number // requires at least this much WTC in wallet (not consumed)
    requiredItemId?: string // must own this item in inventory
  }
}

// Universal jobs list (extend here)
export const jobs: Record<string, JobDefinition> = {
  // Entry-level
  courier: {
    id: 'courier',
    name: 'Courier',
    tier: 'entry',
    description: 'Deliver small packages around town. Light requirements and modest pay.',
    payPerWork: { min: 6, max: 16 },
  },
  barista: {
    id: 'barista',
    name: 'Barista',
    tier: 'entry',
    description: 'Serve coffee and keep the lines moving. Customer service experience helps.',
    payPerWork: { min: 7, max: 18 },
    requirements: { minWTC: 50 },
  },

  // Intermediate
  warehouse_worker: {
    id: 'warehouse_worker',
    name: 'Warehouse Worker',
    tier: 'intermediate',
    description: 'Organize inventory and move cargo. Some stamina required.',
    payPerWork: { min: 12, max: 28 },
    requirements: { minWTC: 100 },
  },
  field_technician: {
    id: 'field_technician',
    name: 'Field Technician',
    tier: 'intermediate',
    description: 'Visit sites to perform basic maintenance work. Tools recommended.',
    payPerWork: { min: 14, max: 32 },
    requirements: { requiredItemId: 'toolkit_pro' },
  },

  // Advanced
  excavation_specialist: {
    id: 'excavation_specialist',
    name: 'Excavation Specialist',
    tier: 'advanced',
    description: 'Operate tools to uncover resources. A sturdy shovel is essential.',
    payPerWork: { min: 20, max: 42 },
    requirements: { requiredItemId: 'shovel' },
  },
  fishing_operator: {
    id: 'fishing_operator',
    name: 'Fishing Operator',
    tier: 'advanced',
    description: 'Run small-scale fishing operations. Rod required.',
    payPerWork: { min: 22, max: 45 },
    requirements: { requiredItemId: 'fishing_rod' },
  },

  // Expert
  big_game_hunter: {
    id: 'big_game_hunter',
    name: 'Big Game Hunter',
    tier: 'expert',
    description: 'Track and hunt large game. Rifle required and steady nerves.',
    payPerWork: { min: 35, max: 70 },
    requirements: { requiredItemId: 'hunting_rifle', minWTC: 300 },
  },
  operations_manager: {
    id: 'operations_manager',
    name: 'Operations Manager',
    tier: 'expert',
    description: 'Coordinate teams and optimize processes. Professional gear recommended.',
    payPerWork: { min: 40, max: 85 },
    requirements: { minWTC: 500, requiredItemId: 'master_toolkit' },
  },

  // Additional Entry Level Jobs
  fast_food_worker: {
    id: 'fast_food_worker',
    name: 'Fast Food Worker',
    tier: 'entry',
    description: 'Work the grill and serve customers quickly. Basic kitchen skills help.',
    payPerWork: { min: 5, max: 12 },
  },
  retail_associate: {
    id: 'retail_associate',
    name: 'Retail Associate',
    tier: 'entry',
    description: 'Help customers and maintain store displays. Friendly attitude required.',
    payPerWork: { min: 6, max: 14 },
  },
  delivery_driver: {
    id: 'delivery_driver',
    name: 'Delivery Driver',
    tier: 'entry',
    description: 'Transport packages and food orders. Reliable transportation needed.',
    payPerWork: { min: 8, max: 18 },
    requirements: { requiredItemId: 'phone' },
  },
  janitor: {
    id: 'janitor',
    name: 'Janitor',
    tier: 'entry',
    description: 'Keep facilities clean and organized. Attention to detail important.',
    payPerWork: { min: 4, max: 10 },
  },
  gas_station_attendant: {
    id: 'gas_station_attendant',
    name: 'Gas Station Attendant',
    tier: 'entry',
    description: 'Pump gas and handle convenience store sales. Night shift available.',
    payPerWork: { min: 7, max: 15 },
  },

  // Additional Intermediate Jobs
  office_assistant: {
    id: 'office_assistant',
    name: 'Office Assistant',
    tier: 'intermediate',
    description: 'Handle administrative tasks and customer service. Computer skills helpful.',
    payPerWork: { min: 10, max: 22 },
    requirements: { minWTC: 75 },
  },
  mechanic_apprentice: {
    id: 'mechanic_apprentice',
    name: 'Mechanic Apprentice',
    tier: 'intermediate',
    description: 'Assist with vehicle repairs and maintenance. Mechanical aptitude required.',
    payPerWork: { min: 13, max: 28 },
    requirements: { minWTC: 150, requiredItemId: 'basic_toolkit' },
  },
  security_guard: {
    id: 'security_guard',
    name: 'Security Guard',
    tier: 'intermediate',
    description: 'Monitor premises and ensure safety. Vigilance and responsibility needed.',
    payPerWork: { min: 11, max: 25 },
    requirements: { minWTC: 100 },
  },
  chef_assistant: {
    id: 'chef_assistant',
    name: 'Chef Assistant',
    tier: 'intermediate',
    description: 'Prepare ingredients and assist head chef. Culinary interest beneficial.',
    payPerWork: { min: 12, max: 26 },
    requirements: { minWTC: 125, requiredItemId: 'knife_set' },
  },
  pharmacy_technician: {
    id: 'pharmacy_technician',
    name: 'Pharmacy Technician',
    tier: 'intermediate',
    description: 'Assist pharmacist with medication preparation. Attention to detail critical.',
    payPerWork: { min: 14, max: 30 },
    requirements: { minWTC: 200, requiredItemId: 'medical_license' },
  },

  // Additional Advanced Jobs
  construction_worker: {
    id: 'construction_worker',
    name: 'Construction Worker',
    tier: 'advanced',
    description: 'Build and repair structures. Physical strength and safety awareness required.',
    payPerWork: { min: 18, max: 38 },
    requirements: { minWTC: 250, requiredItemId: 'hard_hat' },
  },
  electrician: {
    id: 'electrician',
    name: 'Electrician',
    tier: 'advanced',
    description: 'Install and repair electrical systems. Technical knowledge and certification needed.',
    payPerWork: { min: 20, max: 42 },
    requirements: { minWTC: 300, requiredItemId: 'electrical_kit' },
  },
  plumber: {
    id: 'plumber',
    name: 'Plumber',
    tier: 'advanced',
    description: 'Install and repair plumbing systems. Problem-solving skills essential.',
    payPerWork: { min: 19, max: 40 },
    requirements: { minWTC: 275, requiredItemId: 'plumbing_tools' },
  },
  truck_driver: {
    id: 'truck_driver',
    name: 'Truck Driver',
    tier: 'advanced',
    description: 'Transport goods across long distances. Commercial license required.',
    payPerWork: { min: 25, max: 50 },
    requirements: { minWTC: 400, requiredItemId: 'cdl_license' },
  },
  welder: {
    id: 'welder',
    name: 'Welder',
    tier: 'advanced',
    description: 'Join metal components using heat and tools. Precision and safety gear required.',
    payPerWork: { min: 22, max: 45 },
    requirements: { minWTC: 350, requiredItemId: 'welding_equipment' },
  },

  // Additional Expert Jobs
  surgeon: {
    id: 'surgeon',
    name: 'Surgeon',
    tier: 'expert',
    description: 'Perform complex surgical procedures. Medical degree and years of training required.',
    payPerWork: { min: 60, max: 120 },
    requirements: { minWTC: 1000, requiredItemId: 'medical_degree' },
  },
  lawyer: {
    id: 'lawyer',
    name: 'Lawyer',
    tier: 'expert',
    description: 'Provide legal counsel and representation. Law degree and bar certification needed.',
    payPerWork: { min: 55, max: 110 },
    requirements: { minWTC: 800, requiredItemId: 'law_degree' },
  },
  software_engineer: {
    id: 'software_engineer',
    name: 'Software Engineer',
    tier: 'expert',
    description: 'Design and develop software applications. Programming expertise required.',
    payPerWork: { min: 50, max: 100 },
    requirements: { minWTC: 600, requiredItemId: 'computer_science_degree' },
  },
  investment_banker: {
    id: 'investment_banker',
    name: 'Investment Banker',
    tier: 'expert',
    description: 'Manage financial transactions and advise clients. Finance background essential.',
    payPerWork: { min: 70, max: 140 },
    requirements: { minWTC: 1200, requiredItemId: 'finance_degree' },
  },
  architect: {
    id: 'architect',
    name: 'Architect',
    tier: 'expert',
    description: 'Design buildings and oversee construction. Creative vision and technical knowledge needed.',
    payPerWork: { min: 45, max: 90 },
    requirements: { minWTC: 700, requiredItemId: 'architecture_degree' },
  },
}

export const jobTierOrder: Record<JobTier, number> = {
  entry: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
}

// ========================================
// TEMPLATE FOR ADDING NEW JOBS
// ========================================
// Add new jobs to the `jobs` object above using this template:
// {
//   id: 'unique_job_id',
//   name: 'Job Display Name',
//   tier: 'entry', // entry | intermediate | advanced | expert
//   description: 'Job description explaining what the job entails',
//   payPerWork: { min: 10, max: 25 }, // Base payout range per work action
//   requirements: { // Optional - leave out if no requirements
//     minWTC: 100, // Requires at least this much WTC in wallet
//     requiredItemId: 'item_id' // Must own this item in inventory
//   }
// }
// ========================================
