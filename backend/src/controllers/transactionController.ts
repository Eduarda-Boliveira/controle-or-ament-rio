import { Request, Response } from 'express';
import { TransactionModel } from '../models/Transaction';
import { body, validationResult } from 'express-validator';

export class TransactionController {
  static validateCreate = [
    body('type').isIn(['income', 'expense']).withMessage('Tipo deve ser "income" ou "expense"'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
    body('description').optional().trim(),
    body('date').isISO8601().withMessage('Data inválida'),
    body('category_id').optional({ nullable: true }).isInt().withMessage('ID da categoria inválido'),
    body('payment_method').optional().isIn(['dinheiro', 'cartao', 'pix', 'boleto']).withMessage('Método de pagamento inválido')
  ];

  static validateUpdate = [
    body('type').optional().isIn(['income', 'expense']).withMessage('Tipo deve ser "income" ou "expense"'),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
    body('description').optional().trim(),
    body('date').optional().isISO8601().withMessage('Data inválida'),
    body('category_id').optional({ nullable: true }).isInt().withMessage('ID da categoria inválido'),
    body('payment_method').optional().isIn(['dinheiro', 'cartao', 'pix', 'boleto']).withMessage('Método de pagamento inválido')
  ];

  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId!;
      const { type, amount, description, date, category_id, payment_method } = req.body;

      const transaction = await TransactionModel.create(userId, {
        type,
        amount,
        description,
        date,
        category_id: category_id || null,
        payment_method: payment_method || 'dinheiro'
      });

      res.status(201).json({ 
        message: 'Transação criada com sucesso',
        transaction 
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao criar transação', details: error.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const { startDate, endDate, category_id, type } = req.query;

      const filters: any = {};
      
      if (startDate) filters.startDate = startDate as string;
      if (endDate) filters.endDate = endDate as string;
      if (category_id) filters.category_id = parseInt(category_id as string);
      if (type) filters.type = type as 'income' | 'expense';

      const transactions = await TransactionModel.findByUserId(userId, filters);

      res.json({ transactions });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar transações', details: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const transactionId = parseInt(req.params.id);

      const transaction = await TransactionModel.findById(transactionId);

      if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      if (transaction.userId !== userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      res.json({ transaction });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar transação', details: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId!;
      const transactionId = parseInt(req.params.id);
      const { type, amount, description, date, category_id, payment_method } = req.body;

      const updateData: any = {};
      if (type !== undefined) updateData.type = type;
      if (amount !== undefined) updateData.amount = amount;
      if (description !== undefined) updateData.description = description;
      if (date !== undefined) updateData.date = date;
      if (category_id !== undefined) updateData.category_id = category_id || null;
      if (payment_method !== undefined) updateData.payment_method = payment_method;

      const transaction = await TransactionModel.update(transactionId, userId, updateData);

      if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada ou acesso negado' });
      }

      res.json({ 
        message: 'Transação atualizada com sucesso',
        transaction 
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao atualizar transação', details: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const transactionId = parseInt(req.params.id);

      const success = await TransactionModel.delete(transactionId, userId);

      if (!success) {
        return res.status(404).json({ error: 'Transação não encontrada ou acesso negado' });
      }

      res.json({ message: 'Transação excluída com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao excluir transação', details: error.message });
    }
  }

  static async getBalance(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const balance = await TransactionModel.getBalance(userId);

      res.json({ balance });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao calcular saldo', details: error.message });
    }
  }
}
