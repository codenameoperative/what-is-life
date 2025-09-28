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
