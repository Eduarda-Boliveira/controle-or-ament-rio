import { useState, useEffect } from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { Button } from '../../atoms/Button/Button';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../../../api/categories';
import type { Category } from '../../../api/categories';
import styles from './CategoryManager.module.css';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryManager({ isOpen, onClose }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);
      const data = await listCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newCategoryName.trim()) return;

    try {
      setError(null);
      await createCategory({ name: newCategoryName.trim() });
      setNewCategoryName('');
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar categoria');
    }
  }

  async function handleUpdate(id: number) {
    if (!editCategoryName.trim()) return;

    try {
      setError(null);
      await updateCategory(id, { name: editCategoryName.trim() });
      setEditingId(null);
      setEditCategoryName('');
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar categoria');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      setError(null);
      await deleteCategory(id);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir categoria');
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setEditCategoryName(category.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditCategoryName('');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Categorias">
      <div className={styles.container}>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputSection}>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da nova categoria"
            className={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
          />
        </div>

        <div className={styles.listSection}>
          {loading ? (
            <div className={styles.loading}>Carregando...</div>
          ) : categories.length === 0 ? (
            <div className={styles.empty}>Nenhuma categoria cadastrada</div>
          ) : (
            <ul className={styles.list}>
              {categories.map((category) => (
                <li key={category.id} className={styles.item}>
                  {editingId === category.id ? (
                    <div className={styles.editRow}>
                      <input
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className={styles.input}
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(category.id)}
                        autoFocus
                      />
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className={styles.saveBtn}
                          disabled={!editCategoryName.trim()}
                        >
                          Salvar
                        </button>
                        <button onClick={cancelEdit} className={styles.cancelBtn}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.viewRow}>
                      <span className={styles.name}>{category.name}</span>
                      <div className={styles.actions}>
                        <button
                          onClick={() => startEdit(category)}
                          className={styles.editBtn}
                          title="Editar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className={styles.deleteBtn}
                          title="Excluir"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.buttonSection}>
          <Button onClick={handleCreate} disabled={!newCategoryName.trim()}>
            Cadastrar Categoria
          </Button>
        </div>
      </div>
    </Modal>
  );
}
