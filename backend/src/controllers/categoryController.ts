import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
import { body, validationResult } from 'express-validator';

export class CategoryController {
  static validateCreate = [
    body('name').trim().notEmpty().withMessage('Nome é obrigatório')
  ];

  static validateUpdate = [
    body('name').optional().trim().notEmpty().withMessage('Nome não pode ser vazio')
  ];

  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId!;
      const { name } = req.body;

      const category = await CategoryModel.create(userId, { name });

      res.status(201).json({ 
        message: 'Categoria criada com sucesso',
        category 
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao criar categoria', details: error.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = req.userId!;

      const categories = await CategoryModel.findByUserId(userId);

      res.json({ categories });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao listar categorias', details: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const categoryId = parseInt(req.params.id);

      const category = await CategoryModel.findById(categoryId);

      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      if (category.userId !== userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      res.json({ category });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar categoria', details: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId!;
      const categoryId = parseInt(req.params.id);
      const { name } = req.body;

      const category = await CategoryModel.update(categoryId, userId, { name });

      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada ou acesso negado' });
      }

      res.json({ 
        message: 'Categoria atualizada com sucesso',
        category 
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao atualizar categoria', details: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = req.userId!;
      const categoryId = parseInt(req.params.id);

      const success = await CategoryModel.delete(categoryId, userId);

      if (!success) {
        return res.status(404).json({ error: 'Categoria não encontrada ou acesso negado' });
      }

      res.json({ message: 'Categoria excluída com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao excluir categoria', details: error.message });
    }
  }
}
