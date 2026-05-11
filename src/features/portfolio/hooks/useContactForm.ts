import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { portfolioService } from '../services/portfolio.service';
import type { ContactInput } from '../types/portfolio.types';

export const contactSchema = z.object({
  name:    z.string().min(2,  'Name must be at least 2 characters.'),
  email:   z.string().email('Please enter a valid email address.'),
  subject: z.string().min(3,  'Subject must be at least 3 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export function useContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  const mutation = useMutation({
    mutationFn: portfolioService.sendContact,
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (!mutation.isPending) {
      mutation.mutate(data);
    }
  });

  return { form, onSubmit, mutation };
}
