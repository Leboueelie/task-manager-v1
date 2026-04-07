import { z } from 'zod'

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est obligatoire')
    .max(200, 'Titre trop long (max 200 caractères)'),
  description: z
    .string()
    .max(1000, 'Description trop longue')
    .optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'La priorité est obligatoire',
  }),
  status: z.enum(['todo', 'done'], {
    required_error: 'Le statut est obligatoire',
  }),
  due_date: z
    .string()
    .optional()
    .nullable(),
})

// Type par défaut pour une nouvelle tâche
export const defaultTaskValues = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  due_date: '',
}