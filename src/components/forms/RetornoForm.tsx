'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Retorno } from '@/types';
import { useRetornoViewModel } from '@/viewmodels/useRetornoViewModel';

const schema = z.object({
  retorno1: z.number(),
  retorno2: z.number(),
  retorno3: z.number(),
  retorno4: z.number(),
  retorno5: z.number(),
});

interface RetornoFormProps {
  retorno?: Retorno;
}

export default function RetornoForm({ retorno }: RetornoFormProps) {
  const { isSaving, error, saveRetorno } = useRetornoViewModel();
  const { register, handleSubmit, formState: { errors } } = useForm<Retorno>({
    resolver: zodResolver(schema),
    defaultValues: retorno,
  });

  const onSubmit: SubmitHandler<Retorno> = async (data) => {
    await saveRetorno(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="retorno1" className="block text-sm font-medium text-gray-700">Retorno 1</label>
        <input
          id="retorno1"
          type="number"
          {...register('retorno1', { valueAsNumber: true })}
          className="input w-full"
        />
        {errors.retorno1 && <p className="text-red-500 text-sm mt-1">{errors.retorno1.message}</p>}
      </div>

      <div>
        <label htmlFor="retorno2" className="block text-sm font-medium text-gray-700">Retorno 2</label>
        <input
          id="retorno2"
          type="number"
          {...register('retorno2', { valueAsNumber: true })}
          className="input w-full"
        />
        {errors.retorno2 && <p className="text-red-500 text-sm mt-1">{errors.retorno2.message}</p>}
      </div>

      <div>
        <label htmlFor="retorno3" className="block text-sm font-medium text-gray-700">Retorno 3</label>
        <input
          id="retorno3"
          type="number"
          {...register('retorno3', { valueAsNumber: true })}
          className="input w-full"
        />
        {errors.retorno3 && <p className="text-red-500 text-sm mt-1">{errors.retorno3.message}</p>}
      </div>

      <div>
        <label htmlFor="retorno4" className="block text-sm font-medium text-gray-700">Retorno 4</label>
        <input
          id="retorno4"
          type="number"
          {...register('retorno4', { valueAsNumber: true })}
          className="input w-full"
        />
        {errors.retorno4 && <p className="text-red-500 text-sm mt-1">{errors.retorno4.message}</p>}
      </div>

      <div>
        <label htmlFor="retorno5" className="block text-sm font-medium text-gray-700">Retorno 5</label>
        <input
          id="retorno5"
          type="number"
          {...register('retorno5', { valueAsNumber: true })}
          className="input w-full"
        />
        {errors.retorno5 && <p className="text-red-500 text-sm mt-1">{errors.retorno5.message}</p>}
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={isSaving}>
        {isSaving ? 'Salvando...' : 'Salvar'}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
    </form>
  );
}
