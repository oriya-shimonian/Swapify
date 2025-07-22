import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { aboutRoutes } from '@/settings';


export interface AboutSection {
  section_id: number;
  title: string | null;
  content: string | null;
  updated_by: string | null;
}

interface NewSection {
  title: string;
  content: string;
}

export function useAboutSections() {
  const { user } = useAuth();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null);
  const [newSection, setNewSection] = useState<NewSection>({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data } = await axios.get<AboutSection[]>(aboutRoutes.getAllSections);
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('שגיאה בטעינת אזור אודות', error);
      setSections([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isNew = false
  ) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewSection((prev) => ({ ...prev, [name]: value }));
    } else if (editingSection) {
      setEditingSection({ ...editingSection, [name]: value });
    }
  };

  const createSection = async () => {
    if (!user || (!newSection.title && !newSection.content)) return;

    setLoading(true);
    await axios.post(aboutRoutes.createSection, {
      ...newSection,
      userName: user.name,
      userId: user.user_id,
    });
    setNewSection({ title: '', content: '' });
    await fetchSections();
    setLoading(false);
  };

  const updateSection = async () => {
    if (!user || !editingSection) return;

    setLoading(true);
    await axios.put(aboutRoutes.updateSection(editingSection.section_id), {
      title: editingSection.title,
      content: editingSection.content,
      userName: user.name,
      userId: user.user_id,
    });
    setEditingSection(null);
    await fetchSections();
    setLoading(false);
  };

//   const deleteSection = async (id: number) => {
//     if (!user || !window.confirm('את בטוחה שתרצי למחוק את החלק הזה?')) return;

//     await axios.delete(aboutRoutes.deleteSection(id), {
//       data: {
//         userName: user.name,
//         userId: user.user_id,
//       },
//     });

//     await fetchSections();
//   };
const deleteSection = async (id: number) => {
    if (!user) return;
  
    await axios.delete(aboutRoutes.deleteSection(id), {
      data: {
        userName: user.name,
        userId: user.user_id,
      },
    });
  
    await fetchSections();
  };
  
  return {
    sections,
    editingSection,
    newSection,
    loading,
    setEditingSection,
    handleChange,
    createSection,
    updateSection,
    deleteSection,
  };
}
